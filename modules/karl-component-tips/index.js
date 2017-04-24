"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

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
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            if (this.props.data !== nextProps.data) {
                if ((0, _jquery2.default)(this.base).is(":animated")) {
                    (0, _jquery2.default)(this.base).stop();
                }
                (0, _jquery2.default)(this.base).css({ opacity: "1", display: "block" });
                (0, _jquery2.default)(this.base).animate({ opacity: "0" }, 10000, "linear", function () {
                    (0, _jquery2.default)(_this2.base).css({ display: "none" });
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: (0, _classnames2.default)(this.props.className, _index2.default.base), style: { opacity: "0" }, ref: function ref(d) {
                        _this3.base = d;
                    } },
                _react2.default.createElement(
                    "div",
                    { className: (0, _classnames2.default)(_index2.default.message, _index2.default[this.props.data.level]) },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.title },
                        this.props.data.title
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.text },
                        this.props.data.text
                    )
                )
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.propTypes = {
    data: _react.PropTypes.object.isRequired
};
exports.default = MyComponent;
