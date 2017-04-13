"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET_TABLE = exports.SET_DISPLAY_DATA = exports.SET_SORTED_DATA = exports.SET_INPUT_FILTER_DATA = exports.SET_COMPONENT_FILTER_DATA = exports.SET_SOURCE_DATA = exports.CHANGE_ROW_PER_PAGE = exports.END_LOADING = exports.START_LOADING = exports.CHANGE_PAGE_INDEX = exports.CHANGE_SORT_COLUMN_ID = exports.CHANGE_SORT_DESC = exports.CHANGE_SERVER_FILTER = exports.CHANGE_COLUMN_FILTER = exports.CHANGE_ROW_FILTER = exports.INIT = undefined;

var _request = require("../utils/request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INIT = exports.INIT = "INIT";

//改变过滤器的值
var CHANGE_ROW_FILTER = exports.CHANGE_ROW_FILTER = "CHANGE_ROW_FILTER";
var CHANGE_COLUMN_FILTER = exports.CHANGE_COLUMN_FILTER = "CHANGE_COLUMN_FILTER";
var CHANGE_SERVER_FILTER = exports.CHANGE_SERVER_FILTER = "CHANGE_SERVER_FILTER";

//改变排序状态
var CHANGE_SORT_DESC = exports.CHANGE_SORT_DESC = "CHANGE_SORT_DESC";
var CHANGE_SORT_COLUMN_ID = exports.CHANGE_SORT_COLUMN_ID = "CHANGE_SORT_COLUMN_ID";

//表格按钮状态
var CHANGE_PAGE_INDEX = exports.CHANGE_PAGE_INDEX = "CHANGE_PAGE_INDEX";
var START_LOADING = exports.START_LOADING = "START_LOADING";
var END_LOADING = exports.END_LOADING = "END_LOADING";
var CHANGE_ROW_PER_PAGE = exports.CHANGE_ROW_PER_PAGE = "CHANGE_ROW_PER_PAGE";

//设置表格数据
var SET_SOURCE_DATA = exports.SET_SOURCE_DATA = "SET_SOURCE_DATA";
var SET_COMPONENT_FILTER_DATA = exports.SET_COMPONENT_FILTER_DATA = "SET_COMPONENT_FILTER_DATA";
var SET_INPUT_FILTER_DATA = exports.SET_INPUT_FILTER_DATA = "SET_INPUT_FILTER_DATA";
var SET_SORTED_DATA = exports.SET_SORTED_DATA = "SET_SORTED_DATA";
var SET_DISPLAY_DATA = exports.SET_DISPLAY_DATA = "SET_DISPLAY_DATA";

var RESET_TABLE = exports.RESET_TABLE = "RESET_TABLE";
