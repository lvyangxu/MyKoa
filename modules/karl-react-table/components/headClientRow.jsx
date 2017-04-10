import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"

export default class MyComponent extends Component {
    static propTypes = {

    }

    render() {
        return (
            <div className={css.headClientRow}>
                <Select data={this.props.columns}/>
            </div>
        )
    }
}