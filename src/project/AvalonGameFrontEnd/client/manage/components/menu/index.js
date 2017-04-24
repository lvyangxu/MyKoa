import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../../index.css"

import Game from "./game"
import {Link} from 'react-router-dom'
import $ from "jquery"

class MyComponent extends Component {
    static propTypes = {}

    componentDidMount() {
        this.props.setHeight(this.menu)
        $(window).resize(() => {
            this.props.setHeight(this.menu)
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
            {id: "/pack", name: "礼包管理"},
            {id: "/redeemCode", name: "兑换码管理"},
            {id: "/item", name: "道具列表"},
            {id: "/channel", name: "渠道列表"},
        ]
        return (
            <div className={css.menu} style={{height: this.props.height}} ref={d => {
                this.menu = d;
            }}>
                <Game/>
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
        )
    }
}

let mapStateToProps = state => {
    let props = Object.assign({}, state, {})
    return props
}

let mapDispatchToProps = dispatch => ({
    //设置菜单和内容高度
    setHeight: menuRef => {
        dispatch({type: "SET_HEIGHT", menuRef: menuRef})
    },
    //显示或隐藏二级菜单
    toggleMenu: name => {
        dispatch({type: "TOGGLE_MENU", name: name})
    },
    //设置当前活动的tab
    setActiveTab: activeTab => {
        dispatch({type: "SET_ACTIVE_TAB", activeTab: activeTab})
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)