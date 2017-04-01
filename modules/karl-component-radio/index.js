"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

require("font-awesome-webpack");

var _karlHttp = require("karl-http");

var _karlHttp2 = _interopRequireDefault(_karlHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * react单选组件
 * data:单选值数组，元素可为数字或字符串
 * defaultBlank:如果该属性存在,组件input框显示的默认值为"",否则显示option的第一个元素的值
 * callback：值改变时执行的回调，参数为当前的值
 * initCallback：初始化后执行的回调，参数为当前的值
 * value：初始值
 * prefix：控件显示文字的前缀
 * suffix：控件显示文字的后缀
 * 示例：
 * <Radio defaultBlank data=[1,"asaga","根深蒂固"]/>
 */
var radio = function (_React$Component) {
    _inherits(radio, _React$Component);

    function radio(props) {
        _classCallCheck(this, radio);

        var _this = _possibleConstructorReturn(this, (radio.__proto__ || Object.getPrototypeOf(radio)).call(this, props));

        _this.state = {
            panelShow: false,
            sourceData: [],
            value: "",
            filterData: [],
            pageData: [],
            filterValue: "",
            pageIndex: 0
        };
        var bindArr = ["panelToggle", "filterChange", "select", "setOptionHtml", "slicePageData"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(radio, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            if (this.props.url != undefined) {
                _karlHttp2.default.post(this.props.url).then(function (d) {
                    var pageData = _this2.slicePageData(d, 0);
                    var value = "";
                    if (_this2.props.value == undefined) {
                        value = _this2.props.defaultBlank != undefined ? "" : d[0];
                    } else {
                        value = _this2.props.value;
                    }

                    _this2.setState({
                        value: value,
                        sourceData: d,
                        filterData: d,
                        pageData: pageData
                    });
                }).catch(function (d) {
                    console.log("init radio failed:" + d);
                });
            } else {
                var data = this.props.data;
                var pageData = this.slicePageData(data, 0);
                var value = "";
                if (this.props.value == undefined) {
                    value = this.props.defaultBlank != undefined ? "" : data[0];
                } else {
                    value = this.props.value;
                }
                this.setState({
                    value: value,
                    sourceData: data,
                    filterData: data,
                    pageData: pageData
                }, function () {
                    if (_this2.props.initCallback) {
                        _this2.props.initCallback(_this2.state.value);
                    }
                });
            }

            window.addEventListener("click", function () {
                if (_this2.state.panelShow) {
                    _this2.setState({ panelShow: false });
                }
            }, false);
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.value != nextProps.value) {
                this.setState({
                    value: nextProps.value
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var prefix = this.props.hasOwnProperty("prefix") ? this.props.prefix : "";
            var suffix = this.props.hasOwnProperty("suffix") ? this.props.suffix : "";
            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-radio" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.display, onClick: this.panelToggle },
                    "" + prefix + this.state.value + suffix,
                    _react2.default.createElement("i", { className: "fa fa-caret-down" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.panel,
                        onClick: function onClick(e) {
                            e.stopPropagation();
                        },
                        style: this.state.panelShow ? {} : { display: "none" } },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.filter },
                        _react2.default.createElement("input", { onChange: this.filterChange,
                            value: this.state.filterValue,
                            placeholder: "filter" })
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.options },
                        this.state.pageData.map(function (d, i) {
                            return _react2.default.createElement("div", { key: i, className: _index2.default.option, onClick: function onClick() {
                                    _this3.select(d);
                                }, dangerouslySetInnerHTML: _this3.setOptionHtml(d) });
                        }),
                        _react2.default.createElement(
                            "div",
                            { className: _index2.default.page },
                            _react2.default.createElement(
                                "button",
                                { className: _index2.default.pageLeft, onClick: function onClick() {
                                        _this3.pageToStart();
                                    } },
                                _react2.default.createElement("i", { className: "fa fa-angle-double-left" })
                            ),
                            _react2.default.createElement(
                                "button",
                                { className: _index2.default.pageLeft, onClick: function onClick() {
                                        _this3.pageLeft();
                                    } },
                                _react2.default.createElement("i", { className: "fa fa-angle-left" })
                            ),
                            this.state.pageIndex + 1 + "/" + (Math.ceil(this.state.filterData.length / 10) == 0 ? 1 : Math.ceil(this.state.filterData.length / 10)),
                            _react2.default.createElement(
                                "button",
                                { className: _index2.default.pageRight, onClick: function onClick() {
                                        _this3.pageRight();
                                    } },
                                _react2.default.createElement("i", { className: "fa fa-angle-right" })
                            ),
                            _react2.default.createElement(
                                "button",
                                { className: _index2.default.pageRight, onClick: function onClick() {
                                        _this3.pageToEnd();
                                    } },
                                _react2.default.createElement("i", { className: "fa fa-angle-double-right" })
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "panelToggle",
        value: function panelToggle(e) {
            e.stopPropagation();
            this.setState({
                panelShow: !this.state.panelShow
            });
        }
    }, {
        key: "filterChange",
        value: function filterChange(e) {
            var filterData = this.state.sourceData.filter(function (d) {
                return d.toString().includes(e.target.value);
            });
            var pageData = this.slicePageData(filterData, 0);
            this.setState({
                filterValue: e.target.value,
                pageIndex: 0,
                filterData: filterData,
                pageData: pageData
            });
        }
    }, {
        key: "select",
        value: function select(d) {
            this.setState({
                panelShow: false,
                value: d
            });

            if (this.props.callback) {
                this.props.callback(d);
            }
        }
    }, {
        key: "setOptionHtml",
        value: function setOptionHtml(d) {
            d = d.toString();
            var v = this.state.filterValue;
            var regex = new RegExp(v, "g");
            if (v == "") {
                return { __html: d };
            } else {
                var result = d.toString().replace(regex, function () {
                    return "<strong>" + v + "</strong>";
                });
                return { __html: result };
            }
        }
    }, {
        key: "slicePageData",
        value: function slicePageData(data, i) {
            var filterData = data;
            var start = i * 10;
            var end = i * 10 + 10;
            end = end > filterData.length ? filterData.length : end;
            var columnData = filterData.slice(start, end);
            return columnData;
        }
    }, {
        key: "pageLeft",
        value: function pageLeft() {
            var i = this.state.pageIndex;
            if (i != 0) {
                i--;
            }
            this.setState({
                pageIndex: i,
                pageData: this.slicePageData(this.state.filterData, i)
            });
        }
    }, {
        key: "pageRight",
        value: function pageRight() {
            var i = this.state.pageIndex;
            var end = Math.ceil(this.state.filterData.length / 10);
            if (i < end - 1) {
                i++;
            }
            this.setState({
                pageIndex: i,
                pageData: this.slicePageData(this.state.filterData, i)
            });
        }
    }, {
        key: "pageToStart",
        value: function pageToStart() {
            var i = 0;
            this.setState({
                pageIndex: i,
                pageData: this.slicePageData(this.state.filterData, i)
            });
        }
    }, {
        key: "pageToEnd",
        value: function pageToEnd() {
            var end = Math.ceil(this.state.filterData.length / 10);
            var i = end - 1;
            this.setState({
                pageIndex: i,
                pageData: this.slicePageData(this.state.filterData, i)
            });
        }
    }]);

    return radio;
}(_react2.default.Component);

module.exports = radio;
