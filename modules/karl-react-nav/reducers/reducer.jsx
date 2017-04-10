import {
    TOGGLE_PANEL,
    HIDE_PANEL,
    STOP_PROPAGATION,
    CHOOSE_ITEM,
    CHANGE_INPUT,
    DO_PAGE_LEFT,
    DO_PAGE_RIGHT,
    DO_PAGE_START,
    DO_PAGE_END
} from "../actions/action"

export default (state, action) => {
    let newState, pageIndex
    switch (action.type) {
        case TOGGLE_PANEL:
            newState = Object.assign({}, state, {isPanelShow: !state.isPanelShow})
            break
        case HIDE_PANEL:
            newState = Object.assign({}, state, {isPanelShow: false})
            break
        case STOP_PROPAGATION:
            action.e.stopPropagation()
            newState = Object.assign({}, state)
            break
        case CHOOSE_ITEM:
            newState = Object.assign({}, state, {value: action.value})
            if (state.callback !== undefined) {
                state.callback(action.value)
            }
            break
        case CHANGE_INPUT:
            newState = Object.assign({}, state, {
                filterValue: action.e.target.value.trim(),
                pageIndex: 0
            })
            break
        case DO_PAGE_LEFT:
            pageIndex = action.pageIndex
            if (pageIndex !== 0) {
                pageIndex--
            }
            newState = Object.assign({}, state, {pageIndex: pageIndex})
            break
        case DO_PAGE_RIGHT:
            pageIndex = action.pageIndex
            if (pageIndex < action.pageEndIndex) {
                pageIndex++;
            }
            newState = Object.assign({}, state, {pageIndex: pageIndex})
            break
        case DO_PAGE_START:
            newState = Object.assign({}, state, {pageIndex: 0})
            break
        case DO_PAGE_END:
            newState = Object.assign({}, state, {pageIndex: action.pageEndIndex})
            break
        default:
            newState = Object.assign({}, state)
            break
    }
    return newState
}