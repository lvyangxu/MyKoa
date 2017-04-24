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

            var ths = this.props.columns.map(function (d, i) {
                var _d$thStyle = d.thStyle,
                    style = _d$thStyle === undefined ? {} : _d$thStyle;

                if (d.hasOwnProperty("checked") && d.checked === false) {
                    style.display = "none";
                }
                var th = _react2.default.createElement(
                    "th",
                    { key: i, style: style, onClick: function onClick() {
                            _this2.props.thClickCallback(d.id);
                        } },
                    d.name,
                    _this2.props.sortColumnId === d.id ? _react2.default.createElement("i", { className: (0, _classnames2.default)("fa", {
                            "fa-caret-up": _this2.props.sortDesc,
                            "fa-caret-down": !_this2.props.sortDesc
                        }) }) : ""
                );
                return th;
            });
            var thRow = this.props.curd.includes("u") || this.props.curd.includes("d") ? _react2.default.createElement(
                "tr",
                null,
                _react2.default.createElement(
                    "th",
                    { className: _index2.default.checkbox },
                    _react2.default.createElement("input", { type: "checkbox", checked: this.props.isAllChecked, onChange: function onChange() {
                            _this2.props.thCheck(_this2.props);
                        } })
                ),
                ths
            ) : _react2.default.createElement(
                "tr",
                null,
                ths
            );
            var thead = _react2.default.createElement(
                "thead",
                null,
                thRow
            );
            var tbody = _react2.default.createElement(
                "tbody",
                null,
                this.props.displayData.map(function (d, i) {
                    var tds = _this2.props.columns.map(function (d1, j) {
                        var tdDom = void 0;
                        var _d1$style = d1.style,
                            style = _d1$style === undefined ? {} : _d1$style,
                            _d1$imageStyle = d1.imageStyle,
                            imageStyle = _d1$imageStyle === undefined ? {} : _d1$imageStyle;

                        if (d1.type === "image") {
                            tdDom = _react2.default.createElement(
                                "td",
                                { key: j, style: style },
                                _react2.default.createElement("img", { style: imageStyle, src: "images/" + d[d1.id] })
                            );
                        } else {
                            var tdHtml = d[d1.id];
                            if (tdHtml) {
                                tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                            }
                            //当含有后缀并且不为空字符串时，附加后缀
                            if (d1.hasOwnProperty("suffix") && tdHtml !== "") {
                                tdHtml += d1.suffix;
                            }
                            if (d1.hasOwnProperty("checked") && d1.checked === false) {
                                style.display = "none";
                            } else {
                                delete style.display;
                            }
                            tdDom = _react2.default.createElement("td", { key: j, style: style, dangerouslySetInnerHTML: { __html: tdHtml } });
                        }
                        return tdDom;
                    });
                    var findChecked = _this2.props.checkedArr.find(function (d1) {
                        return d1.id === d.id;
                    });
                    var isChecked = findChecked === undefined ? false : findChecked.checked;
                    var tr = _this2.props.curd.includes("u") || _this2.props.curd.includes("d") ? _react2.default.createElement(
                        "tr",
                        { key: i },
                        _react2.default.createElement(
                            "td",
                            { className: _index2.default.checkbox },
                            _react2.default.createElement("input", { type: "checkbox", checked: isChecked,
                                onChange: function onChange() {
                                    _this2.props.tdCheck(_this2.props, d.id);
                                }
                            })
                        ),
                        tds
                    ) : _react2.default.createElement(
                        "tr",
                        { key: i },
                        tds
                    );
                    return tr;
                })
            );
            var dom = _react2.default.createElement(
                "div",
                { className: _index2.default.table },
                _react2.default.createElement(
                    "table",
                    { style: this.props.is100TableWidth === true ? {} : { width: "auto" } },
                    thead,
                    tbody
                )
            );
            return dom;
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.defaultProps = {
    columns: []
};


var mapStateToProps = function mapStateToProps(state) {
    var props = Object.assign({}, state, {});
    return props;
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        //th列点击后进行排序
        thClickCallback: function thClickCallback(id, props) {
            var sortDesc = id === props.sortColumnId ? !props.sortDesc : true;
            var sortedData = (0, _dataMap.mapInputFilterDataToSortedData)(props.inputFilterData, id, sortDesc);
            dispatch({ type: "SET_SORTED_DATA", data: sortedData });

            var displayData = (0, _dataMap.mapSortedDataToDisplayData)(sortedData, props.pageIndex, props.rowPerPage);
            dispatch({ type: "SET_DISPLAY_DATA", data: displayData });

            dispatch({ type: "CHANGE_SORT_DESC", sortDesc: sortDesc });
            dispatch({ type: "CHANGE_SORT_COLUMN_ID", sortColumnId: id });
        },
        //checkbox选中状态改变
        tdCheck: function tdCheck(props, id) {
            var checkedArr = props.checkedArr.concat();
            checkedArr = checkedArr.map(function (d) {
                if (d.id === id) {
                    d.checked = !d.checked;
                }
                return d;
            });
            dispatch({ type: "SET_CHECKED_ARR", data: checkedArr });
        },
        //全选状态改变
        thCheck: function thCheck(props) {
            var checkedArr = props.checkedArr.concat();
            var idArr = props.displayData.map(function (d) {
                return d.id;
            });
            if (props.isAllChecked) {
                //从全选到全不选
                dispatch({ type: "CLEAR_CHECKED_ARR" });
            } else {
                //从全不选到全选
                checkedArr = checkedArr.map(function (d) {
                    if (idArr.includes(d.id)) {
                        d.checked = true;
                    }
                    return d;
                });
                dispatch({ type: "SET_CHECKED_ARR", data: checkedArr });
            }
            dispatch({ type: "SET_ALL_CHECKED", isAllChecked: !props.isAllChecked });
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
