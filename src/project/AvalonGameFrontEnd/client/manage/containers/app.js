import React, {Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../index.css"

import $ from "jquery"
import Radio from "karl-react-radio"

// import Tips from "karl-react-tips"
import Tips from "../../../../../modules/karl-component-tips/index"

import Menu from "../components/menu/index"
import Channel from "../components/channel/index"
import Pack from "../components/pack/index"
import PackCreate from "../components/pack/create/index"
import Item from "../components/item/index"
import RedeemCode from "../components/redeemCode/index"
import RedeemCodeCreate from "../components/redeemCode/create/index"

import {
    SET_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB,
    SET_ITEM_LIST, SET_ITEM_BUNDLE_LIST, SET_CHANNEL_LIST,
    ADD_ITEM, CHANGE_ITEM,
    SET_ITEM_BUNDLE_CREATE_START_TIME, SET_ITEM_BUNDLE_CREATE_END_TIME, SET_ITEM_BUNDLE_CREATE_NAME,
    SHOW_TIPS,
} from "../actions/action"
import {postWithJWT} from "karl-http"
import {HashRouter as Router, Route, Link} from 'react-router-dom'

class MyComponent extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Tips className={css.tips} data={this.props.tipsData}/>
                    <Menu/>
                    <div className={css.content} style={{height: this.props.height}} ref={d => {
                        this.content = d
                    }}>
                        <Route exact path="/pack" component={Pack}/>
                        <Route exact path="/pack/create" component={PackCreate}/>

                        {/*<Route path="/itemBundleCreate" component={ItemBundleCreate}/>*/}
                        <Route exact path="/item" component={Item}/>
                        <Route exact path="/channel" component={Channel}/>
                        <Route exact path="/redeemCode" component={RedeemCode}/>
                        <Route exact path="/redeemCode/create" component={RedeemCodeCreate}/>
                    </div>
                </div>
            </Router>
        )
    }

}


let mapStateToProps = state => {
    let gameNames = state.games.map(d => {
        return d.name
    })

    let props = Object.assign({}, state, {
        gameNames: gameNames,
    })
    return props
}

let mapDispatchToProps = dispatch => ({
    changeItem: (d, i, changeType) => {
        dispatch({type: CHANGE_ITEM, value: d, index: i, changeType: changeType})
    },
    createCode: () => {
        dispatch({type: SHOW_TIPS, data: {level: "info", title: "hehe", text: "11"}})
    },
    showTips: d => {
        dispatch({type: SHOW_TIPS, data: d})
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)