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

    componentWillMount() {
        let preloadedState = {
            project: "AvalonGame",
            prefix: this.props.prefix,
            games: [
                {id: "cave", name: "贪婪洞窟1", imageName: "1.gif"},
                {id: "cave2", name: "贪婪洞窟2", imageName: "2.gif"}
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
            packCreateStartTime: "",
            packCreateEndTime: "",
            tipsData: {},
            itemIsInitial: true,
            itemBundleCreateName: ""
        }
        store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware))
    }

    componentWillReceiveProps() {

    }

    shouldC

    render() {
        return <Provider store={store}>
            <App/>
        </Provider>
    }
}

ReactDom.render(
    <MyComponent/>
    , document.getElementById("content"))

let init = async () => {

    try {

    } catch (e) {

    }


}

init()


