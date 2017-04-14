"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _index = require("../index.css");

var _index2 = _interopRequireDefault(_index);

var _karlComponentSelect = require("karl-component-select");

var _karlComponentSelect2 = _interopRequireDefault(_karlComponentSelect);

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

            var thead = _react2.default.createElement(
                "thead",
                null,
                _react2.default.createElement(
                    "tr",
                    null,
                    this.props.columns.map(function (d, i) {
                        var style = d.hasOwnProperty("thStyle") ? d.thStyle : {};
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
                    })
                )
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
                    var tr = _react2.default.createElement(
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

MyComponent.propTypes = {
    thClickCallback: _react.PropTypes.func.isRequired,
    sortDesc: _react.PropTypes.bool.isRequired,
    sortColumnId: _react.PropTypes.string.isRequired,
    is100TableWidth: _react.PropTypes.bool.isRequired
};
MyComponent.defaultProps = {
    columns: []
};
exports.default = MyComponent;
