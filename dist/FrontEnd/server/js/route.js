let router = require("koa-router")();
let response = require("./response");

/**
 * 初始化工程名称（前端存放localstorage）及登录后跳转路径
 */
router.post("/authorize/init", async (ctx, next) => {
    response.success(ctx, {
        project: global.accountConfig.project,
        loginRedirect: global.accountConfig.loginRedirect
    });
});

/**
 * 初始页面跳转到登录
 */
router.get("/", async (ctx, next) => {
    await ctx.redirect("/login/");
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

/**
 * 对其他api的访问请求
 */
router.post("/api/:id", async (ctx, next) => {
    //检查api请求权限，是否需要验证jwt

    //转发到其他服务
});

module.exports = router;