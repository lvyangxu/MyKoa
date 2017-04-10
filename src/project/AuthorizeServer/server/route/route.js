let router = require("koa-router")();
let response = require("./response");
let http = require("karl-http");

/**
 * 初始化工程名称（前端存放localstorage）及登录后跳转路径
 */
router.post("/authorize/init", async (ctx, next) => {
    response.success(ctx, {
        project: global.accountConfig.project,
        loginRedirect: global.accountConfig.loginRedirect
    });
});

router.post("/test", function (ctx, next) {
    ctx.body = {
        test: "testafsafasgasga1213"
    };
});

/**
 * 登录操作，账号密码验证，成功返回jwt及project
 */
router.post("/authorize/login", async (ctx, next) => {

    let db = global.mongodbObject.find(d => {
        return d.database === "FrontEnd";
    }).db;
    let {username, password} = ctx.request.body;
    let data = await global.mongodb.excuteQuery(db, "authorize", {
        jsonFilter: {
            username: username,
            password: password
        }
    });
    if (data.length === 0) {
        response.fail(ctx, "帐号名或密码不正确");
    } else {
        let currentTimestamp = new Date().getTime();
        //设置有效期为1天
        let validTime = 24 * 60 * 60 * 1000;
        let expireTimestamp = currentTimestamp + validTime;
        let header = {alg: "aes192", typ: "JWT", exp: expireTimestamp};
        let payload = {user: username, exp: expireTimestamp};
        let signature = global.jwt.encrypt(header + "." + payload);
        let token = global.jwt.encryptJWT(header, payload, signature);
        response.success(ctx, {
            project: global.accountConfig.project,
            jwt: token
        });
    }

});

let services = [
    {id: "rewardCode", port: 3002}
]

/**
 * 对其他api的访问请求
 */
router.post("/api/:services", async (ctx, next) => {
    //检查api请求权限，是否需要验证jwt

    let path = ctx.request.path;
    let findService = services.find(d => {
        return d.id === ctx.params.services;
    })
    if (findService === undefined) {
        response.fail400(ctx);
        return;
    }

    //转发到其他服务
    try {
        let data = await http.post({
            port: ctx.params.port,
            path: path
        });
        response.success(ctx, data.message);
    } catch (e) {
        response.fail(ctx, "fail to get service");
    }

});

module.exports = router;