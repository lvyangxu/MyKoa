import React, {PropTypes, Component} from "react"
import css from "../index.css"

export default class MyComponent extends Component {
    static propTypes = {
        doPageStart: PropTypes.func.isRequired,
        doPageLeft: PropTypes.func.isRequired,
        doPageRight: PropTypes.func.isRequired,
        doPageEnd: PropTypes.func.isRequired,
        pageIndex: PropTypes.number.isRequired,
        pageEndIndex: PropTypes.number.isRequired,
    }

    render() {
        return (
            <div className={css.page}>
                <button className={css.pageLeft} onClick={this.props.doPageStart}>
                    <i className="fa fa-angle-double-left"></i>
                </button>
                <button className={css.pageLeft} onClick={this.props.doPageLeft}>
                    <i className="fa fa-angle-left"></i>
                </button>
                {
                    `${(this.props.pageIndex + 1)}/${this.props.pageEndIndex + 1}`
                }
                <button className={css.pageRight} onClick={this.props.doPageRight}>
                    <i className="fa fa-angle-right"></i>
                </button>
                <button className={css.pageRight} onClick={this.props.doPageEnd}>
                    <i className="fa fa-angle-double-right"></i>
                </button>
            </div>
        )
    }
}