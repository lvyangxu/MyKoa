"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _action = require("../actions/action");

var _dataMap = require("../utils/dataMap");

exports.default = function (state, action) {
    var newState = void 0,
        inputFilterData = void 0,
        sortedData = void 0,
        displayData = void 0;
    switch (action.type) {
        case _action.INIT:
            var initData = Object.assign({}, action);
            delete initData.type;
            newState = Object.assign({}, state, initData);
            break;

        case _action.CHANGE_ROW_FILTER:
            inputFilterData = (0, _dataMap.mapComponentFilterDataToInputFilterData)(state.componentFilterData, action.rowFilterValue);
            sortedData = (0, _dataMap.mapInputFilterDataToSortedData)(inputFilterData, state.sortColumnId, state.sortDesc);
            displayData = (0, _dataMap.mapSortedDataToDisplayData)(sortedData, 1, state.rowPerPage);
            newState = Object.assign({}, state, {
                rowFilterValue: action.rowFilterValue,
                pageIndex: 1,
                inputFilterData: inputFilterData,
                sortedData: sortedData,
                displayData: displayData
            });
            break;
        case _action.CHANGE_COLUMN_FILTER:
            newState = Object.assign({}, state, { columns: action.columns });
            break;
        case _action.CHANGE_SERVER_FILTER:
            var serverFilterJson = {};
            serverFilterJson[action.id] = action.value;
            newState = Object.assign({}, state, serverFilterJson);
            break;
        case _action.CHANGE_PAGE_INDEX:
            displayData = (0, _dataMap.mapSortedDataToDisplayData)(state.sortedData, action.pageIndex, state.rowPerPage);
            newState = Object.assign({}, state, {
                pageIndex: action.pageIndex,
                displayData: displayData
            });
            break;
        case _action.CHANGE_ROW_PER_PAGE:
            newState = Object.assign({}, state, { rowPerPage: action.rowPerPage });
            break;

        // case READ:
        //     // try {
        //     //     //附加查询条件的数据
        //     //     let requestData = {};
        //     //     this.state.serverFilter.forEach(d=> {
        //     //         switch (d.type) {
        //     //             case "day":
        //     //             case "month":
        //     //             case "select":
        //     //             case "input":
        //     //             case "integer":
        //     //             case "radio":
        //     //                 requestData[d.id] = this.state[d.id + "Condition"];
        //     //                 break;
        //     //             case "rangeDay":
        //     //             case "rangeMonth":
        //     //             case "rangeSecond":
        //     //                 requestData[d.id] = {
        //     //                     start: this.state[d.id + "ConditionStart"],
        //     //                     end: this.state[d.id + "ConditionEnd"]
        //     //                 };
        //     //                 break;
        //     //         }
        //     //     });
        //     //     let message = await this.request("read", requestData);
        //     //     let data = message.data;
        //     //     let displayData = this.setDisplayData(data);
        //     //     let json = {
        //     //         loading: false,
        //     //         sourceData: data,
        //     //         sortedData: data,
        //     //         componentFilterData: data,
        //     //         inputFilterData: data,
        //     //         displayData: displayData,
        //     //         sortColumnId: "",
        //     //         rowFilterValue: ""
        //     //     };
        //     //
        //     //     //设置客户端筛选组件控件的值为undefind，恢复为全选
        //     //     this.state.columns.filter(d=> {
        //     //         return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
        //     //     }).forEach(d=> {
        //     //         let id = d.id;
        //     //         let componentData = [];
        //     //         data.forEach(d1=> {
        //     //             if (!componentData.includes(d1[id])) {
        //     //                 componentData.push(d1[id]);
        //     //             }
        //     //         });
        //     //         componentData = componentData.map((d1, i)=> {
        //     //             return {id: i, name: d1, checked: true};
        //     //         });
        //     //         json["clientFilter" + id] = componentData;
        //     //     });
        //     //
        //     //     if (message.hasOwnProperty("columns")) {
        //     //         json.columns = message.columns;
        //     //     }
        //     //
        //     //     //隐藏没有数据的列,显示有数据的列
        //     //     if (this.state.isMinColumn) {
        //     //         let columns = json.hasOwnProperty("columns") ? json.columns : this.state.columns;
        //     //         json.columns = columns.map(d=> {
        //     //             //判断该列是否为空
        //     //             let isNotEmpty = data.some(d1=> {
        //     //                 return d1.hasOwnProperty(d.id) && d1[d.id] != "" && d1[d.id] != null;
        //     //             });
        //     //             d.checked = isNotEmpty;
        //     //             return d;
        //     //         });
        //     //     }
        //     //     this.setState(json);

        case _action.START_LOADING:
            newState = Object.assign({}, state, { isLoading: true });
            break;
        case _action.END_LOADING:
            newState = Object.assign({}, state, { isLoading: false });
            break;

        //设置表格数据
        case _action.SET_SOURCE_DATA:
            newState = Object.assign({}, state, { sourceData: action.data });
            break;
        case _action.SET_COMPONENT_FILTER_DATA:
            newState = Object.assign({}, state, { componentFilterData: action.data });
            break;
        case _action.SET_INPUT_FILTER_DATA:
            newState = Object.assign({}, state, { inputFilterData: action.data });
            break;
        case _action.SET_SORTED_DATA:
            newState = Object.assign({}, state, { sortedData: action.data });
            break;
        case _action.SET_DISPLAY_DATA:
            newState = Object.assign({}, state, { displayData: action.data });
            break;

        //改变表格排序状态
        case _action.CHANGE_SORT_DESC:
            newState = Object.assign({}, state, { sortDesc: action.sortDesc });
            break;
        case _action.CHANGE_SORT_COLUMN_ID:
            newState = Object.assign({}, state, { sortColumnId: action.sortColumnId });
            break;

        //改变checkbox选中状态
        case "SET_CHECKED_ARR":
            newState = Object.assign({}, state, { checkedArr: action.data });
            break;
        //清除所有checkbox的选中
        case "CLEAR_CHECKED_ARR":
            var checkedArr = state.checkedArr.concat();
            checkedArr = checkedArr.map(function (d) {
                d.checked = false;
                return d;
            });
            newState = Object.assign({}, state, { checkedArr: checkedArr });
            break;
        //改变全选状态
        case "SET_ALL_CHECKED":
            newState = Object.assign({}, state, { isAllChecked: action.isAllChecked });
            break;

        default:
            newState = Object.assign({}, state);
            break;
    }
    return newState;
};
