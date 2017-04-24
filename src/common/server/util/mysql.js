let mysqljs = require('mysql');
let mysql = {
    init: (host, user, password, database) => {
        let pool = mysqljs.createPool({
            connectionLimit: 10,
            host: host,
            user: user,
            password: password,
            database: database,
            dateStrings: true
        });
        global.mysql = mysql;
        return pool;
    },
    excuteQuery: (json) => {
        let {pool = global.mysqlObject[0].pool, sqlCommand, values = {}} = json;
        return new Promise((resolve, reject) => {
            pool.query(sqlCommand, values, function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        rows: rows,
                        sqlCommand: sqlCommand,
                        values: values,
                        fields: fields
                    });
                }
            });
        })
    }
};

module.exports = mysql;