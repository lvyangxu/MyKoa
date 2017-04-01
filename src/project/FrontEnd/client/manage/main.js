"use strict";

require("babel-polyfill");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _karlComponentNav = require("karl-component-nav");

var _karlComponentNav2 = _interopRequireDefault(_karlComponentNav);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_karlComponentNav2.default, { sectionStyle: { padding: "50px" }, data: [{
        id: "online", name: "每日信息", group: "服务器信息",
        dom: _react2.default.createElement("div", null)
    }] }), document.getElementById("content"));
// import Table from "../table/index.jsx";


_reactDom2.default.render(_react2.default.createElement(
    "div",
    { className: _index2.default.top },
    _react2.default.createElement("div", { className: _index2.default.tips })
), document.getElementById("top"));
