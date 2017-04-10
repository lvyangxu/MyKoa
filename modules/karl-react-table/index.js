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

var _karlAjax = require("karl-ajax");

var _karlAjax2 = _interopRequireDefault(_karlAjax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};

/**
 * react表格
 * 示例：
 * <Table id="aa" project="vgas"/>
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
            var data, columns, curd, preloadedState;
            return regeneratorRuntime.async(function componentWillMount$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return regeneratorRuntime.awrap(this.request("init"));

                        case 2:
                            data = _context.sent;
                            columns = data.columns, curd = data.curd;

                            console.log(data);
                            preloadedState = {
                                columns: columns,
                                curd: curd
                            };

                            store = (0, _redux.createStore)(_reducer2.default, preloadedState);

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this);
        }

        /**
         * 带jwt的http请求
         */

    }, {
        key: "request",
        value: function request(action) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var jwt, d;
            return regeneratorRuntime.async(function request$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            jwt = localStorage.getItem(this.props.project + "-jwt");

                            if (!(jwt === null)) {
                                _context2.next = 5;
                                break;
                            }

                            location.href = "../login/";
                            _context2.next = 11;
                            break;

                        case 5:
                            data.jwt = jwt;
                            data = Object.assign(data, { id: this.props.id, action: action });
                            _context2.next = 9;
                            return regeneratorRuntime.awrap(_karlAjax2.default.post("../" + this.props.serviceName + "/table", data));

                        case 9:
                            d = _context2.sent;
                            return _context2.abrupt("return", d);

                        case 11:
                        case "end":
                            return _context2.stop();
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
