import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"

export default class MyComponent extends Component {
    static propTypes = {
        isPanelShow: PropTypes.bool.isRequired
    }

    render() {
        let hideClass = {}
        hideClass[css.hide] = !this.props.isPanelShow
        return (
            <div className={classnames(css.panel, hideClass)}>
                {this.props.children}
            </div>
        )
    }
}