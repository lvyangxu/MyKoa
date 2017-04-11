import React, {Component} from "react"
import {connect} from "react-redux"
import ClientFilter from "../components/clientFilter"
import ServerFilter from "../components/serverFilter"
import Table from "../components/table"
import css from "../index.css"
import {
    INIT,
    CHANGE_ROW_FILTER,
    CHANGE_COLUMN_FILTER,
    CHANGE_PAGE_INDEX,
    READ,
} from "../actions/action"
import request from "../utils/request"

class MyComponent extends Component {

    static defaultProps = {
        inputFilterData: []
    }

    async componentWillMount() {
        try {
            //从服务器获取数据
            let data = await request("init", this.props)
            let initData = {
                columns: data.columns,
                curd: data.curd
            }
            //服务器过滤列组件
            let serverFilter = data.columns.filter(d => {
                return d.hasOwnProperty("serverFilter")
            });
            if (data.hasOwnProperty("extraFilter")) {
                serverFilter = serverFilter.concat(data.extraFilter)
            }
            initData.serverFilter = serverFilter
            //最小化列显示
            if (data.hasOwnProperty("isMinColumn")) {
                initData.isMinColumn = data.isMinColumn
            }
            //初始化图表
            if (data.hasOwnProperty("chart")) {
                initData.chart = data.chart
            }
            //每页显示的行数
            if (data.hasOwnProperty("rowPerPage")) {
                initData.rowPerPage = data.rowPerPage
            }

            this.props.init(initData)
        } catch (e) {
            console.log(`init table ${this.props.id} failed`)
            console.log(e)
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
                <ServerFilter read={() => {
                    this.props.read(this.props)
                }} isLoading={this.props.isLoading}/>
                <ClientFilter columns={this.props.columns}
                              curd={this.props.curd}
                              rowFilterValue={this.props.rowFilterValue}
                              rowFilterChangeCallback={this.props.rowFilterChangeCallback}
                              columnFilterChangeCallback={this.props.columnFilterChangeCallback}
                              pageIndex={this.props.pageIndex}
                              pageIndexChangeCallback={this.props.pageIndexChangeCallback}
                />
                <Table columns={this.props.columns} displayData={this.props.displayData}/>
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
    read: props => {
        dispatch(READ(props))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)