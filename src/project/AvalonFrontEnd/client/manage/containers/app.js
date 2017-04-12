import React, {Component} from "react"
import {connect} from "react-redux"
import ItemMange from "../components/itemManage"
import ItemCreate from "../components/itemCreate"
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

} from "../actions/action"
import {HashRouter as Router, Route, Link} from 'react-router-dom'

class MyComponent extends Component {

    componentDidMount() {
        console.log("app did mount")
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
                    <Radio classNames={css.radio} data={this.props.gameNames} callback={this.props.changeGame}/>
                    <div className={css.menu} style={{height: this.props.height}} ref={d => {
                        this.menu = d;
                    }}>
                        <Game games={this.props.games} changeGame={this.props.changeGame}/>
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
                    <div className={css.content} style={{height: this.props.height}} ref={d => {
                        this.content = d
                    }}>
                        <Route exact path="/item" component={ItemMange}/>
                        <Route path="/itemCreate" component={ItemCreate}/>
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
    return {
        height: state.height,
        games: state.games,
        gameNames: gameNames,
        menuStatus: state.menuStatus,
        activeTab: state.activeTab,
    }
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
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)