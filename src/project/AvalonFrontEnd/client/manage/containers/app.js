import React, {Component} from "react"
import {connect} from "react-redux"
import ItemBundle from "../components/itemBundle"
import Item from "../components/item"
import CodeBundle from "../components/codeBundle"
import ItemBundleCreate from "../components/itemBundleCreate"
import Game from "../components/game"
import css from "../index.css"
import classnames from "classnames"
import $ from "jquery"
import Radio from "karl-react-radio"
import {
    SET_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB,
    SET_ITEM_LIST,
    ADD_ITEM,
    CHANGE_ITEM
} from "../actions/action"
import {HashRouter as Router, Route, Link} from 'react-router-dom'

class MyComponent extends Component {

    async componentWillMount() {
        let jwt = localStorage.getItem("AuthorizeServer-jwt")
        if (jwt === null) {
            location.href = "../login/"
            return
        }
        let data = {jwt: jwt}
        let path = `/table/item/read`
        data = Object.assign({}, {path: path}, data)
        let itemList = []
        try {
            let response = await fetch(`../api/rewardCode`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            let responseData = await response.json()
            itemList = responseData.message.data
            this.props.setItemList(itemList)
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
        let giftAndCodeStatus = this.props.menuStatus.filter(d => {
            return d.name === "礼包与兑换码"
        }).map(d => {
            return d.expand
        })
        let giftAndCodeExpand = giftAndCodeStatus.length > 0 ? giftAndCodeStatus[0] : false
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
                                    "fa-plus": !giftAndCodeExpand,
                                    "fa-minus": giftAndCodeExpand
                                })}></i>礼包与兑换码
                            </div>
                            <div style={giftAndCodeExpand ? {} : {display: "none"}}>
                                <Link to="/itemBundle" replace>
                                    <div onClick={() => {
                                        this.props.setActiveTab("礼包管理")
                                    }}
                                         className={classnames(css.li, this.props.activeTab === "礼包管理" ? css.active : "")}>
                                        礼包管理
                                    </div>
                                </Link>
                                <Link to="/item" replace>
                                    <div onClick={() => {
                                        this.props.setActiveTab("道具列表")
                                    }}
                                         className={classnames(css.li, this.props.activeTab === "道具列表" ? css.active : "")}>
                                        道具列表
                                    </div>
                                </Link>
                                <Link to="/codeBundle" replace>
                                    <div onClick={() => {
                                        this.props.setActiveTab("兑换码管理")
                                    }}
                                         className={classnames(css.li, this.props.activeTab === "兑换码管理" ? css.active : "")}>
                                        兑换码管理
                                    </div>
                                </Link>
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
                        <Route path="/codeBundle" component={CodeBundle}/>
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
    addItem: () => {
        dispatch({type: ADD_ITEM})
    },
    changeItem: (d, i) => {
        dispatch({type: CHANGE_ITEM, itemName: d, index: i})
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)