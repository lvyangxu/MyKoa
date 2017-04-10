let router = require('koa-router')();
let table = require("./table");
let response = require("./response");
let tableConfig = require("./tableConfig");

/**
 * 默认地址为登录页面
 */
router.get("/", (ctx, next) => {
    ctx.redirect("/login/");
});

/**
 * 表格路由
 */
router.get("/table/:id/:action", (ctx, next) => {
    let action = ctx.params.action;
    let id = ctx.params.id;
    if (!table(ctx).hasOwnProperty(action)) {
        console.log("unknown action:table/" + id + "/" + action);
        response.fail(ctx, "unknown action");
    } else {
        //根据表格id获得表格配置
        if (!tableConfig(ctx).hasOwnProperty(id)) {
            response.fail(res, "unknown table " + name);
            return;
        }

        //执行表格对应的action
        let config = tableConfig(ctx)[id];
        table(ctx, config)[action]();
    }
});

module.exports = router;