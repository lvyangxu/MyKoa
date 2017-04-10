import React from "react"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"
import Ajax from "karl-ajax"

let store = {}

/**
 * react表格
 * 示例：
 * <Table id="aa" project="vgas"/>
 */
class MyComponent extends React.Component {

    async componentWillMount() {
        let data = await this.request("init")
        let {columns, curd} = data
        console.log(data)
        let preloadedState = {
            columns: columns,
            curd: curd
        }
        store = createStore(reducer, preloadedState)
    }

    /**
     * 带jwt的http请求
     */
    async request(action, data = {}) {
        let jwt = localStorage.getItem(this.props.project + "-jwt")
        if (jwt === null) {
            location.href = "../login/"
        } else {
            data.jwt = jwt
            data = Object.assign(data, {id: this.props.id, action: action})
            let d = await Ajax.post(`../${this.props.serviceName}/table`, data)
            return d
        }
    }

    render() {
        return <Provider store={store}>
            <App/>
        </Provider>
    }
}

module.exports = MyComponent