"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("../actions/action");

exports.default = function (state, action) {
    var newState = void 0,
        pageIndex = void 0;
    switch (action.type) {
        case _action.TOGGLE_PANEL:
            newState = Object.assign({}, state, { isPanelShow: !state.isPanelShow });
            break;
        case _action.HIDE_PANEL:
            newState = Object.assign({}, state, { isPanelShow: false });
            break;
        case _action.STOP_PROPAGATION:
            action.e.stopPropagation();
            newState = Object.assign({}, state);
            break;
        case _action.CHOOSE_ITEM:
            newState = Object.assign({}, state, { value: action.value });
            if (state.callback !== undefined) {
                state.callback(action.value);
            }
            break;
        case _action.CHANGE_INPUT:
            newState = Object.assign({}, state, {
                filterValue: action.e.target.value.trim(),
                pageIndex: 0
            });
            break;
        case _action.DO_PAGE_LEFT:
            pageIndex = action.pageIndex;
            if (pageIndex !== 0) {
                pageIndex--;
            }
            newState = Object.assign({}, state, { pageIndex: pageIndex });
            break;
        case _action.DO_PAGE_RIGHT:
            pageIndex = action.pageIndex;
            if (pageIndex < action.pageEndIndex) {
                pageIndex++;
            }
            newState = Object.assign({}, state, { pageIndex: pageIndex });
            break;
        case _action.DO_PAGE_START:
            newState = Object.assign({}, state, { pageIndex: 0 });
            break;
        case _action.DO_PAGE_END:
            newState = Object.assign({}, state, { pageIndex: action.pageEndIndex });
            break;
        default:
            newState = Object.assign({}, state);
            break;
    }
    return newState;
};
