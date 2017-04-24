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

    componentWillMount() {
        let preloadedState = {
            classNames: this.props.classNames,
            isShow: false,
        }
        store = createStore(reducer, preloadedState)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    render() {
        return <Provider store={store}>
            <App data={this.props.data}/>
        </Provider>
    }
}

module.exports = MyComponent