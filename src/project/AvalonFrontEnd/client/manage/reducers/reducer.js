import {
    SET_MENU_HEIGHT,
    CHANGE_GAME,
    TOGGLE_MENU,
    SET_ACTIVE_TAB
} from "../actions/action"
import $ from "jquery"

export default (state, action) => {
    let newState, pageIndex
    switch (action.type) {
        case SET_MENU_HEIGHT:
            let marginTop = $(action.menuRef).offset().top
            let menuHeight = $(window).height() - marginTop
            newState = Object.assign({}, state, {menuHeight: menuHeight})
            break
        case CHANGE_GAME:
            let games = state.games.map(d => {
                if (d.name === action.currentGame) {
                    d.checked = true
                } else {
                    d.checked = false
                }
                return d
            })
            newState = Object.assign({}, state, {games: games})
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
        default:
            newState = Object.assign({}, state)
            break
    }
    return newState
}