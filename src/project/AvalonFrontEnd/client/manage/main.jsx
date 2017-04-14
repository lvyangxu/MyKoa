import "babel-polyfill"
import React from "react"
import ReactDom from "react-dom"
import {createStore, applyMiddleware} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"
import thunkMiddleware from 'redux-thunk'
import "isomorphic-fetch"
let store = {}

class MyComponent extends React.Component {

    async componentWillMount() {
        let preloadedState = {
            prefix: this.props.prefix,
            games: [
                {name: "贪婪洞窟1", imageName: "1.gif"},
                {name: "贪婪洞窟2", imageName: "2.gif"}
            ],
            currentGame: "贪婪洞窟1",
            menuStatus: [
                {name: "礼包与兑换码", expand: true}
            ],
            activeTab: "礼包管理",
            itemList: [],
            currentItemList: [],
            itemBundleList: [],
            channelList: [],
            itemBundleCreateStartTime: "",
            itemBundleCreateEndTime: ""
        }
        store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware))
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
