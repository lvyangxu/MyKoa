module.exports = {
    success: (ctx, message = "") => {
        ctx.body = {success: true, message: message};
    },
    fail: (ctx, message = "") => {
        ctx.body = {success: false, message: message};
    }
};