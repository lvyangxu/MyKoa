import "babel-polyfill"
import React from "react"
import ReactDom from "react-dom"
import {createStore} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"

let store = {}

class MyComponent extends React.Component {

    async componentWillMount() {
        let preloadedState = {
            prefix: this.props.prefix,
            games: [
                {name: "贪婪洞窟1", imageName: "1.gif", checked: true},
                {name: "贪婪洞窟2", imageName: "2.gif", checked: false}
            ],
            menuStatus: [
                {name: "礼包与兑换码", expand: false}
            ],
            activeTab: "礼包管理"
        }
        store = createStore(reducer, preloadedState)
    }

    render() {
        return <Provider store={store}>
            <App/>
        </Provider>
    }
}

ReactDom.render(
    <MyComponent/>
    , document.getElementById("content"))

// import Ajax from "karl-ajax"
// Ajax.post("../api/rewardCode", {path: "/rewardCode/check"});
