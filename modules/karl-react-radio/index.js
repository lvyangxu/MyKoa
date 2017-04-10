"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _app = require("./containers/app");

var _app2 = _interopRequireDefault(_app);

var _reducer = require("./reducers/reducer");

var _reducer2 = _interopRequireDefault(_reducer);

require("font-awesome-webpack");

var _karlHttp = require("karl-http");

var _karlHttp2 = _interopRequireDefault(_karlHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};

/**
 * react单选组件
 * data:单选值数组，元素可为数字或字符串
 * callback：值改变时执行的回调，参数为当前的值
 * initCallback：初始化后执行的回调，参数为当前的值
 * initValue：初始值，默认为data数组第一个元素
 * prefix：组件显示文字的前缀
 * suffix：组件显示文字的后缀
 * 示例：
 * <Radio data=[1,"a","b"]/>
 */

var MyComponent = function (_React$Component) {
    _inherits(MyComponent, _React$Component);

    function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).apply(this, arguments));
    }

    _createClass(MyComponent, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var data, value, preloadedState;
            return regeneratorRuntime.async(function componentWillMount$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            data = [];

                            if (!this.props.hasOwnProperty("url")) {
                                _context.next = 7;
                                break;
                            }

                            _context.next = 4;
                            return regeneratorRuntime.awrap(_karlHttp2.default.post(this.props.url));

                        case 4:
                            data = _context.sent;
                            _context.next = 8;
                            break;

                        case 7:
                            data = this.props.data;

                        case 8:
                            value = this.props.hasOwnProperty("initValue") ? this.props.initValue : data[0];
                            preloadedState = {
                                data: data,
                                value: value,
                                prefix: this.props.prefix,
                                suffix: this.props.suffix,
                                isPanelShow: false,
                                pageIndex: 0,
                                filterValue: "",
                                initCallback: this.props.initCallback,
                                callback: this.props.callback
                            };

                            store = (0, _redux.createStore)(_reducer2.default, preloadedState);

                        case 11:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(_app2.default, null)
            );
        }
    }]);

    return MyComponent;
}(_react2.default.Component);

module.exports = MyComponent;
