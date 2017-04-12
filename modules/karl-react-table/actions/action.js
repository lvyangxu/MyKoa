"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET_TABLE = exports.SET_DISPLAY_DATA = exports.SET_SORTED_DATA = exports.SET_INPUT_FILTER_DATA = exports.SET_COMPONENT_FILTER_DATA = exports.SET_SOURCE_DATA = exports.UPDATE_UI = exports.END_LOADING = exports.START_LOADING = exports.READ_FAILURE = exports.READ_SUCCESS = exports.READ_START = exports.CHANGE_PAGE_INDEX = exports.CHANGE_COLUMN_FILTER = exports.CHANGE_ROW_FILTER = exports.INIT = undefined;

var _request = require("../utils/request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INIT = exports.INIT = "INIT";
var CHANGE_ROW_FILTER = exports.CHANGE_ROW_FILTER = "CHANGE_ROW_FILTER";
var CHANGE_COLUMN_FILTER = exports.CHANGE_COLUMN_FILTER = "CHANGE_COLUMN_FILTER";
var CHANGE_PAGE_INDEX = exports.CHANGE_PAGE_INDEX = "CHANGE_PAGE_INDEX";
var READ_START = exports.READ_START = "READ_START";
var READ_SUCCESS = exports.READ_SUCCESS = "READ_SUCCESS";
var READ_FAILURE = exports.READ_FAILURE = "READ_FAILURE";
var START_LOADING = exports.START_LOADING = "START_LOADING";
var END_LOADING = exports.END_LOADING = "END_LOADING";
var UPDATE_UI = exports.UPDATE_UI = "UPDATE_UI";

//设置表格数据
var SET_SOURCE_DATA = exports.SET_SOURCE_DATA = "SET_SOURCE_DATA";
var SET_COMPONENT_FILTER_DATA = exports.SET_COMPONENT_FILTER_DATA = "SET_COMPONENT_FILTER_DATA";
var SET_INPUT_FILTER_DATA = exports.SET_INPUT_FILTER_DATA = "SET_INPUT_FILTER_DATA";
var SET_SORTED_DATA = exports.SET_SORTED_DATA = "SET_SORTED_DATA";
var SET_DISPLAY_DATA = exports.SET_DISPLAY_DATA = "SET_DISPLAY_DATA";

var RESET_TABLE = exports.RESET_TABLE = "RESET_TABLE";
