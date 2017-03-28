module.exports = async(ctx, next)=> {
    if (ctx.status == 404) {
        await ctx.redirect("/404/");
    } else {
        next();
    }
};