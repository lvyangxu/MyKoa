"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("../index.css");

var _index2 = _interopRequireDefault(_index);

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
            return _react2.default.createElement(
                "div",
                { className: _index2.default.page },
                _react2.default.createElement(
                    "button",
                    { className: _index2.default.pageLeft, onClick: this.props.doPageStart },
                    _react2.default.createElement("i", { className: "fa fa-angle-double-left" })
                ),
                _react2.default.createElement(
                    "button",
                    { className: _index2.default.pageLeft, onClick: this.props.doPageLeft },
                    _react2.default.createElement("i", { className: "fa fa-angle-left" })
                ),
                this.props.pageIndex + 1 + "/" + (this.props.pageEndIndex + 1),
                _react2.default.createElement(
                    "button",
                    { className: _index2.default.pageRight, onClick: this.props.doPageRight },
                    _react2.default.createElement("i", { className: "fa fa-angle-right" })
                ),
                _react2.default.createElement(
                    "button",
                    { className: _index2.default.pageRight, onClick: this.props.doPageEnd },
                    _react2.default.createElement("i", { className: "fa fa-angle-double-right" })
                )
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.propTypes = {
    doPageStart: _react.PropTypes.func.isRequired,
    doPageLeft: _react.PropTypes.func.isRequired,
    doPageRight: _react.PropTypes.func.isRequired,
    doPageEnd: _react.PropTypes.func.isRequired,
    pageIndex: _react.PropTypes.number.isRequired,
    pageEndIndex: _react.PropTypes.number.isRequired
};
exports.default = MyComponent;
