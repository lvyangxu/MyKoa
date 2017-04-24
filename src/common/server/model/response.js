module.exports = {
    success: (ctx, message = "") => {
        ctx.body = {success: true, message: message};
    },
    fail: (ctx, message = "") => {
        ctx.body = {success: false, message: message};
    },
    //客户端参数不正确
    fail400: (ctx, message = "") => {
        ctx.body = {success: false, message: message};
        ctx.res.statusCode = 400;
    },
    //当前请求需要用户验证
    fail401: (ctx, message = "") => {
        ctx.body = {success: false, message: message};
        ctx.res.statusCode = 401;
    },
    fail500: (ctx, message) => {
        ctx.body = {success: false, message: message};
        ctx.res.statusCode = 500;
    }
};