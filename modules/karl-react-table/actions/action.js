"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.END_LOADING = exports.START_LOADING = exports.READ_FAILURE = exports.READ_SUCCESS = exports.READ_START = exports.CHANGE_PAGE_INDEX = exports.CHANGE_COLUMN_FILTER = exports.CHANGE_ROW_FILTER = exports.INIT = undefined;
exports.READ = READ;

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

function READ(props) {
    var _this = this;

    return function _callee(dispatch) {
        var data;
        return regeneratorRuntime.async(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        dispatch({ type: START_LOADING });
                        _context.prev = 1;
                        _context.next = 4;
                        return regeneratorRuntime.awrap((0, _request2.default)("read", props));

                    case 4:
                        data = _context.sent;

                        console.log(data);
                        dispatch({ type: END_LOADING });
                        _context.next = 13;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context["catch"](1);

                        dispatch({ type: END_LOADING });
                        console.log(_context.t0);

                    case 13:
                    case "end":
                        return _context.stop();
                }
            }
        }, null, _this, [[1, 9]]);
    };
}
