import React, {Component} from "react"
import {connect} from "react-redux"
import Tips from "../components/button"
import css from "../index.css"
import {
    TOGGLE_PANEL,
} from "../actions/action"
import classnames from "classnames"

class MyComponent extends Component {

    render() {
        return (
            <div className={classnames(css.base, this.props.classNames)}>
                <Tips data={this.props.data} isShow={this.props.isShow}/>
            </div>
        )
    }
}

let mapStateToProps = state => {
    let props = Object.assign({}, state, {})
    return props
}

const mapDispatchToProps = dispatch => ({
    togglePanel: () => {
        dispatch({type: TOGGLE_PANEL})
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)