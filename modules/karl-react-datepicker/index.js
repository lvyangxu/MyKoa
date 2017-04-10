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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};

/**
 * react日期组件
 * type：日期类型，day/month/hour/minute/second/week，默认为day
 * add：默认值的偏移量，默认为0
 * callback：日期改变时执行的回调，参数为当前的值
 * initCallback：初始化后执行的回调，参数为当前的值
 *
 * 示例：
 * <Datepicker add="2" type="month"/>
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
            var _props, _props$type, type, _props$add, add, prefix, suffix, initCallback, callback, _props$isRange, isRange, preloadedState;

            return regeneratorRuntime.async(function componentWillMount$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _props = this.props, _props$type = _props.type, type = _props$type === undefined ? "day" : _props$type, _props$add = _props.add, add = _props$add === undefined ? 0 : _props$add, prefix = _props.prefix, suffix = _props.suffix, initCallback = _props.initCallback, callback = _props.callback, _props$isRange = _props.isRange, isRange = _props$isRange === undefined ? false : _props$isRange;
                            preloadedState = {
                                type: type,
                                add: add,
                                prefix: prefix,
                                suffix: suffix,
                                isPanelShow: false,
                                initCallback: initCallback,
                                callback: callback,
                                isRange: isRange
                            };

                            store = (0, _redux.createStore)(_reducer2.default, preloadedState);

                        case 3:
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
