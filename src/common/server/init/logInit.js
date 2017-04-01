let log = require("./log");
let logNameArr = ["server", "mysql", "table", "business", "login", "error", "download", "upload"];
let loggerJson = log(logNameArr);
global.log = loggerJson;
module.exports = "";