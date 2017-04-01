"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

require("font-awesome-webpack");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * react多选组件
 * text:显示的文字
 * data:值得json数组,例如{id:string,name:string,checked:boolean}
 * optionNumPerColumn:每一列显示option的数量，默认为10
 * lang:界面语言,en或ch，默认为en
 * callback:值改变后的回调，参数为值改变后对应的data数组
 * initCallback：初始化后执行的回调，参数为data数组
 *
 * 示例：
 * <Select text="呵呵" data=[
 *         {id:"a",name:"大概",checked:true},
 *         {id:"b",name:"asf",checked:true},
 *         {id:"c",name:"sf方式",checked:false},
 *     ] optionNumPerColumn={5} lang="ch" callback={d=>{
 *         console.log("data array is");
 *         console.log(data);
 *     }}/>
 */
var select = function (_React$Component) {
    _inherits(select, _React$Component);

    function select(props) {
        _classCallCheck(this, select);

        var _this = _possibleConstructorReturn(this, (select.__proto__ || Object.getPrototypeOf(select)).call(this, props));

        _this.state = {
            panelShow: false,
            data: [],
            allChecked: false,
            optionNumPerColumn: _this.props.optionNumPerColumn ? _this.props.optionNumPerColumn : 10,
            lang: _this.props.lang == "ch" ? "ch" : "en"
        };
        var bindArr = ["panelToggle", "setData", "check", "allCheck"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(select, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var data = this.setData(this.props.data);
            this.setState({ data: data });

            window.addEventListener("click", function () {
                if (_this2.state.panelShow) {
                    _this2.setState({ panelShow: false });
                }
            }, false);
            if (this.props.initCallback) {
                (function () {
                    var sourceData = [];
                    data.forEach(function (d) {
                        d.forEach(function (d1) {
                            sourceData.push(d1);
                        });
                    });
                    _this2.props.initCallback(sourceData);
                })();
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var data = this.setData(nextProps.data);
            this.setState({ data: data });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-select" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.input, onClick: this.panelToggle },
                    this.props.text,
                    _react2.default.createElement("i", { className: "fa fa-caret-down" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.panel, style: this.state.panelShow ? {} : { display: "none" },
                        onClick: function onClick(e) {
                            e.stopPropagation();
                        } },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.allCheck },
                        _react2.default.createElement("input", { type: "checkbox", onChange: function onChange(e) {
                                _this3.allCheck(e);
                            }, checked: this.state.allChecked }),
                        _react2.default.createElement(
                            "label",
                            null,
                            this.state.lang == "ch" ? "全选" : "check all"
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.options },
                        this.state.data.map(function (d, i) {
                            return _react2.default.createElement(
                                "div",
                                { key: i, className: _index2.default.column },
                                d.map(function (d1, j) {
                                    return _react2.default.createElement(
                                        "div",
                                        { className: _index2.default.option, key: j },
                                        _react2.default.createElement("input", { type: "checkbox", onChange: function onChange(e) {
                                                _this3.check(e, d1.id);
                                            }, checked: d1.checked }),
                                        _react2.default.createElement(
                                            "label",
                                            null,
                                            d1.name
                                        )
                                    );
                                })
                            );
                        })
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
        key: "setData",
        value: function setData(d) {
            var columnDataArr = [];
            var num = this.state.optionNumPerColumn;
            for (var i = 0; i < d.length; i = i + num) {
                var end = i + num > d.length ? d.length : i + num;
                var columnData = d.slice(i, end);
                columnDataArr.push(columnData);
            }
            return columnDataArr;
        }
    }, {
        key: "check",
        value: function check(e, id) {
            var _this4 = this;

            e.target.parentNode.parentNode.parentNode.parentNode.parentNode.focus();
            var data = this.state.data.map(function (d) {
                d = d.map(function (d1) {
                    if (d1.id == id) {
                        d1.checked = !d1.checked;
                    }
                    return d1;
                });
                return d;
            });
            this.setState({
                data: data
            });
            if (this.props.callback) {
                (function () {
                    var sourceData = [];
                    _this4.state.data.forEach(function (d) {
                        d.forEach(function (d1) {
                            sourceData.push(d1);
                        });
                    });
                    _this4.props.callback(sourceData);
                })();
            }
        }
    }, {
        key: "allCheck",
        value: function allCheck(e) {
            var _this5 = this;

            e.target.parentNode.parentNode.parentNode.focus();
            var isAllChecked = !this.state.allChecked;
            var data = this.state.data.map(function (d) {
                d.map(function (d1) {
                    d1.checked = isAllChecked;
                });
                return d;
            });
            this.setState({
                allChecked: isAllChecked,
                data: data
            });
            if (this.props.callback) {
                (function () {
                    var sourceData = [];
                    _this5.state.data.forEach(function (d) {
                        d.forEach(function (d1) {
                            sourceData.push(d1);
                        });
                    });
                    _this5.props.callback(sourceData);
                })();
            }
        }
    }]);

    return select;
}(_react2.default.Component);

module.exports = select;
