import React, {Component} from "react"
import {connect} from "react-redux"
import Item from "../components/item"
import ItemCreate from "../components/itemCreate"
import Game from "../components/game"
import css from "../index.css"
import classnames from "classnames"
import $ from "jquery"
import {
    SET_MENU_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB
} from "../actions/action"
import {HashRouter as Router, Route, Link} from 'react-router-dom'

class MyComponent extends Component {

    componentDidMount() {
        this.props.setMenuHeight(this.menu)
        $(window).resize(() => {
            this.props.setMenuHeight(this.menu)
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
                    <Game games={this.props.games} changeGame={this.props.changeGame}/>
                    <div className={css.menu} style={{height: this.props.menuHeight}} ref={d => {
                        this.menu = d;
                    }}>
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
                                <Link to="/item" replace>
                                    <div onClick={() => {
                                        this.props.setActiveTab("礼包管理")
                                    }}
                                         className={classnames(css.li, this.props.activeTab === "礼包管理" ? css.active : "")}>
                                        礼包管理
                                    </div>
                                </Link>
                                <Link to="/itemCreate" replace>
                                    <div onClick={() => {
                                        this.props.setActiveTab("新建礼包")
                                    }}
                                         className={classnames(css.li, this.props.activeTab === "新建礼包" ? css.active : "")}>
                                        新建礼包
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={css.content}>
                        <Route exact path="/item" component={Item}/>
                        <Route path="/itemCreate" component={ItemCreate}/>
                    </div>
                </div>
            </Router>
        )
    }
}

let mapStateToProps = state => {
    return {
        menuHeight: state.menuHeight,
        games: state.games,
        menuStatus: state.menuStatus,
        activeTab: state.activeTab
    }
}

const mapDispatchToProps = dispatch => ({
    setMenuHeight: menuRef => {
        dispatch({type: SET_MENU_HEIGHT, menuRef: menuRef})
    },
    changeGame: currentGame => {
        dispatch({type: CHANGE_GAME, currentGame: currentGame})
    },
    toggleMenu: name => {
        dispatch({type: TOGGLE_MENU, name: name})
    },
    setActiveTab: activeTab => {
        dispatch({type: SET_ACTIVE_TAB, activeTab: activeTab})
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)