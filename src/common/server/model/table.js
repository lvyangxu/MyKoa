let response = require("./response");
let fs = require("fs");
let excel = require("karl-excel");

module.exports = {
    init: async(req, res, config) => {

        //设置最终要返回的数据
        let data = {
            curd: config.curd
        };

        //设置额外的筛选条件
        if (config.hasOwnProperty("extraFilter")) {
            data.extraFilter = config.extraFilter;
        }

        //是否在初始化时自动读取一次数据
        if (config.hasOwnProperty("autoRead")) {
            data.autoRead = config.autoRead;
        }

        //是否隐藏值为空的列
        if (config.hasOwnProperty("isMinColumn")) {
            data.isMinColumn = config.isMinColumn;
        }

        //每一页显示的行数和图表
        ["rowPerPage", "chart"].forEach(d=> {
            if (config.hasOwnProperty(d)) {
                data[d] = config[d];
            }
        });

        //根据所属的database获取对应的mysql对象或mongodb的db对象
        let database, pool, db;
        if (!config.hasOwnProperty("type") || config.type == "mysql") {
            if (config.hasOwnProperty("database")) {
                database = config.database;
                pool = global.mysqlObject.find(d => {
                    return d.database == database;
                }).pool;
            } else {
                database = global.mysqlObject[0].database;
                pool = global.mysqlObject[0].pool;
            }
        } else {
            database = config.database;
            db = global.mongodbObject.find(d => {
                return d.database == database;
            }).db;
        }

        //将初始化的值附加到data属性中
        let attachData = async(sourceData)=> {
            let mapData = [];
            for (let i = 0; i < sourceData.length; i++) {
                let d = sourceData[i];
                let componentData = [];
                if (d.hasOwnProperty("data")) {
                    if (typeof(d.data) == "function") {
                        if (!config.hasOwnProperty("type") || config.type == "mysql") {
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
                                componentData = componentData.map((d1, j)=> {
                                    return {id: j, name: d1[id], checked: false};
                                });
                                break;
                            case "radio":
                                componentData = componentData.map(d1=> {
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
            data.extraFilter = data.extraFilter.map(d=> {
                let findElement = config.extraFilter.find(d1=> {
                    return d.id == d1.id;
                });
                if (findElement.hasOwnProperty("required")) {
                    d.required = findElement.required;
                }
                return d;
            })

        }
        response.success(res, data);
    },
    create: (req, res, config) => {
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

        //add every row by param requestRowsLength
        let rowArr = [];
        for (let i = 0; i < req.body.requestRowsLength; i++) {
            let row = "(";
            row += noIdFields.filter(d => {
                //filter default undefined value
                let id = d.Field;
                if (config.hasOwnProperty("create") && config.create.hasOwnProperty(id) && config.create[id] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }).map(d => {
                let id = d.Field;
                let type = d.Type;
                let value;
                if (config.hasOwnProperty("create") && config.create.hasOwnProperty(id)) {
                    //if default value exist and default value has property id
                    value = config.create[id];
                } else {
                    //if default value do not exist
                    value = req.body[id][i];
                    if (!type.includes("int") && type != "float" && type != "double") {
                        value = "'" + value + "'";
                    }
                }
                return value;
            }).join(",");
            row += ")";
            rowArr.push(row);
        }

        //build sqlCommand
        let columnIdSqlStr = noIdFields.map(d => {
            return d.Field;
        }).filter(d => {
            //if default value exist and is undefined,then exclude it
            if (config.hasOwnProperty("create") && config.create.hasOwnProperty(d) && config.create[d] == undefined) {
                return false;
            } else {
                return true;
            }
        }).join(",");
        columnIdSqlStr = `(${columnIdSqlStr})`;
        let valuesSqlStr = rowArr.join(",");

        //do mysql excute
        let sqlCommand = `insert into ${table} ${columnIdSqlStr} values ${valuesSqlStr}`;
        global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand
        }).then(d => {
            global.log.table.info(`create done:${database},${sqlCommand}`);
            response.success(res);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(database + "," + sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
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
    read: async(req, res, config) => {
        let table = config.id;
        //执行查询前的参数检查
        if (config.hasOwnProperty("readCheck")) {
            if (!config.readCheck()) {
                response.fail(res, "invalid param");
                return;
            }
        }

        //根据数据库类型进行查询
        let database, data;
        if (!config.hasOwnProperty("type") || config.type == "mysql") {
            //mysql
            let pool;
            if (config.hasOwnProperty("database")) {
                database = config.database;
                pool = global.mysqlObject.find(d => {
                    return d.database == database;
                }).pool;
            } else {
                database = global.mysqlObject[0].database;
                pool = global.mysqlObject[0].pool;
            }

            let sqlCommand = config.hasOwnProperty("read") ?
                (typeof(config.read) == "function" ? config.read() : config.read) : `select * from ${table}`;
            let values = config.hasOwnProperty("readValue") ? config.readValue : {};
            try {
                data = await global.mysql.excuteQuery({
                    pool: pool,
                    sqlCommand: sqlCommand,
                    values: values
                });
                global.log.table.info(`read done:${database},${sqlCommand}`);
                global.log.table.info(values);
            } catch (e) {
                global.log.error.info("mysql excuteQuery error:" + e);
                global.log.error.info(database + "," + sqlCommand);
                global.log.error.info(values);
                response.fail(res, "mysql excuteQuery error");
                return;
            }
        } else {
            //mongodb
            let db;
            if (config.hasOwnProperty("database")) {
                database = config.database;
                db = global.mongodbObject.find(d => {
                    return d.database == database;
                }).db;
            } else {
                database = global.mongodbObject[0].database;
                db = global.mongodbObject[0].db;
            }
            let collection = typeof(config.collection) == "function" ? config.collection() : config.collection;
            let jsonFilter = config.hasOwnProperty("read") ? (typeof(config.read) == "function" ? config.read() : config.read) : {};
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
                response.fail(res, "mongodb excuteQuery error");
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
            data.forEach(d=> {
                for (let key in d) {
                    if (!columnArr.includes(key)) {
                        columnArr.push(key);
                    }
                }
            });
            columnArr = columnArr.filter(d=> {
                //排除掉所有为空的列
                let isAllEmpty = data.every(d1=> {
                    return !d1.hasOwnProperty(d) || d1[d] == "";
                });
                return !isAllEmpty;
            }).map(d=> {
                let findColumn = config.dynamicColumn.find(d1=> {
                    return d1.id == d;
                });
                let name = findColumn == undefined ? d : findColumn.name;
                let checked = findColumn == undefined ? true : findColumn.checked;
                let json = {id: d, name: name, checked: checked};
                if (findColumn != undefined) {
                    ["thStyle", "tdStyle"].forEach(d1=> {
                        if (findColumn.hasOwnProperty(d1)) {
                            json[d1] = findColumn[d1];
                        }
                    })
                }
                return json;
            });
            //去除_id列
            columnArr = columnArr.filter(d=> {
                return d.id != "_id";
            });
            message.columns = columnArr;
        }
        res.send({success: "true", message: message});

    },
    delete: (req, res, config) => {
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

        let idStr = req.body.id.join(",");
        let sqlCommand = `delete from ${table} where id in (${idStr})`;
        global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand
        }).then(d => {
            global.log.table.info(`delete done:${database},${sqlCommand}`);
            response.success(res, d);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(database + "," + sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    download: (req, res, config)=> {
        let name = config.hasOwnProperty("name") ? config.name : config.id;
        let prefix = "client/";
        let filePath = "data/" + name + ".xlsx";
        excel.write(prefix + filePath, [{
            sheetName: name,
            data: req.body.data
        }]);
        response.success(res, {filePath: filePath});
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
};