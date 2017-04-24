import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../../index.css"

import Table from "../../../../../../modules/karl-react-table/index"

class MyComponent extends Component {
    static propTypes = {}

    render() {
        return (
            <div>
                <Table id="item" project={this.props.project} service="RedeemCode"
                       showTips={this.props.showTips} requestParams={this.props.requestParams}
                />
            </div>
        )
    }
}

import {buildParams} from "../../util/param"
let mapStateToProps = state => {
    let json = buildParams(state, {})
    let props = Object.assign({}, state, json)
    return props
}

let mapDispatchToProps = dispatch => ({
    showTips: data => {
        dispatch({type: "SHOW_TIPS", data: data})
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)