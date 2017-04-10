import React from "react"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"
import http from "karl-http"

let store = {}

/**
 * react表格
 * 示例：
 * <Table data=[1,"a","b"]/>
 */
class MyComponent extends React.Component {

    async componentWillMount() {
        let data = []
        if (this.props.hasOwnProperty("url")) {
            data = await http.post(this.props.url)
        } else {
            data = this.props.data
        }
        let value = this.props.hasOwnProperty("initValue") ? this.props.initValue : data[0]
        let preloadedState = {
            data: data,
            value: value,
            prefix: this.props.prefix,
            suffix: this.props.suffix,
            isPanelShow: false,
            pageIndex: 0,
            filterValue: "",
            initCallback: this.props.initCallback,
            callback: this.props.callback
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