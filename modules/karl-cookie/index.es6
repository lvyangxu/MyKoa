import "karl-extend";

class cookie{

    /**
     * 获取cookie的值，并以base64解码
     * @param cookieName
     * @returns {string}
     */
    static get(cookieName) {
        let cookieValue = "";
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(cookieName + "=");
            if (c_start != -1) {
                c_start = c_start + cookieName.length + 1;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                cookieValue = document.cookie.substring(c_start, c_end);
                cookieValue = cookieValue.urlBase64Decode();
            }
        }
        return cookieValue;
    }

    /**
     * 设置cookie的值并以base64编码
     * @param cookieName
     * @param cookieValue
     * @param expiredays default 30 days
     */
    static set(cookieName, cookieValue, expiredays) {
        let exdate = new Date();
        expiredays = expiredays || 30;
        exdate.setDate(exdate.getDate() + expiredays);
        let exdateStr = (expiredays == null) ? "" : ";expires=" + exdate.toGMTString();
        cookieValue = cookieValue.base64UrlEncode();
        document.cookie = cookieName + "=" + cookieValue + exdateStr+";path=/";
    }

}

module.exports = cookie;