import React, {PropTypes, Component} from "react"
import css from "../index.css"

export default class MyComponent extends Component {
    static propTypes = {
        filterValue: PropTypes.string.isRequired,
        onFilterChange: PropTypes.func.isRequired
    }

    render() {
        return (
            <div className={css.filter}>
                <input onChange={this.props.onFilterChange} value={this.props.filterValue} placeholder="过滤器"/>
            </div>
        )
    }
}