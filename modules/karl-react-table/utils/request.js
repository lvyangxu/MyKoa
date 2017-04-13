"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

require("isomorphic-fetch");

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
                    path = "/table/" + props.id + "/" + action;

                    data = Object.assign({}, { path: path }, data);
                    _context.next = 9;
                    return regeneratorRuntime.awrap(fetch("../api/" + props.serviceName, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }));

                case 9:
                    response = _context.sent;
                    _context.next = 12;
                    return regeneratorRuntime.awrap(response.json());

                case 12:
                    responseData = _context.sent;
                    message = responseData.message;
                    return _context.abrupt("return", message);

                case 15:
                case "end":
                    return _context.stop();
            }
        }
    }, null, undefined);
};
