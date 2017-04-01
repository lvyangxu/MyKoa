let xml = require("karl-xml");
let jwt = require("karl-jwt");

let load = async () => {
    try {
        //set global account
        let config = await xml.read("./server/config/account.xml");
        config = config.root;
        global.accountConfig = {
            project: config.project[0],
            username: config.username[0],
            password: config.password[0],
            loginRedirect: config.loginRedirect[0]
        };

        //set global jwt
        global.jwt = new jwt({
            secret: "jwt-" + global.accountConfig.project
        });
    } catch (e) {
        console.log("init account failed:" + e.message);
        global.log.error.info("init account failed:" + e.message);
    }
};

load();

module.exports = "";