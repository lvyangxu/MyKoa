let xml = require("karl-xml");
let fs = require("fs");
let mysql = require("./mysql");

let load = async()=> {
    try {
        //如果不存在mysql.xml,则跳过mysql初始化
        let path = "./server/config/mysql.xml";
        if (fs.existsSync(path)) {
            //init mysql
            let config = await xml.read(path);
            config = config.root;

            global.mysqlObject = [];
            for (let i = 0; i < config.user.length; i++) {
                let pool = mysql.init(config.host[i], config.user[i], config.password[i], config.database[i]);
                global.mysqlObject.push({database: config.database[i], pool: pool});
            }

            console.log("mysql init success");
            global.log.server.info("mysql init success");

            global.dbStruct = [];
            for (let i = 0; i < global.mysqlObject.length; i++) {
                //get all table names
                let {database, pool} = global.mysqlObject[i];
                let showTables = await mysql.excuteQuery({
                    pool: pool,
                    sqlCommand: "show tables"
                });
                let tableNames = showTables.map(d => {
                    let tableName;
                    for (let k in d) {
                        tableName = d[k];
                        break;
                    }
                    return tableName;
                });

                //set global table struct
                for (let i = 0; i < tableNames.length; i++) {
                    let table = tableNames[i];
                    let fields = await mysql.excuteQuery({
                        pool: pool,
                        sqlCommand: "desc " + table
                    });
                    global.dbStruct.push({
                        database: database,
                        table: table,
                        fields: fields
                    });
                }
            }
            console.log("get mysql database structure successfully");
            global.log.server.info("get mysql database structure successfully");
        } else {
            console.log("there is no need to init mysql");
            global.log.server.info("there is no need to init mysql");
        }
    } catch (e) {
        console.log("init mysql failed:" + e.message);
        global.log.error.info("init mysql failed:" + e.message);
    }
};

load();

module.exports = "";