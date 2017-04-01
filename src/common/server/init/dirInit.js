//upload dir
let fs = require("fs");
if (!fs.existsSync("./server/upload/")) {
    fs.mkdirSync("./server/upload/");
}

//client data
if (!fs.existsSync("./client/data/")) {
    if (fs.existsSync("./client")) {
        fs.mkdirSync("./client/data/");
    }
}

//log
if (!fs.existsSync("./server/log/")) {
    fs.mkdirSync("./server/log/");
}

module.exports = "";