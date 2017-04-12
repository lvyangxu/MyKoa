"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _karlAjax = require("karl-ajax");

var _karlAjax2 = _interopRequireDefault(_karlAjax);

require("isomorphic-fetch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function _callee(action, props) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var jwt, path, response, responseData, message;
    return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    jwt = localStorage.getItem(props.project + "-jwt");

                    if (!(jwt === null)) {
                        _context.next = 4;
                        break;
                    }

                    location.href = "../login/";
                    return _context.abrupt("return");

                case 4:
                    data.jwt = jwt;
                    // data = Object.assign({}, data, {path: `/table/${props.id}/${action}`})
                    // return Ajax.post(`../api/${props.serviceName}`, data)
                    path = "/table/" + props.id + "/" + action;
                    _context.next = 8;
                    return regeneratorRuntime.awrap(fetch("../api/" + props.serviceName, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            path: path
                        })
                    }));

                case 8:
                    response = _context.sent;
                    _context.next = 11;
                    return regeneratorRuntime.awrap(response.json());

                case 11:
                    responseData = _context.sent;
                    message = responseData.message;
                    return _context.abrupt("return", message);

                case 14:
                case "end":
                    return _context.stop();
            }
        }
    }, null, undefined);
};
