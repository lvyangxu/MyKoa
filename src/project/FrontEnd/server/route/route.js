let router = require("koa-router")();
let response = require("./response");

/**
 * 初始化工程名称（前端存放localstorage）及登录后跳转路径
 */
router.post("/authorize/init", function (ctx, next) {
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

router.post("/authorize/login", async (ctx, next) => {
    // ctx.res.statusCode = 401;

    let pool = global.mysqlObject.find(d => {
        return d.database === "Authorize";
    }).pool;

    let {username, password} = ctx.request.body;
    let sqlCommand = `select * from account where username="${username}" and password="${password}"`;
    let data = await global.mysql.excuteQuery({
        pool: pool,
        sqlCommand: sqlCommand
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


module.exports = router;