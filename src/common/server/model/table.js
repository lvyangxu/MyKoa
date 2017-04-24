let response = require("./response");
let fs = require("fs");

let getMysqlPool = config => {
    let pool, database
    if (config.hasOwnProperty("database")) {
        database = config.database
        pool = global.mysqlObject.find(d => {
            return d.database === config.database
        }).pool
    } else {
        database = global.mysqlObject[0].database
        pool = global.mysqlObject[0].pool
    }
    return {pool: pool, database: database}
}

let getMongoDb = config => {
    let db, database
    if (config.hasOwnProperty("database")) {
        database = config.database
        db = global.mongodbObject.find(d => {
            return d.database === config.database
        }).db
    } else {
        database = global.mongodbObject[0].database
        db = global.mongodbObject[0].db
    }
    return {db: db, database: database}
}

let getPoolAndDb = config => {
    if (!config.hasOwnProperty("type") || config.type === "mysql") {
        let {pool, database} = getMysqlPool(config)
        return {pool: pool, database: database}
    } else {
        let {db, database} = getMongoDb(config)
        return {db: db, database: database}
    }
}

let getTable = (config, routeTable) => {
    let table = config.hasOwnProperty("table") ? config.table : routeTable
    if (typeof(table) === "function") {
        table = table()
    }
    table = table.toLowerCase()
    return table
}

//检查totalParam参数是否匹配正则
let isValidTotalParam = (ctx, config) => {
    let isValid = true
    let totalParam = ctx.request.body[config.totalParam.id]
    if (config.hasOwnProperty("totalParam")) {
        if (totalParam === undefined) {
            isValid = false
            return isValid
        }
        let regex = config.totalParam.regex
        if (!regex.test(totalParam)) {
            isValid = false
        }
    }
    return isValid
}

