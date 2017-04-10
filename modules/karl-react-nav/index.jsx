import React from "react"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"
import http from "karl-http"

let store = {}

class MyComponent extends React.Component {

    async componentWillMount() {
        let data = []
        let value = this.props.hasOwnProperty("initValue") ? this.props.initValue : data[0]
        let preloadedState = {
            activeTab: ""
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