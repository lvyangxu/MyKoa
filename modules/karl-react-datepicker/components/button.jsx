import React, {PropTypes, Component} from "react"
import css from "../index.css"

export default class MyComponent extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        buttonValue: PropTypes.string.isRequired
    }

    render() {
        return (
            <div className={css.button} onClick={this.props.onClick}>
                {
                    this.props.buttonValue
                }
                <i className="fa fa-caret-down"></i>
            </div>
        )
    }
}