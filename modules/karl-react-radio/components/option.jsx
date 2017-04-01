import React, {PropTypes, Component} from "react"
import css from "../index.css"

export default class MyComponent extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        filterValue: PropTypes.string.isRequired
    }

    render() {
        return (
            <div className={css.options}>
                {
                    this.props.data.map((d, i) => {
                        return <div className={css.option} key={i} onClick={() => {
                            this.props.onClick(d.value)
                        }} dangerouslySetInnerHTML={d.html}></div>
                    })
                }
                {this.props.children}
            </div>
        )
    }
}