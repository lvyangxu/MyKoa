let http = require("http");
let querystring = require('querystring');

module.exports = {
    get: params => {
        let {hostname = "localhost", port = 80, path, data = {}} = params;
        let postData = querystring.stringify(data);
        let options = {
            hostname: hostname,
            port: port,
            path: path
        };
        let promise = new Promise((resolve, reject) => {
            let req = http.get(options, res => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    try {
                        let jsonData = JSON.parse(chunk);
                        resolve(jsonData);
                    } catch (e) {
                        reject(chunk);
                    }
                });
            });

            req.on('error', e => {
                reject(e.message);
            });

            req.write(postData);
            req.end();
        });
        return promise;
    },
    post: params => {
        let {hostname = "localhost", port = 80, path, data = {}} = params;
        let postData = querystring.stringify(data);
        let options = {
            hostname: hostname,
            port: port,
            path: path,
            method: 'POST',
        };
        let promise = new Promise((resolve, reject) => {
            let req = http.request(options, res => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    try {
                        let jsonData = JSON.parse(chunk);
                        resolve(jsonData);
                    } catch (e) {
                        reject(chunk);
                    }
                });
            });

            req.on('error', e => {
                reject(e.message);
            });

            req.write(postData);
            req.end();
        });
        return promise;
    }
};