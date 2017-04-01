/**
 * 程序入口
 */

//加载koa框架
let Koa = require("koa");
let app = new Koa();

//初始化服务器
require("./init");

let bodyParser = require("koa-bodyparser");
app.use(bodyParser());

//加载静态路由
let serve = require("koa-static");
let path = require("path");

//静态目录
app.use(serve(path.join(__dirname, "../../client")));

//路由
let router = require("./route");
app.use(router.routes()).use(router.allowedMethods());

//404页面跳转
let _404 = require("./404");
app.use(_404);

//监听端口
app.listen(3000);