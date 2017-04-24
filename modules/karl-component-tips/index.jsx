import React, {PropTypes, Component} from "react"
import css from "./index.css"
import classnames from "classnames"
import $ from "jquery"

export default class MyComponent extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
    }

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
            <div className={classnames(this.props.className, css.base)} style={{opacity: "0"}} ref={d => {
                this.base = d
            }}>
                <div className={classnames(css.message, css[this.props.data.level])}>
                    <div className={css.title}>{this.props.data.title}</div>
                    <div className={css.text}>{this.props.data.text}</div>
                </div>
            </div>
        )
    }
}