"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _serverFilter = require("../components/serverFilter");

var _serverFilter2 = _interopRequireDefault(_serverFilter);

var _actionRow = require("../components/actionRow");

var _actionRow2 = _interopRequireDefault(_actionRow);

var _clientFilter = require("../components/clientFilter");

var _clientFilter2 = _interopRequireDefault(_clientFilter);

var _table = require("../components/table");

var _table2 = _interopRequireDefault(_table);

var _index = require("../index.css");

var _index2 = _interopRequireDefault(_index);

var _action = require("../actions/action");

var _dataMap = require("../utils/dataMap");

var _karlHttp = require("karl-http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyComponent = function (_Component) {
    _inherits(MyComponent, _Component);

    function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).apply(this, arguments));
    }

    _createClass(MyComponent, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var data, requestData, serverFilter, initData;
            return regeneratorRuntime.async(function componentWillMount$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            data = void 0;
                            _context.prev = 1;

                            //从服务器获取数据
                            requestData = {};

                            if (this.props.requestParams !== undefined) {
                                this.props.requestParams.forEach(function (d) {
                                    requestData[d.id] = d.value;
                                });
                            }
                            _context.next = 6;
                            return regeneratorRuntime.awrap((0, _karlHttp.postWithJWT)(this.props.project, "/" + this.props.service + "/table/" + this.props.id + "/init", requestData));

                        case 6:
                            data = _context.sent;
                            _context.next = 14;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context["catch"](1);

                            console.log("init table " + this.props.id + " failed");
                            console.log(_context.t0);
                            // if (this.props.showTips) {
                            //     let errorMessage = e.message === "service is not available" ? "服务不可用" : e.message
                            //     this.props.showTips({
                            //         level: "danger",
                            //         title: "初始化表格数据失败",
                            //         text: "请重新刷新此页面,失败原因：" + errorMessage
                            //     })
                            // }
                            return _context.abrupt("return");

                        case 14:

                            //服务器过滤列组件
                            serverFilter = data.columns.filter(function (d) {
                                return d.hasOwnProperty("serverFilter");
                            });

                            if (data.hasOwnProperty("extraFilter")) {
                                serverFilter = serverFilter.concat(data.extraFilter);
                            }

                            initData = Object.assign({}, data, {
                                serverFilter: serverFilter
                            });

                            this.props.init(initData);

                            //初始化时自动读取
                            if (initData.autoRead) {
                                this.props.read(this.props, true);
                            }

                        case 19:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this, [[1, 9]]);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            if (this.props.autoRead === true) {
                this.props.read();
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                "div",
                { className: _index2.default.base },
                _react2.default.createElement(_serverFilter2.default, null),
                _react2.default.createElement(_actionRow2.default, { requestParams: this.props.requestParams }),
                _react2.default.createElement(_clientFilter2.default, { columns: this.props.columns,
                    curd: this.props.curd,
                    rowFilterValue: this.props.rowFilterValue,
                    rowFilterChangeCallback: this.props.rowFilterChangeCallback,
                    columnFilterChangeCallback: this.props.columnFilterChangeCallback,
                    pageIndex: this.props.pageIndex,
                    pageIndexChangeCallback: this.props.pageIndexChangeCallback,
                    pageArr: this.props.pageArr,
                    rowPerPage: this.props.rowPerPage,
                    rowPerPageChangeCallback: function rowPerPageChangeCallback(rowPerPage) {
                        _this2.props.rowPerPageChangeCallback(rowPerPage, _this2.props);
                    }
                }),
                _react2.default.createElement(_table2.default, null)
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.defaultProps = {};


var mapStateToProps = function mapStateToProps(state) {
    var pageArr = [];
    for (var i = 0; i < Math.ceil(state.inputFilterData.length / state.rowPerPage); i++) {
        pageArr.push(i + 1);
    }

    var props = Object.assign({}, state, {
        pageArr: pageArr
    });
    return props;
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        init: function init(initData) {
            initData = Object.assign({}, { type: _action.INIT }, initData);
            dispatch(initData);
        },
        setInitial: function setInitial() {
            dispatch({ type: SET_IS_INITIAL_FALSE });
        },
        rowFilterChangeCallback: function rowFilterChangeCallback(rowFilterValue) {
            dispatch({ type: "CLEAR_CHECKED_ARR" });
            dispatch({ type: _action.CHANGE_ROW_FILTER, rowFilterValue: rowFilterValue });
        },
        columnFilterChangeCallback: function columnFilterChangeCallback(columns) {
            dispatch({ type: _action.CHANGE_COLUMN_FILTER, columns: columns });
        },
        pageIndexChangeCallback: function pageIndexChangeCallback(pageIndex) {
            dispatch({ type: "CLEAR_CHECKED_ARR" });
            dispatch({ type: _action.CHANGE_PAGE_INDEX, pageIndex: pageIndex });
        },
        rowPerPageChangeCallback: function rowPerPageChangeCallback(rowPerPage, props) {
            dispatch({ type: "CLEAR_CHECKED_ARR" });
            dispatch({ type: _action.CHANGE_ROW_PER_PAGE, rowPerPage: rowPerPage });
            dispatch({ type: _action.CHANGE_PAGE_INDEX, pageIndex: 1 });
            var displayData = (0, _dataMap.mapSortedDataToDisplayData)(props.sortedData, 1, rowPerPage);
            dispatch({ type: _action.SET_DISPLAY_DATA, data: displayData });
        },
        read: function read(props, isAutoRead) {
            var data, requestData, message, text, checkedArr, componentFilterData, inputFilterData, sortedData, displayData;
            return regeneratorRuntime.async(function read$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            dispatch({ type: _action.START_LOADING });
                            data = void 0;
                            //附加查询条件的数据

                            requestData = isAutoRead ? { autoRead: true } : {};

                            if (props.requestParams !== undefined) {
                                props.requestParams.forEach(function (d) {
                                    requestData[d.id] = d.value;
                                });
                            }

                            props.serverFilter.forEach(function (d) {
                                switch (d.type) {
                                    case "day":
                                    case "second":
                                    case "month":
                                    case "select":
                                    case "input":
                                    case "integer":
                                    case "radio":
                                        requestData[d.id] = props[d.id + "Condition"];
                                        break;
                                    case "rangeDay":
                                    case "rangeMonth":
                                    case "rangeSecond":
                                        requestData[d.id] = {
                                            start: props[d.id + "ConditionStart"],
                                            end: props[d.id + "ConditionEnd"]
                                        };
                                        break;
                                }
                            });
                            _context2.prev = 5;
                            _context2.next = 8;
                            return regeneratorRuntime.awrap((0, _karlHttp.postWithJWT)(props.project, "/" + props.service + "/table/" + props.id + "/read", requestData));

                        case 8:
                            message = _context2.sent;

                            data = message.data;
                            dispatch({ type: _action.END_LOADING });
                            _context2.next = 29;
                            break;

                        case 13:
                            _context2.prev = 13;
                            _context2.t0 = _context2["catch"](5);

                            dispatch({ type: _action.END_LOADING });

                            if (!props.showTips) {
                                _context2.next = 28;
                                break;
                            }

                            text = void 0;
                            _context2.t1 = _context2.t0.status;
                            _context2.next = _context2.t1 === 400 ? 21 : _context2.t1 === 500 ? 23 : 25;
                            break;

                        case 21:
                            text = "参数不正确";
                            return _context2.abrupt("break", 27);

                        case 23:
                            text = "服务器内部错误";
                            return _context2.abrupt("break", 27);

                        case 25:
                            text = _context2.t0.message;
                            return _context2.abrupt("break", 27);

                        case 27:
                            props.showTips({
                                level: "danger",
                                title: "读取数据失败",
                                text: text
                            });

                        case 28:
                            return _context2.abrupt("return");

                        case 29:
                            checkedArr = data.map(function (d) {
                                return { id: d.id, checked: false };
                            });

                            dispatch({ type: "SET_CHECKED_ARR", data: checkedArr });
                            dispatch({ type: _action.SET_SOURCE_DATA, data: data });

                            componentFilterData = (0, _dataMap.mapSourceDataToComponentFilterData)(props, data);

                            dispatch({ type: _action.SET_COMPONENT_FILTER_DATA, data: componentFilterData });

                            inputFilterData = (0, _dataMap.mapComponentFilterDataToInputFilterData)(componentFilterData, "");

                            dispatch({ type: _action.SET_INPUT_FILTER_DATA, data: inputFilterData });

                            sortedData = inputFilterData;

                            dispatch({ type: _action.SET_SORTED_DATA, data: sortedData });

                            displayData = (0, _dataMap.mapSortedDataToDisplayData)(sortedData, 1, props.rowPerPage);

                            dispatch({ type: _action.SET_DISPLAY_DATA, data: displayData });

                            dispatch({ type: _action.CHANGE_PAGE_INDEX, pageIndex: 1 });

                            if (props.showTips) {
                                props.showTips({
                                    level: "info",
                                    title: "读取数据成功",
                                    text: props.name
                                });
                            }

                        case 42:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, null, undefined, [[5, 13]]);
        }

    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
