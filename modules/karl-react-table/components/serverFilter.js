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
        key: "condition",
        value: function condition(d, i) {
            var _this2 = this;

            var conditionDom = void 0;
            //设置条件筛选的默认日期
            var add = 0,
                startAdd = -7,
                endAdd = 0;

            if (d.type === "rangeMonth") {
                startAdd = -1;
            }
            if (d.type === "rangeSecond") {
                startAdd = -60 * 60 * 24 * 7;
            }
            if (d.hasOwnProperty("dateAdd")) {
                var dateAdd = d.dateAdd;
                add = dateAdd.hasOwnProperty("add") ? dateAdd.add : add;
                startAdd = dateAdd.hasOwnProperty("startAdd") ? dateAdd.startAdd : startAdd;
                endAdd = dateAdd.hasOwnProperty("endAdd") ? dateAdd.endAdd : endAdd;
            }
            var _d$placeholder = d.placeholder,
                placeholder = _d$placeholder === undefined ? d.name : _d$placeholder;

            var requiredJson = {};
            requiredJson[_index2.default.required] = d.required;
            switch (d.type) {
                case "input":
                    conditionDom = _react2.default.createElement(
                        "div",
                        { className: _index2.default.section, key: i },
                        _react2.default.createElement("input", { className: (0, _classnames2.default)(_index2.default.filter, requiredJson),
                            placeholder: placeholder, type: "text",
                            value: this.props[d.id + "Condition"],
                            onChange: function onChange(e) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", e.target.value);
                            } })
                    );
                    break;
                case "integer":
                    conditionDom = _react2.default.createElement(
                        "div",
                        { className: _index2.default.section, key: i },
                        _react2.default.createElement("input", { className: _index2.default.filter + requiredClassName, placeholder: placeholder, min: "0",
                            type: "number",
                            value: this.props[d.id + "Condition"],
                            onChange: function onChange(e) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", e.target.value);
                            } })
                    );
                    break;
                case "radio":
                    conditionDom = _react2.default.createElement(
                        "div",
                        { className: _index2.default.section, key: i },
                        _react2.default.createElement(Radio, { data: d.data, prefix: d.name + " : ", initCallback: function initCallback(d1) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", d1);
                            }, callback: function callback(d1) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", d1);
                            } })
                    );
                    break;
                case "day":
                case "month":
                case "second":
                    conditionDom = _react2.default.createElement(
                        "div",
                        { className: _index2.default.section, key: i },
                        d.name + "：",
                        _react2.default.createElement(_karlComponentDatepicker2.default, { prefix: d.name, type: d.type, add: add, initCallback: function initCallback(d1) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", d1);
                            }, callback: function callback(d1) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", d1);
                            } })
                    );
                    break;
                case "rangeDay":
                case "rangeMonth":
                case "rangeSecond":
                    var type = void 0;
                    switch (d.type) {
                        case "rangeDay":
                            type = "day";
                            break;
                        case "rangeMonth":
                            type = "month";
                            break;
                        case "rangeSecond":
                            type = "second";
                            break;
                    }
                    conditionDom = _react2.default.createElement(
                        "div",
                        { style: { display: "inline-block" }, key: i },
                        _react2.default.createElement(
                            "div",
                            { className: _index2.default.section },
                            d.name + "开始：",
                            _react2.default.createElement(_karlComponentDatepicker2.default, { type: type, add: startAdd, initCallback: function initCallback(d1) {
                                    _this2.props.serverFilterChangeCallback(d.id + "ConditionStart", d1);
                                }, callback: function callback(d1) {
                                    _this2.props.serverFilterChangeCallback(d.id + "ConditionStart", d1);
                                } })
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: _index2.default.section },
                            d.name + "结束：",
                            _react2.default.createElement(_karlComponentDatepicker2.default, { type: type, add: endAdd, initCallback: function initCallback(d1) {
                                    _this2.props.serverFilterChangeCallback(d.id + "ConditionEnd", d1);
                                }, callback: function callback(d1) {
                                    _this2.props.serverFilterChangeCallback(d.id + "ConditionEnd", d1);
                                } })
                        )
                    );
                    break;
                case "select":
                    conditionDom = _react2.default.createElement(
                        "div",
                        { className: _index2.default.section, key: i },
                        _react2.default.createElement(_karlComponentSelect2.default, { data: d.data, text: d.name, initCallback: function initCallback(d1) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", d1);
                            }, callback: function callback(d1) {
                                _this2.props.serverFilterChangeCallback(d.id + "Condition", d1);
                            } })
                    );
                    break;
            }
            return conditionDom;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: _index2.default.serverFilter,
                    style: this.props.serverFilter.length === 0 ? {} : { marginBottom: "20px" } },
                this.props.serverFilter.map(function (d, i) {
                    return _this3.condition(d, i);
                })
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
        //监听服务器控件状态变化
        serverFilterChangeCallback: function serverFilterChangeCallback(id, value) {
            dispatch({ type: "CHANGE_SERVER_FILTER", id: id, value: value });
        }

    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
