"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _index = require("../index.css");

var _index2 = _interopRequireDefault(_index);

var _karlComponentSelect = require("karl-component-select");

var _karlComponentSelect2 = _interopRequireDefault(_karlComponentSelect);

var _karlComponentDatepicker = require("karl-component-datepicker");

var _karlComponentDatepicker2 = _interopRequireDefault(_karlComponentDatepicker);

var _karlHttp = require("karl-http");

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
        key: "render",
        value: function render() {
            var _this2 = this;

            var loadingJson = {};
            loadingJson[_index2.default.loading] = this.props.isLoading;

            return _react2.default.createElement(
                "div",
                { className: _index2.default.actions },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "button",
                        { className: (0, _classnames2.default)(_index2.default.filter, loadingJson),
                            onClick: function onClick() {
                                _this2.props.read(_this2.props);
                            }, disabled: this.props.isLoading },
                        _react2.default.createElement("i", { className: (0, _classnames2.default)("fa fa-refresh", loadingJson) }),
                        "\u5237\u65B0"
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "button",
                        { className: _index2.default.filter, onClick: function onClick() {
                                _this2.props.export(_this2.props);
                            } },
                        _react2.default.createElement("i", { className: "fa fa-download" }),
                        "\u5BFC\u51FA"
                    )
                ),
                this.props.curd.includes("c") ? _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "button",
                        { className: _index2.default.filter, onClick: function onClick() {
                                _this2.props.create(_this2.props);
                            } },
                        _react2.default.createElement("i", { className: "fa fa-plus" }),
                        this.props.createText
                    )
                ) : "",
                this.props.curd.includes("d") ? _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "button",
                        { className: _index2.default.filter, onClick: function onClick() {
                                _this2.props.delete(_this2.props);
                            } },
                        _react2.default.createElement("i", { className: "fa fa-plus" }),
                        "\u5220\u9664"
                    )
                ) : ""
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.propTypes = {};


var mapStateToProps = function mapStateToProps(state) {
    var props = Object.assign({}, state, {});
    return props;
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        //导出为excel
        export: function _export(props) {
            var nameRow, valueRows, sheetData, jwt;
            return regeneratorRuntime.async(function _export$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            nameRow = props.columns.map(function (d) {
                                return d.name;
                            }).join("\t");
                            valueRows = props.sourceData.map(function (d) {
                                var row = props.columns.map(function (d1) {
                                    return d[d1.id];
                                }).join("\t");
                                return row;
                            }).join("\n");

                            if (!(valueRows === "")) {
                                _context.next = 5;
                                break;
                            }

                            alert("当前表格没有数据,无需下载");
                            return _context.abrupt("return");

                        case 5:
                            sheetData = nameRow + "\n" + valueRows;

                            sheetData = encodeURIComponent(sheetData);
                            jwt = localStorage.getItem(props.project + "-jwt");

                            location.href = "../POIServer/export?jwt=" + jwt + "&name=" + props.name + "&content=" + sheetData;

                        case 9:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, undefined);
        },
        //读取
        read: function read(props) {
            var data, requestData, message, text, checkedArr, componentFilterData, inputFilterData, sortedData, displayData;
            return regeneratorRuntime.async(function read$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            dispatch({ type: "START_LOADING" });
                            data = void 0;
                            //附加查询条件的数据

                            requestData = {};

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
                            dispatch({ type: "END_LOADING" });
                            _context2.next = 29;
                            break;

                        case 13:
                            _context2.prev = 13;
                            _context2.t0 = _context2["catch"](5);

                            dispatch({ type: "END_LOADING" });

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
                            dispatch({ type: "SET_SOURCE_DATA", data: data });

                            componentFilterData = (0, _dataMap.mapSourceDataToComponentFilterData)(props, data);

                            dispatch({ type: "SET_COMPONENT_FILTER_DATA", data: componentFilterData });

                            inputFilterData = (0, _dataMap.mapComponentFilterDataToInputFilterData)(componentFilterData, "");

                            dispatch({ type: "SET_INPUT_FILTER_DATA", data: inputFilterData });

                            sortedData = inputFilterData;

                            dispatch({ type: "SET_SORTED_DATA", data: sortedData });

                            displayData = (0, _dataMap.mapSortedDataToDisplayData)(sortedData, 1, props.rowPerPage);

                            dispatch({ type: "SET_DISPLAY_DATA", data: displayData });

                            dispatch({ type: "CHANGE_PAGE_INDEX", pageIndex: 1 });

                            if (props.showTips) {
                                props.showTips({
                                    level: "info",
                                    title: "读取成功",
                                    text: props.name
                                });
                            }

                        case 42:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, null, undefined, [[5, 13]]);
        },
        //创建
        create: function create(props) {
            if (props.hasOwnProperty("createUrl")) {
                location.hash = props.createUrl;
            }
        },
        //删除
        delete: function _delete(props) {
            var idArr, requestData, text;
            return regeneratorRuntime.async(function _delete$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            idArr = props.checkedArr.filter(function (d) {
                                return d.checked;
                            }).map(function (d) {
                                return d.id;
                            });

                            if (!(idArr.length === 0)) {
                                _context3.next = 4;
                                break;
                            }

                            alert("请至少勾选一行数据");
                            return _context3.abrupt("return");

                        case 4:
                            if (confirm("\u786E\u5B9A\u8981\u5220\u9664\u52FE\u9009\u7684" + idArr.length + "\u884C\u6570\u636E\u5417\uFF1F")) {
                                _context3.next = 6;
                                break;
                            }

                            return _context3.abrupt("return");

                        case 6:
                            requestData = { id: idArr };

                            if (props.requestParams !== undefined) {
                                props.requestParams.forEach(function (d) {
                                    requestData[d.id] = d.value;
                                });
                            }

                            _context3.prev = 8;
                            _context3.next = 11;
                            return regeneratorRuntime.awrap((0, _karlHttp.postWithJWT)(props.project, "/" + props.service + "/table/" + props.id + "/delete", requestData));

                        case 11:
                            if (props.showTips) {
                                props.showTips({
                                    level: "info",
                                    title: "删除成功",
                                    text: props.name
                                });
                            }
                            props.read(props);
                            _context3.next = 29;
                            break;

                        case 15:
                            _context3.prev = 15;
                            _context3.t0 = _context3["catch"](8);

                            if (!props.showTips) {
                                _context3.next = 29;
                                break;
                            }

                            text = void 0;
                            _context3.t1 = _context3.t0.status;
                            _context3.next = _context3.t1 === 400 ? 22 : _context3.t1 === 500 ? 24 : 26;
                            break;

                        case 22:
                            text = "参数不正确";
                            return _context3.abrupt("break", 28);

                        case 24:
                            text = "服务器内部错误";
                            return _context3.abrupt("break", 28);

                        case 26:
                            text = _context3.t0.message;
                            return _context3.abrupt("break", 28);

                        case 28:
                            props.showTips({
                                level: "danger",
                                title: "读取数据失败",
                                text: text
                            });

                        case 29:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, null, undefined, [[8, 15]]);
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
