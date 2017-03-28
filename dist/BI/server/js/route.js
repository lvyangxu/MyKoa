let router = require('koa-router')();

/**
 * 默认地址为登录页面
 */
router.get("/", function (ctx, next) {
    ctx.redirect("/login/");
});

router.get(/^[a-zA-Z]+$/, function (ctx, next) {
    console.log(2);
    ctx.redirect(`/${view}/`);
});

router.post("/account/getItemName", function (ctx, next) {
    ctx.body = {};
});


module.exports = router;