"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _karlHttp = require("karl-http");

var _karlHttp2 = _interopRequireDefault(_karlHttp);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var login = function (_React$Component) {
    _inherits(login, _React$Component);

    function login(props) {
        _classCallCheck(this, login);

        var _this = _possibleConstructorReturn(this, (login.__proto__ || Object.getPrototypeOf(login)).call(this, props));

        _this.state = {
            username: "",
            password: "",
            tips: "",
            loginRedirect: ""
        };
        var bindArr = ["getItemName", "submit", "usernameChange", "passwordChange"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(login, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.getItemName();
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-login" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.row },
                    _react2.default.createElement("input", { value: this.state.username, onLoad: this.usernameChange, onChange: this.usernameChange,
                        placeholder: "username",
                        name: "karl-username", type: "text" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.row },
                    _react2.default.createElement("input", { value: this.state.password, onLoad: this.passwordChange, onChange: this.passwordChange,
                        placeholder: "password",
                        name: "karl-password", type: "password" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.row },
                    _react2.default.createElement(
                        "button",
                        { onClick: this.submit },
                        "sign in"
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.row },
                    _react2.default.createElement(
                        "div",
                        { className: "tips" },
                        this.state.tips
                    )
                )
            );
        }

        /**
         * 从服务器获取本地存储账号和密码的变量名称
         */

    }, {
        key: "getItemName",
        value: function getItemName() {
            var data;
            return regeneratorRuntime.async(function getItemName$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return regeneratorRuntime.awrap(_karlHttp2.default.post("../authorize/init"));

                        case 3:
                            data = _context.sent;

                            this.setState({
                                loginRedirect: data.loginRedirect
                            });
                            _context.next = 12;
                            break;

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](0);

                            this.setState({ "tips": "初始化失败" });
                            console.log("an error occured:");
                            console.log(_context.t0);

                        case 12:
                        case "end":
                            return _context.stop();
                    }
                }
            }, null, this, [[0, 7]]);
        }
    }, {
        key: "usernameChange",
        value: function usernameChange(e) {
            var d = e.target.value;
            d = d.trim();
            this.setState({ "username": d });
        }
    }, {
        key: "passwordChange",
        value: function passwordChange(e) {
            var d = e.target.value;
            d = d.trim();
            this.setState({ "password": d });
        }
    }, {
        key: "submit",
        value: function submit() {
            var data, d;
            return regeneratorRuntime.async(function submit$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            data = {
                                username: this.state.username,
                                password: this.state.password
                            };
                            _context2.prev = 1;
                            _context2.next = 4;
                            return regeneratorRuntime.awrap(_karlHttp2.default.post("../authorize/login", data));

                        case 4:
                            d = _context2.sent;

                            localStorage.setItem(d.project + "-jwt", d.jwt);
                            window.location.href = "../" + this.state.loginRedirect + "/";
                            _context2.next = 12;
                            break;

                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2["catch"](1);

                            this.setState({ "tips": _context2.t0 });

                        case 12:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, null, this, [[1, 9]]);
        }
    }]);

    return login;
}(_react2.default.Component);

module.exports = login;
