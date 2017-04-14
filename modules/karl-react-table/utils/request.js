"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _karlHttp = require("karl-http");

exports.default = function (action, props) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var url = "../api/" + props.serviceName;
    var path = "/table/" + props.id + "/" + action;
    data = Object.assign({}, { path: path }, data);
    return (0, _karlHttp.postWithJWT)(props.project, url, data);
};
