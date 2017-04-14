"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.postWithJWT = exports.getWithJWT = exports.post = exports.get = undefined;

require("isomorphic-fetch");

var doFetch = function _callee(url, data) {
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "POST";
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
                            return d.json();
                        }).then(function (d) {
                            if (d.success && d.hasOwnProperty("message")) {
                                resolve(d.message);
                            } else {
                                reject(d);
                            }
                        }).catch(function (e) {
                            reject(e);
                        });
                    });
                    return _context.abrupt("return", promise);

                case 2:
                case "end":
                    return _context.stop();
            }
        }
    }, null, undefined);
};

var get = exports.get = function get(url, data) {
    return doFetch(url, data, "GET");
};

var post = exports.post = function post(url, data) {
    return doFetch(url, data);
};

var getWithJWT = exports.getWithJWT = function getWithJWT(project, url, data) {
    var jwt = localStorage.getItem(project + "-jwt");
    if (jwt === null) {
        location.href = "../login/";
        return;
    }
    data = Object.assign({}, { jwt: jwt }, data);
    return get(url, data);
};

var postWithJWT = exports.postWithJWT = function postWithJWT(project, url, data) {
    var jwt = localStorage.getItem(project + "-jwt");
    if (jwt === null) {
        location.href = "../login/";
        return;
    }
    data = Object.assign({}, { jwt: jwt }, data);
    return post(url, data);
};
