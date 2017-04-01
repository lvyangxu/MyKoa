"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = new _xml2js2.default.Parser();
var builder = new _xml2js2.default.Builder();
module.exports = {
    /**
     * 异步读取xml
     * @param path
     * @returns {Promise}
     */
    read: function read(path) {
        return new Promise(function (resolve, reject) {
            _fs2.default.readFile(path, function (err, data) {
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
    write: function write(json, path) {
        var xml = builder.buildObject(json);
        var arr = path.split("/");
        for (var end = 1; end < arr.length; end++) {
            var parentFolder = arr.slice(0, end).join("/");
            if (!_fs2.default.existsSync(parentFolder)) {
                _fs2.default.mkdirSync(parentFolder);
            }
        }
        _fs2.default.writeFileSync(path, xml);
    }
};
