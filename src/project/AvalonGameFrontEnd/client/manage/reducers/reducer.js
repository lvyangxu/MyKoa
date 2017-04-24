import {
    SET_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB,
    SET_ITEM_LIST, SET_ITEM_BUNDLE_LIST, SET_CHANNEL_LIST,
    ADD_ITEM, CHANGE_ITEM,
    SET_ITEM_BUNDLE_CREATE_START_TIME, SET_ITEM_BUNDLE_CREATE_END_TIME,
    SHOW_TIPS
} from "../actions/action"
import $ from "jquery"

export default (state, action) => {
    let newState, pageIndex, currentItemList
    console.log(action.type)
    switch (action.type) {

        //设置道具列表
        case "SET_ITEM_LIST":
            newState = Object.assign({}, state, {itemList: action.data})
            break
        //设置礼包列表
        case "SET_PACK_LIST":
            newState = Object.assign({}, state, {packList: action.data})
            break
        //设置礼包id和名称的列表
        case "SET_PACK_ID_AND_NAME_LIST":
            newState = Object.assign({}, state, {packIdAndNameList: action.data})
            break
        //设置渠道列表
        case "SET_CHANNEL_LIST":
            newState = Object.assign({}, state, {channelList: action.data})
            break

        //设置兑换码创建页面的兑换码名称
        case "SET_REDEEM_CODE_CREATE_NAME":
            newState = Object.assign({}, state, {redeemCodeCreateName: action.data})
            break
        //设置兑换码创建页面的关联礼包
        case "SET_REDEEM_CODE_CREATE_PACK":
            newState = Object.assign({}, state, {redeemCodeCreatePack: action.data})
            break
        //设置兑换码创建页面的渠道
        case "SET_REDEEM_CODE_CREATE_CHANNEL":
            newState = Object.assign({}, state, {redeemCodeCreateChannel: action.data})
            break
        //设置兑换码创建页面的开始时间
        case "SET_REDEEM_CODE_CREATE_START_TIME":
            newState = Object.assign({}, state, {redeemCodeCreateStartTime: action.data})
            break
        //设置兑换码创建页面的结束时间
        case "SET_REDEEM_CODE_CREATE_END_TIME":
            newState = Object.assign({}, state, {redeemCodeCreateEndTime: action.data})
            break
        //设置兑换码创建页面的生成数量
        case "SET_REDEEM_CODE_CREATE_NUM":
            newState = Object.assign({}, state, {redeemCodeCreateNum: action.data})
            break
        //设置兑换码创建页面的单条使用次数
        case "SET_REDEEM_CODE_CREATE_MAX_TIMES":
            newState = Object.assign({}, state, {redeemCodeCreateMaxTimes: action.data})
            break
        //设置兑换码创建页面的兑换码类型
        case "SET_REDEEM_CODE_CREATE_TYPE":
            newState = Object.assign({}, state, {redeemCodeCreateType: action.data})
            break

        //设置菜单和内容高度
        case "SET_HEIGHT":
            let marginTop = $(action.menuRef).offset().top
            let height = $(window).height() - marginTop
            newState = Object.assign({}, state, {height: height})
            break

        //改变当前的游戏
        case "CHANGE_GAME":
            newState = Object.assign({}, state, {currentGame: action.currentGame})
            break
        //显示或隐藏二级菜单
        case "TOGGLE_MENU":
            let menuStatus = state.menuStatus.map(d => {
                if (d.name === action.name) {
                    d.expand = !d.expand
                }
                return d
            })
            newState = Object.assign({}, state, {menuStatus: menuStatus})
            break
        //设置当前活动的tab
        case "SET_ACTIVE_TAB":
            newState = Object.assign({}, state, {activeTab: action.activeTab})
            break

        //改变礼包创建页面的礼包名称
        case "SET_PACK_CREATE_NAME":
            newState = Object.assign({}, state, {packCreateName: action.data})
            break
        //增加一行礼包创建页面的道具
        case "ADD_PACK_CREATE_ITEM":
            currentItemList = state.currentItemList.concat()
            if (state.itemList.length > 0) {
                let firstItem = Object.assign({}, state.itemList[0])
                firstItem.num = 0
                firstItem.totalValue = 0
                currentItemList.push(firstItem)
            }
            newState = Object.assign({}, state, {currentItemList: currentItemList})
            break
        //改变礼包创建页面的道具
        case "CHANGE_PACK_CREATE_ITEM":
            currentItemList = state.currentItemList.concat()
            if (action.changeType === "name") {
                let findItem = state.itemList.find(d => {
                    return d.name === action.data
                })
                currentItemList = currentItemList.map((d, i) => {
                    if (i === action.index) {
                        d.name = action.data
                        d.value = findItem.value
                        d.totalValue = findItem.value * d.num
                    }
                    return d
                })
            } else {
                currentItemList = currentItemList.map((d, i) => {
                    if (i === action.index) {
                        d.num = action.data
                        d.totalValue = d.value * d.num
                    }
                    return d
                })
            }

            newState = Object.assign({}, state, {currentItemList: currentItemList})
            break

        //设置右上角提示的内容
        case "SHOW_TIPS":
            newState = Object.assign({}, state, {tipsData: action.data})
            break

        default:
            newState = Object.assign({}, state)
            break
    }
    return newState
}