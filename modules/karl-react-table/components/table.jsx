import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../index.css"

import {mapInputFilterDataToSortedData, mapSortedDataToDisplayData} from "../utils/dataMap"

class MyComponent extends Component {

    static defaultProps = {
        columns: [],
    }

    render() {
        let ths = this.props.columns.map((d, i) => {
            let {thStyle: style = {}} = d
            if (d.hasOwnProperty("checked") && d.checked === false) {
                style.display = "none"
            }
            let th = <th key={i} style={style} onClick={() => {
                this.props.thClickCallback(d.id)
            }}>{d.name}
                {
                    this.props.sortColumnId === d.id ? (
                        <i className={classnames("fa", {
                            "fa-caret-up": this.props.sortDesc,
                            "fa-caret-down": !this.props.sortDesc
                        })}></i>
                    ) : ""
                }
            </th>
            return th
        })
        let thRow = (this.props.curd.includes("u") || this.props.curd.includes("d")) ?
            <tr>
                <th className={css.checkbox}>
                    <input type="checkbox" checked={this.props.isAllChecked} onChange={() => {
                        this.props.thCheck(this.props)
                    }}/>
                </th>
                {ths}
            </tr> :
            <tr>
                {ths}
            </tr>
        let thead = <thead>{thRow}</thead>
        let tbody = <tbody>
        {
            this.props.displayData.map((d, i) => {
                let tds = this.props.columns.map((d1, j) => {
                    let tdDom
                    let {
                        style = {}, imageStyle = {}, callback = () => {
                        }
                    } = d1
                    if (d1.type === "image") {
                        tdDom = <td key={j} style={style} onClick={() => {
                            callback()
                        }}>
                            <img style={imageStyle} src={`images/${d[d1.id]}`}/>
                        </td>
                    } else {
                        let tdHtml = d[d1.id]
                        if (tdHtml) {
                            tdHtml = tdHtml.toString().replace(/\n/g, "<br/>")
                        }
                        //当含有后缀并且不为空字符串时，附加后缀
                        if (d1.hasOwnProperty("suffix") && tdHtml !== "") {
                            tdHtml += d1.suffix
                        }
                        if (d1.hasOwnProperty("checked") && d1.checked === false) {
                            style.display = "none"
                        } else {
                            delete style.display
                        }
                        tdDom = <td key={j} style={style} dangerouslySetInnerHTML={{__html: tdHtml}} onClick={() => {
                            callback()
                        }}></td>
                    }
                    return tdDom
                })
                let findChecked = this.props.checkedArr.find(d1 => {
                    return d1.id === d.id
                })
                let isChecked = findChecked === undefined ? false : findChecked.checked
                let tr = (this.props.curd.includes("u") || this.props.curd.includes("d")) ?
                    <tr key={i}>
                        <td className={css.checkbox}>
                            <input type="checkbox" checked={isChecked}
                                   onChange={() => {
                                       this.props.tdCheck(this.props, d.id)
                                   }}
                            />
                        </td>
                        {tds}
                    </tr> :
                    <tr key={i}>
                        {tds}
                    </tr>
                return tr;
            })
        }
        </tbody>
        let dom = <div className={css.table}>
            <table style={this.props.is100TableWidth === true ? {} : {width: "auto"}}>
                {
                    thead
                }
                {
                    tbody
                }
            </table>
        </div>
        return dom
    }
}

let mapStateToProps = state => {
    let props = Object.assign({}, state, {})
    return props
}

let mapDispatchToProps = dispatch => ({
    //th列点击后进行排序
    thClickCallback: (id, props) => {
        let sortDesc = id === props.sortColumnId ? !props.sortDesc : true
        let sortedData = mapInputFilterDataToSortedData(props.inputFilterData, id, sortDesc);
        dispatch({type: "SET_SORTED_DATA", data: sortedData})

        let displayData = mapSortedDataToDisplayData(sortedData, props.pageIndex, props.rowPerPage)
        dispatch({type: "SET_DISPLAY_DATA", data: displayData})

        dispatch({type: "CHANGE_SORT_DESC", sortDesc: sortDesc})
        dispatch({type: "CHANGE_SORT_COLUMN_ID", sortColumnId: id})
    },
    //checkbox选中状态改变
    tdCheck: (props, id) => {
        let checkedArr = props.checkedArr.concat()
        checkedArr = checkedArr.map(d => {
            if (d.id === id) {
                d.checked = !d.checked
            }
            return d
        })
        dispatch({type: "SET_CHECKED_ARR", data: checkedArr})
    },
    //全选状态改变
    thCheck: props => {
        let checkedArr = props.checkedArr.concat()
        let idArr = props.displayData.map(d => {
            return d.id
        })
        if (props.isAllChecked) {
            //从全选到全不选
            dispatch({type: "CLEAR_CHECKED_ARR"})
        } else {
            //从全不选到全选
            checkedArr = checkedArr.map(d => {
                if (idArr.includes(d.id)) {
                    d.checked = true
                }
                return d
            })
            dispatch({type: "SET_CHECKED_ARR", data: checkedArr})
        }
        dispatch({type: "SET_ALL_CHECKED", isAllChecked: !props.isAllChecked})

    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)