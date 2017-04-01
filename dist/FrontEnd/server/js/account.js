let response = require("./response");

module.exports = {
    getItemName: (req, res) => {
        response.success(res, {
            project: global.accountConfig.project,
            loginRedirect: global.accountConfig.loginRedirect
        });
    },
    login: (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        if (username == global.accountConfig.username && password == global.accountConfig.password) {

            let currentTimestamp = new Date().getTime();
            //设置有效期为1天
            let validTime = 24 * 60 * 60 * 1000;
            let expireTimestamp = currentTimestamp + validTime;
            let header = {alg: "aes192", typ: "JWT", exp: expireTimestamp};
            let payload = {user: username, exp: expireTimestamp};
            let signature = global.jwt.encrypt(header + "." + payload);
            let token = global.jwt.encryptJWT(header, payload, signature);
            response.success(res, {
                project: global.accountConfig.project,
                jwt: token
            });
        } else {
            response.fail(res, "invalid username or password");
        }
    },
    logout: () => {

    }
};