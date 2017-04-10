module.exports = {
    success: (ctx, message = "") => {
        ctx.body = {success: true, message: message};
    },
    fail: (ctx, message = "") => {
        ctx.body = {success: false, message: message};
    },
    /**
     * 客户端参数不正确
     * @param ctx
     */
    fail400: ctx => {
        ctx.res.statusCode = 400;
    },
    /**
     * 当前请求需要用户验证
     * @param ctx
     */
    fail401: ctx => {
        ctx.res.statusCode = 401;
    }
};