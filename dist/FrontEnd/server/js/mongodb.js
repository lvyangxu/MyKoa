let MongoClient = require('mongodb').MongoClient;

let mongodb = {
    init: async(host, port, database)=> {
        let url = `mongodb://${host}:${port}/${database}`;
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
        global.mongodb = mongodb;
        return promise;
    },
    insert: (db, collection, arrayDocs)=> {
        let c = db.collection(collection);
        let promise = new Promise((resolve, reject) => {
            c.insertMany(arrayDocs, function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                if (result.result.n != arrayDocs.length) {
                    reject("result.n is not equal arrayDocs.length");
                    return;
                }
                if (result.ops.length != arrayDocs.length) {
                    reject("ops.length is not equal arrayDocs.length");
                    return;
                }
                resolve(result);
            });
        });
        return promise;
    },
    excuteQuery: (db, collection, json)=> {
        let c = db.collection(collection);
        let promise = new Promise((resolve, reject) => {
            let jsonFilter = json.hasOwnProperty("jsonFilter") ? json.jsonFilter : {};
            let cursor = c.find(jsonFilter);
            if (json.hasOwnProperty("limitNum")) {
                cursor = cursor.limit(json.limitNum);
            }
            if (json.hasOwnProperty("sort")) {
                cursor = cursor.sort(json.sort);
            }
            cursor.toArray(function (err, docs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
        return promise;
    }
};

module.exports = mongodb;
