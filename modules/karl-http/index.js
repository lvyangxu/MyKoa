"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.postWithJWT = exports.getWithJWT = exports.post = exports.get = undefined;

require("isomorphic-fetch");

var doFetch = function _callee(url, data) {
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "POST";
    var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;
    var promise;
    return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    promise = new Promise(function (resolve, reject) {
                        fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }).then(function (d) {
                            if (d.status !== 200) {
                                reject({ status: d.status });
                            }
                            return d.json();
                        }).then(function (d) {
                            if (d.success && d.hasOwnProperty("message")) {
                                resolve(d.message);
                            } else {
                                reject({ status: 200, message: d });
                            }
                        }).catch(function (e) {
                            reject(e);
                        });
                        setTimeout(function () {
                            reject({ status: 200, message: "request time out" });
                        }, timeout);
                    });
                    return _context.abrupt("return", promise);

                case 2:
                case "end":
                    return _context.stop();
            }
        }
    }, null, undefined);
};

var get = exports.get = function get(url, data, timeout) {
    return doFetch(url, data, "GET", timeout);
};

var post = exports.post = function post(url, data, timeout) {
    return doFetch(url, data, "POST", timeout);
};

var getWithJWT = exports.getWithJWT = function getWithJWT(project, url, data, timeout) {
    var jwt = localStorage.getItem(project + "-jwt");
    if (jwt === null) {
        location.href = "../login/";
        return;
    }
    data = Object.assign({}, { jwt: jwt }, data);
    return get(url, data, timeout);
};

var postWithJWT = exports.postWithJWT = function postWithJWT(project, url, data, timeout) {
    var jwt = localStorage.getItem(project + "-jwt");
    if (jwt === null) {
        location.href = "../login/";
        return;
    }
    data = Object.assign({}, { jwt: jwt }, data);
    return post(url, data, timeout);
};
