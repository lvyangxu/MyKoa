module.exports = async (ctx, next) => {
    if (ctx.status === 404 && ctx.req.method === "GET") {
        await ctx.redirect("/404/");
    } else {
        next();
    }
};