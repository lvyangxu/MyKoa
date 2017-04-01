let xml = require("karl-xml");
let fs = require("fs");
let mongodb = require("./mongodb");

let load = async()=> {
    try {
        //如果不存在mysql.xml,则跳过mysql初始化
        let path = "./server/config/mongodb.xml";
        if (fs.existsSync(path)) {
            let config = await xml.read(path);
            config = config.root;
            global.mongodbObject = [];
            for (let i = 0; i < config.host.length; i++) {
                let db = await mongodb.init(config.host[i], config.port[i], config.database[i]);
                global.mongodbObject.push({database: config.database[i], db: db});
            }
            console.log("mongodb init success");
            global.log.server.info("mongodb init success");
        } else {
            console.log("there is no need to init mongodb");
            global.log.server.info("there is no need to init mongodb");
        }
    } catch (e) {
        console.log("init mongodb failed:" + e.message);
        global.log.error.info("init mongodb failed:" + e.message);
    }
};

load();

module.exports = "";