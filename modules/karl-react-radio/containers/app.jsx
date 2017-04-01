import React, {Component} from "react"
import {connect} from "react-redux"
import Button from "../components/button"
import Panel from "../components/panel"
import Filter from "../components/filter"
import Option from "../components/option"
import Page from "../components/page"
import css from "../index.css"
import {
    TOGGLE_PANEL,
    HIDE_PANEL,
    STOP_PROPAGATION,
    CHOOSE_ITEM,
    CHANGE_INPUT,
    DO_PAGE_LEFT,
    DO_PAGE_RIGHT,
    DO_PAGE_START,
    DO_PAGE_END
} from "../actions/action"

class MyComponent extends Component {

    componentDidMount() {
        window.addEventListener("click", this.props.hidePanel, false)
        if (this.props.initCallback !== undefined) {
            this.props.initCallback(this.props.value)
        }
    }

    render() {
        return (
            <div className={css.base} onClick={this.props.stopPropagation}>
                <Button onClick={this.props.togglePanel} buttonValue={this.props.buttonValue} data={this.props.data}
                        prefix={this.props.prefix} suffix={this.props.suffix}/>
                <Panel isPanelShow={this.props.isPanelShow}>
                    <Filter onFilterChange={this.props.onFilterChange} filterValue={this.props.filterValue}/>
                    <Option data={this.props.pageData} filterValue={this.props.filterValue}
                            onClick={this.props.chooseItem}>
                        <Page pageIndex={this.props.pageIndex} pageEndIndex={this.props.pageEndIndex}
                              doPageStart={() => {
                                  this.props.doPageStart()
                              }}
                              doPageLeft={() => {
                                  this.props.doPageLeft(this.props.pageIndex)
                              }}
                              doPageRight={() => {
                                  this.props.doPageRight(this.props.pageIndex, this.props.pageEndIndex)
                              }}
                              doPageEnd={() => {
                                  this.props.doPageEnd(this.props.pageEndIndex)
                              }}/>
                    </Option>
                </Panel>
            </div>
        )
    }
}

let getFilterData = (data, filterValue) => {
    let filterData = data.filter(d => {
        return d.toString().includes(filterValue)
    })
    return filterData
}

let getPageEndIndex = filterData => {
    let pageEndIndex = Math.floor(filterData.length / 10)
    return pageEndIndex
}

let getPageData = (filterData, pageIndex) => {
    let start = pageIndex * 10
    let end = pageIndex * 10 + 10
    end = end > filterData.length ? filterData.length : end
    let pageData = filterData.slice(start, end)
    return pageData
}

let getMarkedHtml = (optionValue, filterValue) => {
    optionValue = optionValue.toString()
    let regex = new RegExp(filterValue, "g")
    let markedHtml = optionValue.replace(regex, `<strong>${filterValue}</strong>`)
    return {__html: markedHtml}
}

let getButtonValue = (prefix, value, suffix) => {
    prefix = prefix === undefined ? "" : (prefix + " ")
    suffix = suffix === undefined ? "" : (" " + suffix)
    return prefix + value + suffix
}

let mapStateToProps = state => {
    let filterData = getFilterData(state.data, state.filterValue)
    let pageEndIndex = getPageEndIndex(filterData)
    let pageData = getPageData(filterData, state.pageIndex)
    pageData = pageData.map(d => {
        let html = getMarkedHtml(d, state.filterValue)
        return {value: d, html: html}
    })
    let buttonValue = getButtonValue(state.prefix, state.value, state.suffix)
    return {
        isPanelShow: state.isPanelShow,
        value: state.value,
        buttonValue: buttonValue,
        prefix: state.prefix,
        suffix: state.suffix,
        data: state.data,
        filterValue: state.filterValue,
        filterData: filterData,
        pageIndex: state.pageIndex,
        pageEndIndex: pageEndIndex,
        pageData: pageData,
        initCallback: state.initCallback,
        callback: state.callback
    }
}

const mapDispatchToProps = dispatch => ({
    togglePanel: () => {
        dispatch({type: TOGGLE_PANEL})
    },
    hidePanel: () => {
        dispatch({type: HIDE_PANEL})
    },
    stopPropagation: e => {
        dispatch({type: STOP_PROPAGATION, e: e})
    },
    onFilterChange: e => {
        dispatch({type: CHANGE_INPUT, e: e})
    },
    chooseItem: d => {
        dispatch({type: CHOOSE_ITEM, value: d})
        dispatch({type: HIDE_PANEL})
    },
    doPageStart: () => {
        dispatch({type: DO_PAGE_START})
    },
    doPageLeft: pageIndex => {
        dispatch({type: DO_PAGE_LEFT, pageIndex: pageIndex})
    },
    doPageRight: (pageIndex, pageEndIndex) => {
        dispatch({type: DO_PAGE_RIGHT, pageIndex: pageIndex, pageEndIndex: pageEndIndex})
    },
    doPageEnd: pageEndIndex => {
        dispatch({type: DO_PAGE_END, pageEndIndex: pageEndIndex})
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)