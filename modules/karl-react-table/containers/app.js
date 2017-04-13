"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _clientFilter = require("../components/clientFilter");

var _clientFilter2 = _interopRequireDefault(_clientFilter);

var _serverFilter = require("../components/serverFilter");

var _serverFilter2 = _interopRequireDefault(_serverFilter);

var _table = require("../components/table");

var _table2 = _interopRequireDefault(_table);

var _index = require("../index.css");

var _index2 = _interopRequireDefault(_index);

var _action = require("../actions/action");

var _request = require("../utils/request");

var _request2 = _interopRequireDefault(_request);

var _dataMap = require("../utils/dataMap");

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
            var data, serverFilter, initData;
            return regeneratorRuntime.async(function componentWillMount$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            data = void 0;
                            _context.prev = 1;
                            _context.next = 4;
                            return regeneratorRuntime.awrap((0, _request2.default)("init", this.props));

                        case 4:
                            data = _context.sent;
                            _context.next = 11;
                            break;

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](1);

                            console.log("init table " + this.props.id + " failed");
                            console.log(_context.t0);

                        case 11:

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

                        case 15:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this, [[1, 7]]);
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
                _react2.default.createElement(_serverFilter2.default, { isLoading: this.props.isLoading, serverFilter: this.props.serverFilter,
                    serverFilterChangeCallback: this.props.serverFilterChangeCallback,
                    read: function read() {
                        _this2.props.read(_this2.props);
                    },
                    curd: this.props.curd,
                    exportClickCallback: this.props.exportClickCallback,
                    createClickCallback: this.props.createClickCallback,
                    createText: this.props.createText
                }),
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
                _react2.default.createElement(_table2.default, { columns: this.props.columns, displayData: this.props.displayData,
                    sortDesc: this.props.sortDesc, sortColumnId: this.props.sortColumnId,
                    thClickCallback: function thClickCallback(id) {
                        _this2.props.thClickCallback(id, _this2.props);
                    }
                })
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
        rowFilterChangeCallback: function rowFilterChangeCallback(rowFilterValue) {
            dispatch({ type: _action.CHANGE_ROW_FILTER, rowFilterValue: rowFilterValue });
        },
        columnFilterChangeCallback: function columnFilterChangeCallback(columns) {
            dispatch({ type: _action.CHANGE_COLUMN_FILTER, columns: columns });
        },
        pageIndexChangeCallback: function pageIndexChangeCallback(pageIndex) {
            dispatch({ type: _action.CHANGE_PAGE_INDEX, pageIndex: pageIndex });
        },
        rowPerPageChangeCallback: function rowPerPageChangeCallback(rowPerPage, props) {
            dispatch({ type: _action.CHANGE_ROW_PER_PAGE, rowPerPage: rowPerPage });
            dispatch({ type: _action.CHANGE_PAGE_INDEX, pageIndex: 1 });
            var displayData = (0, _dataMap.mapSortedDataToDisplayData)(props.sortedData, 1, rowPerPage);
            dispatch({ type: _action.SET_DISPLAY_DATA, data: displayData });
        },
        read: function read(props) {
            var data, requestData, message, componentFilterData, inputFilterData, sortedData, displayData;
            return regeneratorRuntime.async(function read$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            dispatch({ type: _action.START_LOADING });
                            data = void 0;
                            //附加查询条件的数据

                            requestData = {};

                            props.serverFilter.forEach(function (d) {
                                switch (d.type) {
                                    case "day":
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
                            _context2.prev = 4;
                            _context2.next = 7;
                            return regeneratorRuntime.awrap((0, _request2.default)("read", props, requestData));

                        case 7:
                            message = _context2.sent;

                            data = message.data;
                            dispatch({ type: _action.END_LOADING });
                            _context2.next = 17;
                            break;

                        case 12:
                            _context2.prev = 12;
                            _context2.t0 = _context2["catch"](4);

                            dispatch({ type: _action.END_LOADING });
                            console.log(_context2.t0);
                            return _context2.abrupt("return");

                        case 17:
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

                        case 27:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, null, undefined, [[4, 12]]);
        },
        serverFilterChangeCallback: function serverFilterChangeCallback(id, value) {
            dispatch({ type: _action.CHANGE_SERVER_FILTER, id: id, value: value });
        },
        thClickCallback: function thClickCallback(id, props) {
            var sortDesc = id === props.sortColumnId ? !props.sortDesc : true;
            var sortedData = (0, _dataMap.mapInputFilterDataToSortedData)(props.inputFilterData, id, sortDesc);
            dispatch({ type: _action.SET_SORTED_DATA, data: sortedData });

            var displayData = (0, _dataMap.mapSortedDataToDisplayData)(sortedData, props.pageIndex, props.rowPerPage);
            dispatch({ type: _action.SET_DISPLAY_DATA, data: displayData });

            dispatch({ type: _action.CHANGE_SORT_DESC, sortDesc: sortDesc });
            dispatch({ type: _action.CHANGE_SORT_COLUMN_ID, sortColumnId: id });
        },
        exportClickCallback: function exportClickCallback() {},
        createClickCallback: function createClickCallback() {
            location.hash = "itemBundleCreate";
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
