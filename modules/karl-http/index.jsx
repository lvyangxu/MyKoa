import $ from "jquery"

export default class http {
    /**
     * 用jquery的ajax方法执行http请求
     * @param param ajax option
     * @returns {*|void}
     */
    static doAjaxInJquery(param) {
        let request = $.ajax({
            type: param.type || "post",
            url: param.url,
            cache: false,
            timeout: (param.requestTimeOutSecond || 30) * 1000,
            data: (param.contentType === "application/json") ? JSON.stringify(param.data) : param.data,
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
    };

    /**
     * 执行http post请求，contentType和dataType均为json
     * @param url
     * @param data
     * @returns {Promise}
     */
    static post(url, data = {}) {
        let promise = new Promise((resolve, reject) => {
            http.doAjaxInJquery({
                url: url,
                data: data,
                contentType: "application/json",
                dataType: "json",
                successCallback: ({data, textStatus, jqXHR}) => {
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
                failureCallback: ({jqXHR, textStatus, errorThrown}) => {
                    if (jqXHR.status === 401) {
                        window.location.href = "../login/";
                        return
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
}