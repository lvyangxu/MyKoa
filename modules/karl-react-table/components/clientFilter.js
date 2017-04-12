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

            return _react2.default.createElement(
                "div",
                { className: _index2.default.clientFilter },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(_karlComponentSelect2.default, { data: this.props.columns, text: "\u5217\u8FC7\u6EE4", callback: this.props.columnFilterChangeCallback })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement("input", { className: _index2.default.rowFilter, placeholder: "\u884C\u8FC7\u6EE4", value: this.props.rowFilterValue,
                        onChange: function onChange(e) {
                            _this2.props.rowFilterChangeCallback(e.target.value);
                        } })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "select",
                        { className: _index2.default.page, value: this.props.pageIndex, onChange: function onChange(e) {
                                _this2.props.pageIndexChangeCallback(e.target.value);
                            } },
                        this.props.pageArr.map(function (d, i) {
                            return _react2.default.createElement(
                                "option",
                                { key: i, value: d },
                                d
                            );
                        })
                    ),
                    _react2.default.createElement(
                        "label",
                        null,
                        "\u5171",
                        this.props.pageArr.length,
                        "\u9875"
                    )
                )
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.propTypes = {
    columnFilterChangeCallback: _react.PropTypes.func.isRequired,
    rowFilterValue: _react.PropTypes.string.isRequired,
    rowFilterChangeCallback: _react.PropTypes.func.isRequired,
    pageIndexChangeCallback: _react.PropTypes.func.isRequired,
    pageArr: _react.PropTypes.array.isRequired
};
MyComponent.defaultProps = {
    pageArr: [],
    columns: []
};
exports.default = MyComponent;
