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
            var data, initData, serverFilter;
            return regeneratorRuntime.async(function componentWillMount$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return regeneratorRuntime.awrap((0, _request2.default)("init", this.props));

                        case 3:
                            data = _context.sent;
                            initData = {
                                columns: data.columns,
                                curd: data.curd
                            };
                            //服务器过滤列组件

                            serverFilter = data.columns.filter(function (d) {
                                return d.hasOwnProperty("serverFilter");
                            });

                            if (data.hasOwnProperty("extraFilter")) {
                                serverFilter = serverFilter.concat(data.extraFilter);
                            }
                            initData.serverFilter = serverFilter;
                            //最小化列显示
                            if (data.hasOwnProperty("isMinColumn")) {
                                initData.isMinColumn = data.isMinColumn;
                            }
                            //初始化图表
                            if (data.hasOwnProperty("chart")) {
                                initData.chart = data.chart;
                            }
                            //每页显示的行数
                            if (data.hasOwnProperty("rowPerPage")) {
                                initData.rowPerPage = data.rowPerPage;
                            }

                            this.props.init(initData);
                            _context.next = 18;
                            break;

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context["catch"](0);

                            console.log("init table " + this.props.id + " failed");
                            console.log(_context.t0);

                        case 18:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this, [[0, 14]]);
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
                _react2.default.createElement(_serverFilter2.default, { read: function read() {
                        _this2.props.read(_this2.props);
                    }, isLoading: this.props.isLoading }),
                _react2.default.createElement(_clientFilter2.default, { columns: this.props.columns,
                    curd: this.props.curd,
                    rowFilterValue: this.props.rowFilterValue,
                    rowFilterChangeCallback: this.props.rowFilterChangeCallback,
                    columnFilterChangeCallback: this.props.columnFilterChangeCallback,
                    pageIndex: this.props.pageIndex,
                    pageIndexChangeCallback: this.props.pageIndexChangeCallback,
                    pageArr: this.props.pageArr
                }),
                _react2.default.createElement(_table2.default, { columns: this.props.columns, displayData: this.props.displayData })
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.defaultProps = {
    inputFilterData: []
};


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
        read: function read(props) {
            var data, message, componentFilterData, inputFilterData, sortedData, displayData;
            return regeneratorRuntime.async(function read$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            dispatch({ type: _action.START_LOADING });
                            data = void 0;
                            _context2.prev = 2;
                            _context2.next = 5;
                            return regeneratorRuntime.awrap((0, _request2.default)("read", props));

                        case 5:
                            message = _context2.sent;

                            data = message.data;
                            dispatch({ type: _action.END_LOADING });
                            _context2.next = 15;
                            break;

                        case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2["catch"](2);

                            dispatch({ type: _action.END_LOADING });
                            console.log(_context2.t0);
                            return _context2.abrupt("return");

                        case 15:
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

                        case 25:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, null, undefined, [[2, 10]]);
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
