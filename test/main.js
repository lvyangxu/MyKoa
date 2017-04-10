"use strict";

require("babel-polyfill");
var React = require("react");
var ReactDom = require("react-dom");

var Datepicker = require("../modules/karl-component-datepicker/index");
var Nav = require("../modules/karl-component-nav/index");

ReactDom.render(React.createElement(
    "div",
    null,
    React.createElement(
        Nav,
        null,
        React.createElement(
            "div",
            null,
            "1"
        ),
        React.createElement(
            "div",
            null,
            "2"
        )
    )
), document.getElementById("test"));
