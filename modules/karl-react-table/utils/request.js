"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _karlAjax = require("karl-ajax");

var _karlAjax2 = _interopRequireDefault(_karlAjax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function _callee(action, props) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var jwt;
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
                    data = Object.assign({}, data, { path: "/table/" + props.id + "/" + action });
                    return _context.abrupt("return", _karlAjax2.default.post("../api/" + props.serviceName, data));

                case 7:
                case "end":
                    return _context.stop();
            }
        }
    }, null, undefined);
};
