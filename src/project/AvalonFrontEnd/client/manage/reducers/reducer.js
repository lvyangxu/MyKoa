import {
    SET_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB,
    SET_ITEM_LIST,
    ADD_ITEM,
    CHANGE_ITEM
} from "../actions/action"
import $ from "jquery"

export default (state, action) => {
    let newState, pageIndex, currentItemList
    switch (action.type) {
        case SET_HEIGHT:
            let marginTop = $(action.menuRef).offset().top
            let height = $(window).height() - marginTop
            newState = Object.assign({}, state, {height: height})
            break
        case CHANGE_GAME:
            newState = Object.assign({}, state, {currentGame: action.currentGame})
            break
        case TOGGLE_MENU:
            let menuStatus = state.menuStatus.map(d => {
                if (d.name === action.name) {
                    d.expand = !d.expand
                }
                return d
            })
            newState = Object.assign({}, state, {menuStatus: menuStatus})
            break
        case SET_ACTIVE_TAB:
            newState = Object.assign({}, state, {activeTab: action.activeTab})
            break
        case SET_ITEM_LIST:
            newState = Object.assign({}, state, {itemList: action.itemList})
            break
        case ADD_ITEM:
            currentItemList = state.currentItemList.concat()
            if (state.itemList.length > 0) {
                let firstItem = state.itemList[0]
                currentItemList.push(firstItem)
            }
            newState = Object.assign({}, state, {currentItemList: currentItemList})
            break
        case CHANGE_ITEM:
            currentItemList = state.currentItemList.concat()
            let findItem = state.itemList.find(d => {
                return d.name === action.itemName
            })
            currentItemList = currentItemList.map((d, i) => {
                if (i === action.index) {
                    d = findItem
                }
                return d
            })
            newState = Object.assign({}, state, {currentItemList: currentItemList})
            break
        default:
            newState = Object.assign({}, state)
            break
    }
    return newState
}