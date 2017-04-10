import React from "react"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"

let store = {}

/**
 * react日期组件
 * type：日期类型，day/month/hour/minute/second/week，默认为day
 * add：默认值的偏移量，默认为0
 * callback：日期改变时执行的回调，参数为当前的值
 * initCallback：初始化后执行的回调，参数为当前的值
 *
 * 示例：
 * <Datepicker add="2" type="month"/>
 */
class MyComponent extends React.Component {

    async componentWillMount() {
        let {type = "day", add = 0, prefix, suffix, initCallback, callback, isRange = false} = this.props;
        let preloadedState = {
            type: type,
            add: add,
            prefix: prefix,
            suffix: suffix,
            isPanelShow: false,
            initCallback: initCallback,
            callback: callback,
            isRange: isRange
        }
        store = createStore(reducer, preloadedState)
    }

    render() {
        return <Provider store={store}>
            <App/>
        </Provider>
    }
}

module.exports = MyComponent