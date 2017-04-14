import React, {Component} from "react"
import {connect} from "react-redux"
import ClientFilter from "../components/clientFilter"
import ServerFilter from "../components/serverFilter"
import Table from "../components/table"
import css from "../index.css"
import {
    INIT,
    CHANGE_ROW_FILTER, CHANGE_COLUMN_FILTER, CHANGE_SERVER_FILTER, CHANGE_ROW_PER_PAGE,
    CHANGE_PAGE_INDEX,
    SET_SOURCE_DATA, SET_COMPONENT_FILTER_DATA, SET_INPUT_FILTER_DATA, SET_SORTED_DATA, SET_DISPLAY_DATA,
    START_LOADING, END_LOADING,
    CHANGE_SORT_DESC, CHANGE_SORT_COLUMN_ID,
} from "../actions/action"
import request from "../utils/request"
import {
    mapSourceDataToComponentFilterData,
    mapComponentFilterDataToInputFilterData,
    mapInputFilterDataToSortedData,
    mapSortedDataToDisplayData
} from "../utils/dataMap"

class MyComponent extends Component {

    static defaultProps = {}

    async componentWillMount() {
        let data
        try {
            //从服务器获取数据
            data = await request("init", this.props)
        } catch (e) {
            console.log(`init table ${this.props.id} failed`)
            console.log(e)
        }

        //服务器过滤列组件
        let serverFilter = data.columns.filter(d => {
            return d.hasOwnProperty("serverFilter")
        });
        if (data.hasOwnProperty("extraFilter")) {
            serverFilter = serverFilter.concat(data.extraFilter)
        }

        let initData = Object.assign({}, data, {
            serverFilter: serverFilter
        })
        this.props.init(initData)

        //初始化时自动读取
        if(initData.autoRead){
            this.props.read(this.props)
        }
    }

    componentDidMount() {
        if (this.props.autoRead === true) {
            this.props.read()
        }
    }

    render() {
        return (
            <div className={css.base}>
                <ServerFilter isLoading={this.props.isLoading} serverFilter={this.props.serverFilter}
                              serverFilterChangeCallback={this.props.serverFilterChangeCallback}
                              read={() => {
                                  this.props.read(this.props)
                              }}
                              curd={this.props.curd}
                              exportClickCallback={this.props.exportClickCallback}
                              createClickCallback={() => {
                                  this.props.createClickCallback(this.props)
                              }}
                              createText={this.props.createText}
                />
                <ClientFilter columns={this.props.columns}
                              curd={this.props.curd}
                              rowFilterValue={this.props.rowFilterValue}
                              rowFilterChangeCallback={this.props.rowFilterChangeCallback}
                              columnFilterChangeCallback={this.props.columnFilterChangeCallback}
                              pageIndex={this.props.pageIndex}
                              pageIndexChangeCallback={this.props.pageIndexChangeCallback}
                              pageArr={this.props.pageArr}
                              rowPerPage={this.props.rowPerPage}
                              rowPerPageChangeCallback={rowPerPage => {
                                  this.props.rowPerPageChangeCallback(rowPerPage, this.props)
                              }}
                />
                <Table columns={this.props.columns} displayData={this.props.displayData}
                       sortDesc={this.props.sortDesc} sortColumnId={this.props.sortColumnId}
                       thClickCallback={id => {
                           this.props.thClickCallback(id, this.props)
                       }}
                       is100TableWidth={this.props.is100TableWidth}
                />
            </div>
        )
    }


}

let mapStateToProps = state => {
    let pageArr = []
    for (let i = 0; i < Math.ceil(state.inputFilterData.length / state.rowPerPage); i++) {
        pageArr.push(i + 1)
    }

    let props = Object.assign({}, state, {
        pageArr: pageArr,
    })
    return props
}

let mapDispatchToProps = dispatch => ({
    init: initData => {
        initData = Object.assign({}, {type: INIT}, initData)
        dispatch(initData)
    },
    rowFilterChangeCallback: rowFilterValue => {
        dispatch({type: CHANGE_ROW_FILTER, rowFilterValue: rowFilterValue})
    },
    columnFilterChangeCallback: columns => {
        dispatch({type: CHANGE_COLUMN_FILTER, columns: columns})
    },
    pageIndexChangeCallback: pageIndex => {
        dispatch({type: CHANGE_PAGE_INDEX, pageIndex: pageIndex})
    },
    rowPerPageChangeCallback: (rowPerPage, props) => {
        dispatch({type: CHANGE_ROW_PER_PAGE, rowPerPage: rowPerPage})
        dispatch({type: CHANGE_PAGE_INDEX, pageIndex: 1})
        let displayData = mapSortedDataToDisplayData(props.sortedData, 1, rowPerPage)
        dispatch({type: SET_DISPLAY_DATA, data: displayData})
    },
    read: async props => {
        dispatch({type: START_LOADING})
        let data
        //附加查询条件的数据
        let requestData = {};
        props.serverFilter.forEach(d => {
            switch (d.type) {
                case "day":
                case "month":
                case "select":
                case "input":
                case "integer":
                case "radio":
                    requestData[d.id] = props[d.id + "Condition"];
                    break;
                case "rangeDay":
                case "rangeMonth":
                case "rangeSecond":
                    requestData[d.id] = {
                        start: props[d.id + "ConditionStart"],
                        end: props[d.id + "ConditionEnd"]
                    };
                    break;
            }
        })
        try {
            let message = await request("read", props, requestData)
            data = message.data
            dispatch({type: END_LOADING})
        } catch (e) {
            dispatch({type: END_LOADING})
            console.log(e)
            return
        }
        dispatch({type: SET_SOURCE_DATA, data: data})

        let componentFilterData = mapSourceDataToComponentFilterData(props, data)
        dispatch({type: SET_COMPONENT_FILTER_DATA, data: componentFilterData})

        let inputFilterData = mapComponentFilterDataToInputFilterData(componentFilterData, "")
        dispatch({type: SET_INPUT_FILTER_DATA, data: inputFilterData})

        let sortedData = inputFilterData
        dispatch({type: SET_SORTED_DATA, data: sortedData})

        let displayData = mapSortedDataToDisplayData(sortedData, 1, props.rowPerPage)
        dispatch({type: SET_DISPLAY_DATA, data: displayData})

        dispatch({type: CHANGE_PAGE_INDEX, pageIndex: 1})

    },
    serverFilterChangeCallback: (id, value) => {
        dispatch({type: CHANGE_SERVER_FILTER, id: id, value: value})
    },
    thClickCallback: (id, props) => {
        let sortDesc = id === props.sortColumnId ? !props.sortDesc : true
        let sortedData = mapInputFilterDataToSortedData(props.inputFilterData, id, sortDesc);
        dispatch({type: SET_SORTED_DATA, data: sortedData})

        let displayData = mapSortedDataToDisplayData(sortedData, props.pageIndex, props.rowPerPage)
        dispatch({type: SET_DISPLAY_DATA, data: displayData})

        dispatch({type: CHANGE_SORT_DESC, sortDesc: sortDesc})
        dispatch({type: CHANGE_SORT_COLUMN_ID, sortColumnId: id})
    },
    exportClickCallback: () => {

    },
    createClickCallback: props => {
        if (props.hasOwnProperty("createUrl")) {
            location.hash = props.createUrl
        }

    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)