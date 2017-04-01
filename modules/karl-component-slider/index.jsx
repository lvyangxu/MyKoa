import React from "react";
import css from "./index.css";

/**
 * react数字滚动插件
 * min：最小值，默认为0
 * max：最大值
 * callback：值改变后的回调，参数为值当前的数值
 *
 * 示例：
 */
class slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            min: this.props.min ? this.props.min : 0,
            max: this.props.max,
            callback: this.props.callback
        };
        let bindArr = [];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={css.base + " react-slider"}>
                <div className={css.container}>
                    <div className={css.rod}>
                        <div className={css.slider}></div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = slider;