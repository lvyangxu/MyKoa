let router = require("koa-router")();
let response = require("./response");
require("babel-polyfill");
let http = require("karl-http");

/**
 * 初始化工程名称（前端存放localstorage）及登录后跳转路径
 */
router.post("/Authorize/init", async (ctx, next) => {
    response.success(ctx, {
        project: global.accountConfig.project,
        loginRedirect: global.accountConfig.loginRedirect
    });
});

/**
 * 登录操作，账号密码验证，成功返回jwt及project
 */
router.post("/Authorize/login", async (ctx, next) => {


    let findMongo = global.mongodbObject.find(d => {
        return d.database === "Authorize"
    })
    if (findMongo === undefined) {
        response.fail(ctx, "无法连接到数据库")
        return
    }
    let {db} = findMongo
    let {username, password} = ctx.request.body
    let data = await global.mongodb.excuteQuery(db, "data", {
        jsonFilter: {
            username: username,
            password: password
        }
    })
    if (data.length === 0) {
        response.fail(ctx, "帐号名或密码不正确")
    } else {
        let currentTimestamp = new Date().getTime()
        //设置有效期为1天
        let validTime = 24 * 60 * 60 * 1000;
        let expireTimestamp = currentTimestamp + validTime;
        let header = {alg: "aes192", typ: "JWT", exp: expireTimestamp};
        let payload = {user: username, exp: expireTimestamp};
        let signature = global.jwt.encrypt(header + "." + payload);
        let token = global.jwt.encryptJWT(header, payload, signature);
        response.success(ctx, {
            project: "AvalonGame",
            jwt: token
        });
    }

});

module.exports = router;