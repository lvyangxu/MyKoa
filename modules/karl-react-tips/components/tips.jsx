import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"

export default class MyComponent extends Component {
    static propTypes = {
        isShow: PropTypes.bool.isRequired,
        data: PropTypes.array.isRequired,
    }

    render() {
        if (this.props.data.length === 0) {
            return <div></div>
        }

        let lastMessage = this.props.data[0]
        return (
            <div className={css[lastMessage.level]} style={this.props.isShow ? {} : {display: "none"}}>
                <div>{lastMessage.title}</div>
                <div>{lastMessage.text}</div>
            </div>
        )
    }
}