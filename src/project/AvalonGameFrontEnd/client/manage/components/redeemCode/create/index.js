import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../../../index.css"
import Radio from "karl-react-radio"

import Datepicker from "karl-component-datepicker"
import {postWithJWT} from "karl-http"

class MyComponent extends Component {

    static defaultProps = {
        redeemCodeCreateName: "",
        redeemCodeCreateNum: 1,
        redeemCodeCreateMaxTimes: 1
    }

    async componentWillMount() {
        try {
            let {data: itemList} = await postWithJWT(this.props.project, `../RedeemCode/table/item/read`, {uiGame: this.props.uiGame})
            this.props.setItemList(itemList)

            let {data: channelList} = await postWithJWT(this.props.project, `../RedeemCode/table/channel/read`, {uiGame: this.props.uiGame})
            channelList = channelList.map(d => {
                return d.name
            })
            this.props.setChannelList(channelList)

            let {data: packList} = await postWithJWT(this.props.project, `../RedeemCode/table/packName/read`, {uiGame: this.props.uiGame})
            this.props.setPackIdAndNameList(packList)
            packList = packList.map(d => {
                return d.name
            })
            this.props.setPackList(packList)

        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let {redeemCodeCreateStartTime: startTime, redeemCodeCreateEndTime: endTime} = this.props
        let display = {day: 0, hour: 0, minute: 0}
        if (startTime !== "" && endTime !== "") {
            let deltaTime = Date.parse(endTime) - Date.parse(startTime)
            let allMinute = Math.floor(deltaTime / 1000 / 60)
            display.minute = allMinute % 60
            let allHour = Math.floor(allMinute / 60)
            display.hour = allHour % 24
            display.day = Math.floor(allHour / 24)
        }

        return (
            <div className={css.redeemCodeCreate}>
                <h2>创建兑换码</h2>
                <div className={css.row}>
                    <h3 className={css.title}>兑换码名称</h3>
                    <div>
                        <input className={css.input} value={this.props.redeemCodeCreateName}
                               onChange={this.props.setName}/>
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>关联礼包</h3>
                    <div>
                        <Radio data={this.props.packList} initValue={this.props.redeemCodeCreatePack}
                               initCallback={this.props.setPack} callback={this.props.setPack}
                        />
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>渠道</h3>
                    <div>
                        <Radio data={this.props.channelList} initValue={this.props.redeemCodeCreateChannel}
                               initCallback={this.props.setChannel} callback={this.props.setChannel}
                        />
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>有效期</h3>
                    <div className={css.validTime}>
                        <div className={css.startTime}>
                            <div className={css.label}>开始时间</div>
                            <Datepicker type="minute" initValue={this.props.redeemCodeCreateStartTime}
                                        initCallback={this.props.setStartTime}
                                        callback={this.props.setStartTime}
                            />
                        </div>
                        <div className={css.endTime}>
                            <div className={css.label}>结束时间</div>
                            <Datepicker type="minute" add={30 * 24 * 60} initValue={this.props.redeemCodeCreateEndTime}
                                        initCallback={this.props.setEndTime}
                                        callback={this.props.setEndTime}
                            />
                        </div>
                        <div className={css.totalTime}>总计: {display.day}天{display.hour}小时{display.minute}分</div>
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>规则</h3>
                    <div className={css.rules}>
                        <div className={css.ruleRow}>
                            <div className={css.left}>本批生成数量</div>
                            <div className={css.right}>
                                <input className={css.input} type="number" min="1" max="500000"
                                       value={this.props.redeemCodeCreateNum} onChange={this.props.setNum}/>
                            </div>
                        </div>
                        <div className={css.ruleRow}>
                            <div className={css.left}>单条使用次数</div>
                            <div className={css.right}>
                                <input className={css.input} type="number" min="1" max="500000"
                                       value={this.props.redeemCodeCreateMaxTimes} onChange={this.props.setMaxTimes}/>
                            </div>
                        </div>
                        <div className={classnames(css.ruleRow, css.activeType)}>
                            <div className={css.left}>账号激活</div>
                            <div className={css.right}>
                                <Radio data={["单个账号激活本批次一个码", "单个账号激活本批次多个码", "通用码"]}
                                       initValue={this.props.redeemCodeCreateType}
                                       initCallback={this.props.setType}
                                       callback={this.props.setType}
                                />
                                {/*<div><input name="type" type="radio"/>单个账号激活本批次一个码</div>*/}
                                {/*<div><input name="type" type="radio"/>单个账号激活本批次多个码</div>*/}
                                {/*<div><input name="type" type="radio"/>通用码</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>备注</h3>
                    <div className={css.ruleRow}>
                        选中通用码后，不可再设置生成数量与使用次数，并不再生成普通兑换码，本批次兑换码只会生成一条通用码。
                    </div>
                    <div className={css.ruleRow}>
                        每个玩家账号只可使用该通用码1次。
                    </div>
                    <div className={css.ruleRow}>
                        通用码可在所有渠道使用。
                    </div>
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
    let props = Object.assign({}, state, {
        uiGame: uiGame
    })
    return props
}

let mapDispatchToProps = dispatch => ({
    //设置礼包id和名称的列表
    setPackIdAndNameList: data => {
        dispatch({type: "SET_PACK_ID_AND_NAME_LIST", data: data})
    },
    //设置礼包列表
    setPackList: data => {
        dispatch({type: "SET_PACK_LIST", data: data})
        dispatch({type: "SET_REDEEM_CODE_CREATE_PACK", data: data[0]})
    },
    //设置道具列表
    setItemList: data => {
        dispatch({type: "SET_ITEM_LIST", data: data})
    },
    //设置渠道列表
    setChannelList: data => {
        dispatch({type: "SET_CHANNEL_LIST", data: data})
        dispatch({type: "SET_REDEEM_CODE_CREATE_CHANNEL", data: data[0]})
    },
    //监听兑换码名称输入框的值
    setName: e => {
        dispatch({type: "SET_REDEEM_CODE_CREATE_NAME", data: e.target.value})
    },
    //设置关联礼包
    setPack: data => {
        dispatch({type: "SET_REDEEM_CODE_CREATE_PACK", data: data})
    },
    //设置渠道
    setChannel: data => {
        dispatch({type: "SET_REDEEM_CODE_CREATE_CHANNEL", data: data})
    },
    //设置开始时间
    setStartTime: data => {
        dispatch({type: "SET_REDEEM_CODE_CREATE_START_TIME", data: data})
    },
    //设置结束时间
    setEndTime: data => {
        dispatch({type: "SET_REDEEM_CODE_CREATE_END_TIME", data: data})
    },
    //设置生成数量
    setNum: e => {
        let value = e.target.value
        if (value === "") {
            dispatch({type: "SET_REDEEM_CODE_CREATE_NUM", data: value})
            return
        }
        value = Number.parseInt(value)
        if (Number.isNaN(value)) {
            dispatch({type: "SET_REDEEM_CODE_CREATE_NUM", data: 1})
        } else {
            value = Math.min(value, 500000)
            dispatch({type: "SET_REDEEM_CODE_CREATE_NUM", data: value})
        }
    },
    //设置单条使用次数
    setMaxTimes: e => {
        let value = e.target.value
        if (value === "") {
            dispatch({type: "SET_REDEEM_CODE_CREATE_MAX_TIMES", data: value})
            return
        }
        if (Number.isNaN(value)) {
            dispatch({type: "SET_REDEEM_CODE_CREATE_MAX_TIMES", data: 1})
        } else {
            dispatch({type: "SET_REDEEM_CODE_CREATE_MAX_TIMES", data: value})
        }
    },
    //设置兑换码类型
    setType: data => {
        dispatch({type: "SET_REDEEM_CODE_CREATE_TYPE", data: data})
    },
    //提交
    submit: async props => {
        if (!confirm("确认要创建该兑换码吗？")) {
            return
        }
        try {
            let findPack = props.packIdAndNameList.find(d => {
                return d.name === props.redeemCodeCreatePack
            })
            if (findPack === undefined) {
                dispatch({
                    type: "SHOW_TIPS",
                    data: {level: "error", title: "所选礼包不存在", text: props.redeemCodeCreatePack}
                })
                return
            }
            let packId = findPack.id
            await postWithJWT(props.project, "../RedeemCode/table/redeemCode/create", {
                data: [{
                    name: props.redeemCodeCreateName,
                    packId: packId,
                    channel: props.redeemCodeCreateChannel,
                    startTime: props.redeemCodeCreateStartTime,
                    endTime: props.redeemCodeCreateEndTime,
                    total: props.redeemCodeCreateNum,
                    maxTimes: props.redeemCodeCreateMaxTimes,
                    type: props.redeemCodeCreateType
                }],
                uiGame: props.uiGame
            }, 60000)
            dispatch({type: "SHOW_TIPS", data: {level: "success", title: "创建兑换码成功", text: ""}})
        } catch (e) {
            let text
            switch (e.status) {
                case 400:
                    text = "参数不正确"
                    break
                case 500:
                    text = "服务器内部错误"
                    break
                default:
                    text = e
                    break
            }
            dispatch({type: "SHOW_TIPS", data: {level: "danger", title: "创建兑换码失败", text: text}})
        }

    },
    //取消，返回兑换码管理页面
    cancel: () => {
        location.hash = "/redeemCode"
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)