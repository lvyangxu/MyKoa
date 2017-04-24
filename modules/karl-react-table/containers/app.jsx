import React, {Component} from "react"
import {connect} from "react-redux"

import ServerFilter from "../components/serverFilter"
import ActionRow from "../components/actionRow"
import ClientFilter from "../components/clientFilter"

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
import {
    mapSourceDataToComponentFilterData,
    mapComponentFilterDataToInputFilterData,
    mapInputFilterDataToSortedData,
    mapSortedDataToDisplayData
} from "../utils/dataMap"
import {postWithJWT} from "karl-http"

class MyComponent extends Component {

    static defaultProps = {}

    async componentWillMount() {
        let data
        try {
            //从服务器获取数据
            let requestData = {}
            if (this.props.requestParams !== undefined) {
                this.props.requestParams.forEach(d => {
                    requestData[d.id] = d.value
                })
            }
            data = await postWithJWT(this.props.project, `/${this.props.service}/table/${this.props.id}/init`, requestData)
        } catch (e) {
            console.log(`init table ${this.props.id} failed`)
            console.log(e)
            // if (this.props.showTips) {
            //     let errorMessage = e.message === "service is not available" ? "服务不可用" : e.message
            //     this.props.showTips({
            //         level: "danger",
            //         title: "初始化表格数据失败",
            //         text: "请重新刷新此页面,失败原因：" + errorMessage
            //     })
            // }
            return
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
        if (initData.autoRead) {
            this.props.read(this.props, true)
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
                <ServerFilter/>
                <ActionRow requestParams={this.props.requestParams}/>
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
                <Table/>
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
    setInitial: () => {
        dispatch({type: SET_IS_INITIAL_FALSE})
    },
    rowFilterChangeCallback: rowFilterValue => {
        dispatch({type: "CLEAR_CHECKED_ARR"})
        dispatch({type: CHANGE_ROW_FILTER, rowFilterValue: rowFilterValue})
    },
    columnFilterChangeCallback: columns => {
        dispatch({type: CHANGE_COLUMN_FILTER, columns: columns})
    },
    pageIndexChangeCallback: pageIndex => {
        dispatch({type: "CLEAR_CHECKED_ARR"})
        dispatch({type: CHANGE_PAGE_INDEX, pageIndex: pageIndex})
    },
    rowPerPageChangeCallback: (rowPerPage, props) => {
        dispatch({type: "CLEAR_CHECKED_ARR"})
        dispatch({type: CHANGE_ROW_PER_PAGE, rowPerPage: rowPerPage})
        dispatch({type: CHANGE_PAGE_INDEX, pageIndex: 1})
        let displayData = mapSortedDataToDisplayData(props.sortedData, 1, rowPerPage)
        dispatch({type: SET_DISPLAY_DATA, data: displayData})
    },
    read: async (props, isAutoRead) => {
        dispatch({type: START_LOADING})
        let data
        //附加查询条件的数据
        let requestData = isAutoRead ? {autoRead: true} : {}
        if (props.requestParams !== undefined) {
            props.requestParams.forEach(d => {
                requestData[d.id] = d.value
            })
        }

        props.serverFilter.forEach(d => {
            switch (d.type) {
                case "day":
                case "second":
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
            let message = await postWithJWT(props.project, `/${props.service}/table/${props.id}/read`, requestData)
            data = message.data
            dispatch({type: END_LOADING})
        } catch (e) {
            dispatch({type: END_LOADING})
            if (props.showTips) {
                let text
                switch (e.status) {
                    case 400:
                        text = "参数不正确"
                        break
                    case 500:
                        text = "服务器内部错误"
                        break
                    default:
                        text = e.message
                        break
                }
                props.showTips({
                    level: "danger",
                    title: "读取数据失败",
                    text: text
                })
            }
            return
        }

        let checkedArr = data.map(d => {
            return {id: d.id, checked: false}
        })
        dispatch({type: "SET_CHECKED_ARR", data: checkedArr})
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

        if (props.showTips) {
            props.showTips({
                level: "info",
                title: "读取数据成功",
                text: props.name,
            })
        }

    },


})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)