module.exports = (ctx, config) => ({
    init: () => {
        let promise = new Promise(async (resolve, reject) => {

            let isValid = isValidTotalParam(ctx, config)
            if (!isValid) {
                resolve({statusCode: 400})
                return
            }

            //设置最终要返回的数据
            let data = {
                curd: config.curd
            }

            //名称
            //设置额外的筛选条件
            //是否在初始化时自动读取一次数据
            //table是否100%宽度显示
            //创建按钮文本
            //创建按钮跳转的url
            //是否隐藏值为空的列
            //每一页显示的行数和图表
            let sourcePropsArr = ["name", "extraFilter", "autoRead", "is100TableWidth", "createText", "createUrl", "isMinColumn", "rowPerPage", "chart"];
            sourcePropsArr.forEach(d => {
                if (config.hasOwnProperty(d)) {
                    data[d] = config[d];
                }
            });

            let {pool, db, database} = getPoolAndDb(config)

            //将初始化的值附加到data属性中
            let attachData = async (sourceData) => {
                let mapData = [];
                for (let i = 0; i < sourceData.length; i++) {
                    let d = sourceData[i];
                    let componentData = [];
                    if (d.hasOwnProperty("data")) {
                        if (typeof(d.data) === "function") {
                            if (!config.hasOwnProperty("type") || config.type === "mysql") {
                                try {
                                    componentData = await d.data(pool);
                                    if (d.hasOwnProperty("dataMap")) {
                                        componentData = d.dataMap(componentData);
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            } else {
                                try {
                                    componentData = await d.data(db);
                                    if (d.hasOwnProperty("dataMap")) {
                                        componentData = d.dataMap(componentData);
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            let id = d.id;
                            switch (d.type) {
                                case "select":
                                    componentData = componentData.map((d1, j) => {
                                        return {id: j, name: d1[id], checked: false};
                                    });
                                    break;
                                case "radio":
                                    componentData = componentData.map(d1 => {
                                        return d1[id];
                                    })
                                    break;
                            }
                            d.data = componentData;
                        }
                    }
                    mapData.push(d);
                }
                return mapData;
            };

            data.columns = await attachData(config.columns);
            if (config.hasOwnProperty("extraFilter")) {
                data.extraFilter = await attachData(config.extraFilter);
                //附加其他属性
                data.extraFilter = data.extraFilter.map(d => {
                    let findElement = config.extraFilter.find(d1 => {
                        return d.id === d1.id;
                    });
                    if (findElement.hasOwnProperty("required")) {
                        d.required = findElement.required;
                    }
                    return d;
                })

            }
            resolve({
                statusCode: 200,
                message: data
            })
        })
        return promise
    },
    create: routeTable => {
        let promise = new Promise(async (resolve, reject) => {

            let isValid = isValidTotalParam(ctx, config)
            if (!isValid) {
                resolve({statusCode: 400})
                return
            }

            //执行查询前的参数检查
            if (config.hasOwnProperty("createCheck")) {
                if (!config.createCheck()) {
                    resolve({statusCode: 400})
                    return
                }
            }

            let {pool, db, database} = getPoolAndDb(config)

            //找到该table的表结构
            let table = getTable(config, routeTable)
            let tableStruct = global.dbStruct.find(d => {
                return d.table === table && d.database === database;
            });
            if (tableStruct === undefined) {
                reject({
                    statusCode: 500,
                    message: "unknown table"
                })
                return
            }

            //columns exclude id
            let noIdFields = tableStruct.fields.filter(d => {
                return d.Field !== "id";
            });

            let createConfig = typeof(config.create) === "function" ? config.create() : config.create
            let columnIdSqlStr = noIdFields.map(d => {
                return d.Field;
            }).join(",");

            if (ctx.request.body.data.length === 0) {
                resolve({
                    statusCode: 400
                })
            }

            let sqlCommand = `insert into ${table} (${columnIdSqlStr}) values ` + ctx.request.body.data.map(d => {
                    let row = `(`
                    row += noIdFields.map(d1 => {
                        let {Field: id, Type: type} = d1
                        let value
                        if (createConfig.hasOwnProperty(id)) {
                            value = createConfig[id]
                        } else if (d.hasOwnProperty(id)) {
                            value = d[id]
                            if (!type.includes("int") && type !== "float" && type !== "double") {
                                value = "'" + value + "'";
                            }
                        } else {
                            value = ""
                        }
                        return value
                    }).join(",")
                    row += `)`
                    return row
                }).join(",")

            try {
                //do mysql excute
                let {rows} = await global.mysql.excuteQuery({
                    pool: pool,
                    sqlCommand: sqlCommand
                })
                global.log.table.info(`create done:${database},${sqlCommand}`);
                if (config.hasOwnProperty("createCallback")) {
                    try {
                        await config.createCallback({pool: pool, rows: rows})
                    } catch (e1) {
                        global.log.error.info("create callback error:");
                        global.log.error.info(e1);
                        reject({statusCode: 500})
                    }
                }
                resolve({statusCode: 200})
            } catch (e) {
                global.log.error.info("mysql excuteQuery error:");
                global.log.error.info(database + "," + sqlCommand);
                resolve({
                    statusCode: 500,
                    message: "mysql excuteQuery error"
                })
            }
        })
        return promise
    },
    update: (req, res, config) => {
        //find table struct
        let table = config.id;
        let database, pool;
        if (config.hasOwnProperty("database")) {
            database = config.database;
            pool = global.mysqlObject.find(d => {
                return d.database == database;
            }).pool;
        } else {
            database = global.mysqlObject[0].database;
            pool = global.mysqlObject[0].pool;
        }

        let tableStruct = global.dbStruct.find(d => {
            return d.table == table && d.database == database;
        });
        if (tableStruct == undefined) {
            response.fail(res, "unknown table");
            return;
        }

        //columns exclude id
        let noIdFields = tableStruct.fields.filter(d => {
            return d.Field != "id";
        });

        let promiseArr = [];
        let sqlCommandArr = [];
        let valuesArr = [];
        for (let i = 0; i < req.body.requestRowsLength; i++) {
            let defaultValueStrArr = [];
            let values = {};
            noIdFields.filter(d => {
                //filter default undefined value
                let id = d.Field;
                if (config.hasOwnProperty("update") && config.update.hasOwnProperty(id) && config.update[id] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }).forEach(d => {
                let id = d.Field;
                if (config.hasOwnProperty("update") && config.update.hasOwnProperty(id)) {
                    //if default value exist and default value has property id
                    defaultValueStrArr.push(id + "=" + config.update[id]);
                } else {
                    //if default value do not exist
                    values[id] = req.body[id][i];
                }
            });
            let defaultValueStr = defaultValueStrArr.join(",");
            if (defaultValueStr != "") {
                let n = 0;
                for (let k in values) {
                    n++;
                }
                if (n != 0) {
                    defaultValueStr += ",";
                }
            }

            let sqlCommand = `update ${config.id} set ${defaultValueStr} ? where id=${req.body.id[i]}`;
            promiseArr.push(global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: sqlCommand,
                values: values
            }));
            sqlCommandArr.push(sqlCommand);
            valuesArr.push(values);
        }

        Promise.all(promiseArr).then(d => {
            global.log.table.info("update done:");
            for (let i = 0; i < sqlCommandArr.length; i++) {
                global.log.table.info(`update ${i} ${database} ${sqlCommandArr[i]}`);
                global.log.table.info(valuesArr[i]);
            }
            response.success(res);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            for (let i = 0; i < sqlCommandArr.length; i++) {
                global.log.error.info(`update ${i} ${database} ${sqlCommandArr[i]}`);
                global.log.error.info(valuesArr[i]);
            }
            response.fail(res, "mysql excuteQuery error");
        });
    },
    read: routeTable => {
        let promise = new Promise(async (resolve, reject) => {

            let isValid = isValidTotalParam(ctx, config)
            if (!isValid) {
                resolve({statusCode: 400})
                return
            }

            //autoRead时不带服务器控件
            let isWithoutServerFilter = ctx.request.body.autoRead === true && config.autoReadWithoutServerFilter === true

            if (isWithoutServerFilter) {
                //执行查询前的参数检查
                if (config.hasOwnProperty("readCheck")) {
                    if (!config.readCheck()) {
                        resolve({statusCode: 400})
                        return;
                    }
                }
            }

            let {pool, db, database} = getPoolAndDb(config)

            //根据数据库类型进行查询
            let table = getTable(config, routeTable)
            let data
            let {type = "mysql"} = config;
            if (type === "mysql") {
                let sqlCommand = config.hasOwnProperty("read") ?
                    (typeof(config.read) === "function" ? config.read() : config.read) : `select * from ${table}`;
                let {readValue: values = {}} = config;
                try {
                    let {rows} = await global.mysql.excuteQuery({
                        pool: pool,
                        sqlCommand: sqlCommand,
                        values: values
                    });
                    data = rows
                    global.log.table.info(`read done:${database},${sqlCommand}`);
                    global.log.table.info(values);
                } catch (e) {
                    global.log.error.info("mysql excuteQuery error:" + e);
                    global.log.error.info(database + "," + sqlCommand);
                    global.log.error.info(values);
                    resolve({statusCode: 500, message: "mysql excuteQuery error"})
                    return;
                }
            } else {
                //mongodb
                let collection = typeof(config.collection) === "function" ? config.collection() : config.collection;
                let jsonFilter = config.hasOwnProperty("read") ? (typeof(config.read) === "function" ? config.read() : config.read) : {};
                let queryJson = {jsonFilter: jsonFilter};
                try {
                    if (config.hasOwnProperty("limitNum")) {
                        queryJson.limitNum = config.limitNum;
                    }
                    if (config.hasOwnProperty("sort")) {
                        queryJson.sort = config.sort;
                    }
                    data = await global.mongodb.excuteQuery(db, collection, queryJson);
                    global.log.table.info(`read done:${database}`);
                    global.log.table.info(jsonFilter);
                } catch (e) {
                    global.log.error.info("mongodb excuteQuery error:" + e);
                    global.log.error.info(database);
                    global.log.error.info(jsonFilter);
                    resolve({statusCode: 500, message: "mongodb excuteQuery error"})
                    return;
                }
            }
            if (config.hasOwnProperty("readMap")) {
                data = config.readMap(data);
            }
            let message = {data: data};
            //如果是动态列，则同时返回本次的columns
            if (config.hasOwnProperty("dynamicColumn")) {
                let columnArr = [];
                data.forEach(d => {
                    for (let key in d) {
                        if (!columnArr.includes(key)) {
                            columnArr.push(key);
                        }
                    }
                });
                columnArr = columnArr.filter(d => {
                    //排除掉所有为空的列
                    let isAllEmpty = data.every(d1 => {
                        return !d1.hasOwnProperty(d) || d1[d] === "";
                    });
                    return !isAllEmpty;
                }).map(d => {
                    let findColumn = config.dynamicColumn.find(d1 => {
                        return d1.id === d;
                    });
                    let name = findColumn === undefined ? d : findColumn.name;
                    let checked = findColumn === undefined ? true : findColumn.checked;
                    let json = {id: d, name: name, checked: checked};
                    if (findColumn !== undefined) {
                        ["thStyle", "tdStyle"].forEach(d1 => {
                            if (findColumn.hasOwnProperty(d1)) {
                                json[d1] = findColumn[d1];
                            }
                        })
                    }
                    return json;
                });
                //去除_id列
                columnArr = columnArr.filter(d => {
                    return d.id !== "_id";
                });
                message.columns = columnArr;
            }
            resolve({statusCode: 200, message: message})
        })
        return promise
    },
    delete: routeTable => {

        let promise = new Promise(async (resolve, reject) => {
            let isValid = isValidTotalParam(ctx, config)
            if (!isValid) {
                resolve({statusCode: 400})
                return
            }

            //检查是否有id参数并数组
            let {id} = ctx.request.body
            let hasParam = id !== undefined && Array.isArray(id)
            let isValidParam = id.every(d => {
                let regex = /\d+/g
                return regex.test(d)
            })
            let table = getTable(config, routeTable)
            let {pool, db, database} = getPoolAndDb(config)

            if (!(hasParam && isValidParam)) {
                resolve({statusCode: 400})
            }
            let idStr = id.join(",")
            let sqlCommand = `delete from ${table} where id in (${idStr})`;
            try {
                await global.mysql.excuteQuery({
                    pool: pool,
                    sqlCommand: sqlCommand
                })
                global.log.table.info(`delete done:${database},${sqlCommand}`);
                resolve({statusCode: 200})
            } catch (e) {
                global.log.error.info("mysql excuteQuery error:")
                global.log.error.info(e)
                global.log.error.info(database + "," + sqlCommand)
                reject({statusCode: 500, message: "mysql excuteQuery error"})
            }

        })
        return promise
    },
    download: (req, res, config) => {

    },
    attachmentRead: (req, res, config) => {
        let table = config.id;
        let path = `./client/data/${table}/${req.body.id}/`;
        if (fs.existsSync(path)) {
            let attachementList = fs.readdirSync(path);
            response.success(res, attachementList);
        } else {
            response.success(res, []);
        }
    },
    attachmentDelete: (req, res, config) => {
        let table = config.id;
        let path = `./client/data/${table}/${req.body.id}/`;
        let name = req.body.name;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path + name);
            response.success(res);
        } else {
            response.fail(res, "dir do not exist");
        }
    },
    attachmentUpload: (req, res, config) => {
        if (req.files.length == 0) {
            response.fail("no file upload");
            return;
        }
        let table = config.id;
        let sourcePath = "./server/upload/";
        let destPath = `./client/data/${table}/`;
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        destPath += req.query.id + "/";
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        req.files.forEach(d => {
            let filename = d.filename;
            fs.renameSync(sourcePath + filename, destPath + filename);
            global.log.upload.info("upload done:" + destPath + filename);
        });
        response.success(res);
    },
});