"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * react数字滚动插件
 * min：最小值，默认为0
 * max：最大值
 * callback：值改变后的回调，参数为值当前的数值
 *
 * 示例：
 */
var slider = function (_React$Component) {
    _inherits(slider, _React$Component);

    function slider(props) {
        _classCallCheck(this, slider);

        var _this = _possibleConstructorReturn(this, (slider.__proto__ || Object.getPrototypeOf(slider)).call(this, props));

        _this.state = {
            min: _this.props.min ? _this.props.min : 0,
            max: _this.props.max,
            callback: _this.props.callback
        };
        var bindArr = [];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(slider, [{
        key: "componentDidMount",
        value: function componentDidMount() {}
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-slider" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.container },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.rod },
                        _react2.default.createElement("div", { className: _index2.default.slider })
                    )
                )
            );
        }
    }]);

    return slider;
}(_react2.default.Component);

module.exports = slider;
