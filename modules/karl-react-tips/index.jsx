import React from "react"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"

let store = {}

/**
 * react消息提示组件
 * data:消息数组
 * 示例：
 * <Radio data=[1,"a","b"]/>
 */
class MyComponent extends React.Component {

    async componentWillMount() {

        let preloadedState = {
            classNames: this.props.classNames,
            data: this.props.data,
            isShow: false,
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