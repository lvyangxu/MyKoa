let router = require("koa-router")();
let response = require("./response");

/**
 * 验证兑换码
 */
router.post("/rewardCode/check", async (ctx, next) => {
    //查询数据库

    //查询兑换码所属类型

    //更新数据库，如果版本号字段不一致则表示该兑换码已使用


});

/**
 * 生成兑换码
 */
router.post("/rewardCode/add", async (ctx, next) => {
    //更新数据库

    //返回excel下载

});

/**
 *
 */

module.exports = router;