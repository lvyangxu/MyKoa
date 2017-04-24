import React from "react"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"
import http from "karl-http"

let store = {}

/**
 * react单选组件
 * data:单选值数组，元素可为数字或字符串
 * callback：值改变时执行的回调，参数为当前的值
 * initCallback：初始化后执行的回调，参数为当前的值
 * initValue：初始值，默认为data数组第一个元素
 * prefix：组件显示文字的前缀
 * suffix：组件显示文字的后缀
 * 示例：
 * <Radio data=[1,"a","b"]/>
 */
class MyComponent extends React.Component {

    componentWillMount() {
        let {initValue} = this.props
        let preloadedState = {
            classNames: this.props.classNames,
            prefix: this.props.prefix,
            suffix: this.props.suffix,
            initValue: initValue,
            isPanelShow: false,
            pageIndex: 0,
            filterValue: "",
            initCallback: this.props.initCallback,
            callback: this.props.callback,
        }
        store = createStore(reducer, preloadedState)
    }

    render() {
        return <Provider store={store}>
            <App data={this.props.data}/>
        </Provider>
    }
}

module.exports = MyComponent