import React, {Component} from "react"
import {connect} from "react-redux"
import Tips from "../components/tips"
import css from "../index.css"
import {
    TOGGLE_PANEL,
} from "../actions/action"
import classnames from "classnames"

class MyComponent extends Component {

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            if ($(this.base).is(":animated")) {
                $(this.base).stop()
            }
            $(this.base).css({opacity: "1", display: "block"})
            $(this.base).animate({opacity: "0"}, 10000, "linear", () => {
                $(this.base).css({display: "none"})
            })
        }
    }

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

let mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)