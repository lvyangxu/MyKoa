"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = function () {
    function http() {
        _classCallCheck(this, http);
    }

    _createClass(http, null, [{
        key: "doAjaxInJquery",

        /**
         * 用jquery的ajax方法执行http请求
         * @param param ajax option
         * @returns {*|void}
         */
        value: function doAjaxInJquery(param) {
            var request = _jquery2.default.ajax({
                type: param.type || "post",
                url: param.url,
                cache: false,
                timeout: (param.requestTimeOutSecond || 30) * 1000,
                data: param.contentType === "application/json" ? JSON.stringify(param.data) : param.data,
                contentType: param.contentType || "application/x-www-form-urlencoded;charset=utf-8",
                dataType: param.dataType || "text"
            }).done(function (data, textStatus, jqXHR) {
                param.successCallback({
                    data: data,
                    textStatus: textStatus,
                    jqXHR: jqXHR
                });
            }).fail(function (jqXHR, textStatus, errorThrown) {
                param.failureCallback({
                    jqXHR: jqXHR,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                });
            });
            return request;
        }

        /**
         * 执行http post请求，contentType和dataType均为json
         * @param url
         * @param data
         * @returns {Promise}
         */

    }, {
        key: "post",
        value: function post(url) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var promise = new Promise(function (resolve, reject) {
                http.doAjaxInJquery({
                    url: url,
                    data: data,
                    contentType: "application/json",
                    dataType: "json",
                    successCallback: function successCallback(_ref) {
                        var data = _ref.data,
                            textStatus = _ref.textStatus,
                            jqXHR = _ref.jqXHR;

                        if (data.success === undefined || data.message === undefined) {
                            reject("unexpected json:" + data);
                            return;
                        }
                        if (data.success === true) {
                            if (data.hasOwnProperty("project") && data.hasOwnProperty("jwt")) {
                                localStorage[data.project + "-jwt"] = data.jwt;
                            }
                            resolve(data.message);
                        } else {
                            reject(data.message);
                        }
                    },
                    failureCallback: function failureCallback(_ref2) {
                        var jqXHR = _ref2.jqXHR,
                            textStatus = _ref2.textStatus,
                            errorThrown = _ref2.errorThrown;

                        if (jqXHR.status === 401) {
                            window.location.href = "../login/";
                            return;
                        }
                        reject("http请求失败");
                    }
                });
            });
            return promise;
        }

        /**
         * 执行http get请求，contentType和dataType均为json
         * @param url
         * @param data
         * @returns {Promise}
         */
        // static get(url, data) {
        //     let promise = new Promise((resolve, reject) => {
        //         data = (data == undefined) ? {} : data;
        //         http.doAjaxInJquery({
        //             type: "get",
        //             url: url,
        //             data: data,
        //             contentType: "application/json",
        //             dataType: "json",
        //             successCallback: (d) => {
        //                 if (d.success == undefined || d.message == undefined) {
        //                     reject("unexpected json:" + d);
        //                     return;
        //                 }
        //                 if (d.success == "true") {
        //                     if (d.hasOwnProperty("project") && d.hasOwnProperty("jwt")) {
        //                         localStorage[d.project + "-jwt"] = d.jwt;
        //                     }
        //                     resolve(d.message);
        //                 } else {
        //                     if (d.message == "unauthorized") {
        //                         window.location.href = "../login/";
        //                         return;
        //                     }
        //                     reject(d.message);
        //                 }
        //             },
        //             failureCallback: (d) => {
        //                 reject("http request error:" + d);
        //             }
        //         });
        //     });
        //     return promise;
        // }

    }]);

    return http;
}();

exports.default = http;
