import React, {Component} from "react"
import {connect} from "react-redux"
import ItemBundle from "../components/itemBundle"
import Item from "../components/item"
import CodeBundle from "../components/codeBundle"
import ItemBundleCreate from "../components/itemBundleCreate"
import CodeBundleCreate from "../components/codeBundleCreate"
import Game from "../components/game"
import Channel from "../components/channel"

import css from "../index.css"
import classnames from "classnames"
import $ from "jquery"
import Radio from "karl-react-radio"
import {
    SET_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB,
    SET_ITEM_LIST, SET_ITEM_BUNDLE_LIST, SET_CHANNEL_LIST,
    ADD_ITEM, CHANGE_ITEM,
    SET_ITEM_BUNDLE_CREATE_START_TIME, SET_ITEM_BUNDLE_CREATE_END_TIME,
} from "../actions/action"
import {postWithJWT} from "karl-http"
import {HashRouter as Router, Route, Link} from 'react-router-dom'

class MyComponent extends Component {

    async componentWillMount() {
        try {
            let {data: itemList} = await postWithJWT("AuthorizeServer", `../api/rewardCode`, {path: `/table/item/read`})
            this.props.setItemList(itemList)

            let {data: itemBundleList} = await postWithJWT("AuthorizeServer", `../api/rewardCode`, {path: `/table/itemBundleName/read`})
            itemBundleList = itemBundleList.map(d => {
                return d.name
            })
            this.props.setItemBundleList(itemBundleList)

            let {data: channelList} = await postWithJWT("AuthorizeServer", `../api/rewardCode`, {path: `/table/channel/read`})
            channelList = channelList.map(d => {
                return d.name
            })
            this.props.setChannelList(channelList)

        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount() {
        this.props.setHeight(this.menu, this.content)
        $(window).resize(() => {
            this.props.setHeight(this.menu, this.content)
        })
    }

    render() {
        let rewardCodeStatus = this.props.menuStatus.filter(d => {
            return d.name === "礼包与兑换码"
        }).map(d => {
            return d.expand
        })
        let rewardCodeExpand = rewardCodeStatus.length > 0 ? rewardCodeStatus[0] : false
        let rewardCodeMenuArr = [
            {id: "/itemBundle", name: "礼包管理"},
            {id: "/codeBundle", name: "兑换码管理"},
            {id: "/item", name: "道具列表"},
            {id: "/channel", name: "渠道列表"},
            {id: "/itemBundleCreate", name: "新建礼包"},
            {id: "/codeBundleCreate", name: "新建兑换码"},
        ]

        return (
            <Router>
                <div>
                    <div className={css.menu} style={{height: this.props.height}} ref={d => {
                        this.menu = d;
                    }}>
                        <Game games={this.props.games} changeGame={this.props.changeGame}
                              gameNames={this.props.gameNames} currentGame={this.props.currentGame}
                              gameChangeCallback={this.props.changeGame}/>
                        <div className={css.li}>
                            <div onClick={() => {
                                this.props.toggleMenu("礼包与兑换码")
                            }}>
                                <i className={classnames("fa", {
                                    "fa-plus": !rewardCodeExpand,
                                    "fa-minus": rewardCodeExpand
                                })}></i>礼包与兑换码
                            </div>
                            <div style={rewardCodeExpand ? {} : {display: "none"}}>
                                {
                                    rewardCodeMenuArr.map((d, i) => {
                                        return <Link key={i} to={d.id} replace>
                                            <div
                                                className={classnames(css.li, this.props.activeTab === d.name ? css.active : "")}
                                                onClick={() => {
                                                    this.props.setActiveTab(d.name)
                                                }}>
                                                {d.name}
                                            </div>
                                        </Link>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className={css.content} style={{height: this.props.height}} ref={d => {
                        this.content = d
                    }}>
                        <Route path="/itemBundle" component={ItemBundle}/>
                        <Route path="/itemBundleCreate" component={() => {
                            return <ItemBundleCreate itemList={this.props.itemList}
                                                     currentItemList={this.props.currentItemList}
                                                     addButtonClickCallback={this.props.addItem}
                                                     currentItemChangeCallback={this.props.changeItem}
                            />
                        }}/>
                        <Route path="/item" component={Item}/>
                        <Route path="/channel" component={Channel}/>
                        <Route path="/codeBundle" component={CodeBundle}/>
                        <Route path="/codeBundleCreate" component={() => {
                            return <CodeBundleCreate itemBundleList={this.props.itemBundleList}
                                                     channelList={this.props.channelList}
                                                     submitCallback={this.props.createCode}
                                                     itemBundleCreateStartTimeChangeCallback={this.props.setItemBundleCreateStartTime}
                                                     itemBundleCreateEndTimeChangeCallback={this.props.setItemBundleCreateEndTime}
                                                     itemBundleCreateStartTime={this.props.itemBundleCreateStartTime}
                                                     itemBundleCreateEndTime={this.props.itemBundleCreateEndTime}
                            />
                        }}/>
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

const mapDispatchToProps = dispatch => ({
    setHeight: (menuRef, contentRef) => {
        dispatch({type: SET_HEIGHT, menuRef: menuRef, contentRef: contentRef})
    },
    changeGame: currentGame => {
        dispatch({type: CHANGE_GAME, currentGame: currentGame})
    },
    toggleMenu: name => {
        dispatch({type: TOGGLE_MENU, name: name})
    },
    setActiveTab: activeTab => {
        dispatch({type: SET_ACTIVE_TAB, activeTab: activeTab})
    },
    setMenuRef: menuRef => {
        dispatch({type: SET_MENU_REF, menuRef: menuRef})
    },
    setItemList: itemList => {
        dispatch({type: SET_ITEM_LIST, itemList: itemList})
    },
    setItemBundleList: itemBundleList => {
        dispatch({type: SET_ITEM_BUNDLE_LIST, itemBundleList: itemBundleList})
    },
    setChannelList: channelList => {
        dispatch({type: SET_CHANNEL_LIST, channelList: channelList})
    },
    addItem: () => {
        dispatch({type: ADD_ITEM})
    },
    changeItem: (d, i) => {
        dispatch({type: CHANGE_ITEM, itemName: d, index: i})
    },
    createCode: () => {

    },
    setItemBundleCreateStartTime: d => {
        dispatch({type: SET_ITEM_BUNDLE_CREATE_START_TIME, value: d})
    },
    setItemBundleCreateEndTime: d => {
        dispatch({type: SET_ITEM_BUNDLE_CREATE_END_TIME, value: d})
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)