import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"
import Datepicker from "karl-component-datepicker"
import {postWithJWT} from "karl-http"
import {
    mapSourceDataToComponentFilterData,
    mapComponentFilterDataToInputFilterData,
    mapInputFilterDataToSortedData,
    mapSortedDataToDisplayData
} from "../utils/dataMap"

class MyComponent extends Component {

    static propTypes = {}

    render() {
        let loadingJson = {}
        loadingJson[css.loading] = this.props.isLoading

        return (
            <div className={css.actions}>
                <div className={css.section}>
                    <button className={classnames(css.filter, loadingJson) }
                            onClick={() => {
                                this.props.read(this.props)
                            }} disabled={this.props.isLoading}>
                        <i className={classnames("fa fa-refresh", loadingJson)}></i>刷新
                    </button>
                </div>
                <div className={css.section}>
                    <button className={css.filter} onClick={() => {
                        this.props.export(this.props)
                    }}>
                        <i className="fa fa-download"></i>导出
                    </button>
                </div>
                {
                    this.props.curd.includes("c") ?
                        <div className={css.section}>
                            <button className={css.filter} onClick={() => {
                                this.props.create(this.props)
                            }}>
                                <i className="fa fa-plus"></i>{this.props.createText}
                            </button>
                        </div>
                        : ""
                }
                {
                    this.props.curd.includes("d") ?
                        <div className={css.section}>
                            <button className={css.filter} onClick={() => {
                                this.props.delete(this.props)
                            }}>
                                <i className="fa fa-plus"></i>删除
                            </button>
                        </div>
                        : ""
                }
            </div>
        )
    }
}

let mapStateToProps = state => {
    let props = Object.assign({}, state, {})
    return props
}

let mapDispatchToProps = dispatch => ({
    //导出为excel
    export: async props => {
        let nameRow = props.columns.map(d => {
            return d.name
        }).join("\t")
        let valueRows = props.sourceData.map(d => {
            let row = props.columns.map(d1 => {
                return d[d1.id]
            }).join("\t")
            return row
        }).join("\n")
        if (valueRows === "") {
            alert("当前表格没有数据,无需下载")
            return
        }

        let sheetData = nameRow + "\n" + valueRows
        sheetData = encodeURIComponent(sheetData)
        let jwt = localStorage.getItem(props.project + "-jwt")
        location.href = `../POIServer/export?jwt=${jwt}&name=${props.name}&content=${sheetData}`
    },
    //读取
    read: async props => {
        dispatch({type: "START_LOADING"})
        let data
        //附加查询条件的数据
        let requestData = {}
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
            dispatch({type: "END_LOADING"})
        } catch (e) {
            dispatch({type: "END_LOADING"})
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
        dispatch({type: "SET_SOURCE_DATA", data: data})

        let componentFilterData = mapSourceDataToComponentFilterData(props, data)
        dispatch({type: "SET_COMPONENT_FILTER_DATA", data: componentFilterData})

        let inputFilterData = mapComponentFilterDataToInputFilterData(componentFilterData, "")
        dispatch({type: "SET_INPUT_FILTER_DATA", data: inputFilterData})

        let sortedData = inputFilterData
        dispatch({type: "SET_SORTED_DATA", data: sortedData})

        let displayData = mapSortedDataToDisplayData(sortedData, 1, props.rowPerPage)
        dispatch({type: "SET_DISPLAY_DATA", data: displayData})

        dispatch({type: "CHANGE_PAGE_INDEX", pageIndex: 1})

        if (props.showTips) {
            props.showTips({
                level: "info",
                title: "读取成功",
                text: props.name,
            })
        }

    },
    //创建
    create: props => {
        if (props.hasOwnProperty("createUrl")) {
            location.hash = props.createUrl
        }
    },
    //删除
    delete: async props => {
        let idArr = props.checkedArr.filter(d => {
            return d.checked
        }).map(d => {
            return d.id
        })
        if (idArr.length === 0) {
            alert("请至少勾选一行数据")
            return
        }
        if (!confirm(`确定要删除勾选的${idArr.length}行数据吗？`)) {
            return
        }

        let requestData = {id: idArr}
        if (props.requestParams !== undefined) {
            props.requestParams.forEach(d => {
                requestData[d.id] = d.value
            })
        }

        try {
            await postWithJWT(props.project, `/${props.service}/table/${props.id}/delete`, requestData)
            if (props.showTips) {
                props.showTips({
                    level: "info",
                    title: "删除成功",
                    text: props.name,
                })
            }
            props.read(props)
        } catch (e) {
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
        }

    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)