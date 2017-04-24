import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../../../index.css"

import Radio from "karl-react-radio"
import {postWithJWT} from "karl-http"

class MyComponent extends Component {

    static defaultProps = {
        packCreateName: ""
    }

    async componentWillMount() {
        try {
            let {data: itemList} = await postWithJWT(this.props.project, `../RedeemCode/table/item/read`, {uiGame: this.props.uiGame})
            this.props.setItemList(itemList)
        } catch (e) {
            console.log(e)
        }

        // let json = {}
        // json["CHANNEL-ID"] = 999
        // json["USER-ID"] = "afaf"
        // json["GAME-NAME"] = "CAVE"
        // json["CD-KEY"] = "00065lpq09yq"
        // let {data: d1} = await postWithJWT(this.props.project, `../RedeemCode/check`, json)
        // console.log(d1)

    }

    render() {

        let valueArr = this.props.currentItemList.map(d => {
            return d.value * d.num
        })
        let totalValue = 0
        if (valueArr.length > 0) {
            totalValue = valueArr.reduce((a, b) => {
                return a + b
            })
        }
        return (
            <div className={css.packCreate}>
                <h2>创建礼包</h2>
                <div className={css.row}>
                    <h3 className={css.title}>礼包名称</h3>
                    <div>
                        <input className={css.input} placeholder="请输入礼包名称" value={this.props.packCreateName}
                               onChange={this.props.changeName}/>
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>礼包内容</h3>
                    <div className={css.itemAction}>
                        <button className={css.button} onClick={this.props.addItem}>
                            <i className="fa fa-plus"></i>添加更多物品
                        </button>
                    </div>
                    <div className={css.table}>
                        <table>
                            <thead>
                            <tr>
                                <th style={{minWidth: "200px"}}>物品名称</th>
                                <th>图片</th>
                                <th>数量</th>
                                <th>换算成水晶价值</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.currentItemList.map((d, i) => {
                                    let dataArr = this.props.itemList.map(d1 => {
                                        return d1.name
                                    })
                                    return <tr key={i}>
                                        <td>
                                            <Radio data={dataArr} initValue={d.name} callback={d2 => {
                                                this.props.changeItemName(d2, i, "name")
                                            }}/>
                                        </td>
                                        <td>
                                            <img style={{height: "40px"}} src={`images/${d.image}`}/>
                                        </td>
                                        <td>
                                            <input type="number" min="1" className={css.input}
                                                   value={d.num}
                                                   onChange={e => {
                                                       this.props.changeItemNum(e.target.value, i, "num")
                                                   }}/>
                                        </td>
                                        <td>
                                            <label>{d.value * d.num}</label>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div>总价值:{totalValue}水晶</div>
                </div>
                <div className={css.row}>
                    <button className={classnames(css.button, css.submit)} onClick={() => {
                        this.props.submit(this.props)
                    }}>保存
                    </button>
                    <button className={css.button} onClick={this.props.cancel}>取消</button>
                </div>
            </div>
        )
    }
}

let mapStateToProps = state => {
    let uiGame = state.games.find(d => {
        return d.name === state.currentGame
    }).id
    let props = Object.assign({}, state, {uiGame: uiGame})
    return props
}

const mapDispatchToProps = dispatch => ({
    //设置道具列表
    setItemList: data => {
        dispatch({type: "SET_ITEM_LIST", data: data})
    },
    //增加一行礼包创建页面的道具
    addItem: () => {
        dispatch({type: "ADD_PACK_CREATE_ITEM"})
    },
    //监听礼包名称变化
    changeName: e => {
        dispatch({type: "SET_PACK_CREATE_NAME", data: e.target.value})
    },
    //监听道具名称变化
    changeItemName: (data, index) => {
        dispatch({type: "CHANGE_PACK_CREATE_ITEM", data: data, index: index, changeType: "name"})
    },
    //监听道具数量变化
    changeItemNum: (data, index) => {
        dispatch({type: "CHANGE_PACK_CREATE_ITEM", data: data, index: index, changeType: "num"})
    },
    //提交
    submit: async props => {
        if (!confirm("确定要创建礼包吗？")) {
            return
        }
        try {
            let itemIds = props.currentItemList.map(d => {
                return d.id
            }).join(",")
            let itemNums = props.currentItemList.map(d => {
                return d.num
            }).join(",")
            await postWithJWT(props.project, `../RedeemCode/table/pack/create`, {
                data: [{
                    name: props.packCreateName,
                    itemIds: itemIds,
                    itemNums: itemNums
                }],
                uiGame: props.uiGame
            })
            dispatch({type: "SHOW_TIPS", data: {level: "success", "title": "创建礼包成功", text: ""}})
        } catch (e) {
            dispatch({type: "SHOW_TIPS", data: {level: "danger", "title": "创建礼包失败", text: ""}})
        }
    },
    //取消，回到礼包页面
    cancel: () => {
        location.hash = "/pack"
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)