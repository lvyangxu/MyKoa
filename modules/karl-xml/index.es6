import fs from "fs";
import xml2js from "xml2js";

let parser = new xml2js.Parser();
let builder = new xml2js.Builder();
module.exports = {
    /**
     * 异步读取xml
     * @param path
     * @returns {Promise}
     */
    read: (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function (err, data) {
                if (err) {
                    reject("read xml error:" + err);
                    return;
                }
                parser.parseString(data, function (err1, result) {
                    if (err1) {
                        reject("parse xml error:" + err1);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    },
    /**
     * 同步写入json到xml
     * @param json
     * @param path
     */
    write: (json, path) => {
        let xml = builder.buildObject(json);
        let arr = path.split("/");
        for (let end = 1; end < arr.length; end++) {
            let parentFolder = arr.slice(0, end).join("/");
            if (!fs.existsSync(parentFolder)) {
                fs.mkdirSync(parentFolder);
            }
        }
        fs.writeFileSync(path, xml);
    }
};