let router = require("koa-router")();
let response = require("./response");

/**
 * 验证兑换码
 */
router.post("/rewardCode/check", async (ctx, next) => {
    //查询数据库

    //查询兑换码所属类型

    //更新数据库，如果版本号字段不一致则表示该兑换码已使用
    response.success(ctx, "haha");

});

/**
 * 生成兑换码
 */
router.post("/rewardCode/add", async (ctx, next) => {
    //更新数据库

    //返回excel下载

});

/**
 * 表格路由
 */
router.get("/rewardCode/table", (ctx, next) => {
    let action = ctx.request.action;
    let id = ctx.request.id;
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