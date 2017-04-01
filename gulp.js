//sass依赖于node-sass及windows-build-tools（需要以管理员全局安装）
//如果失败使用以下淘宝源安装
//set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/
//npm install node-sass

let gulp = require("gulp");
let del = require("del");
let replace = require("gulp-replace");
let htmlmin = require("gulp-htmlmin");
let hash_src = require("gulp-hash-src");
let exec = require("child_process").exec;
let sass = require("gulp-sass");
let concatCss = require("gulp-concat-css");
let cleanCSS = require("gulp-clean-css");
let fs = require("fs");
let path = require("path");
let webpack = require("webpack");
let webpackStream = require("webpack-stream");
let xml = require("karl-xml");

let project = process.argv[6].replace("--project=", "");

let config = {
    isProduction: false,
    isOnlyServer: {},
    mysql: {
        BI: {
            user: "root",
            password: "root",
            database: "BI"
        },
        FrontEnd: {
            user: "root",
            password: "root",
            database: "Authorize"
        }
    },
    mongodb: {},
    account: {
        BI: {
            username: "radiumme",
            password: "radiumme",
            loginRedirect: "manage"
        },
        FrontEnd: {
            loginRedirect: "manage"
        }
    },
    port: {
        FrontEnd: 3001
    }
};

let taskArr = config.isOnlyServer[project] === true ? ["move"] : ["move", "compile"];
gulp.task("build", taskArr, () => {
    console.log("gulp build done");
});

/**
 * 清理上次生成的文件
 */
gulp.task("clean-up", () => {
    let promise = new Promise((resolve, reject) => {
        exec("netstat -ano | findstr 3000", (error, stdout) => {
            if (error) {
                //端口没有使用
                del.sync([`dist/${project}`]);
                resolve();
            } else {
                //端口已占用
                console.log("端口已占用,强行终止进程");
                let regex = /LISTENING +\d+/;
                let arr = stdout.match(regex);
                if (arr === null) {
                    del.sync([`dist/${project}`]);
                    resolve();
                } else {
                    let pid = arr[0];
                    pid = pid.replace(/ /g, "").replace(/LISTENING/g, "");
                    exec(`taskkill /f /pid ${pid}`, () => {
                        del.sync([`dist/${project}`]);
                        resolve();
                    });
                }
            }
        });
    });
    return promise;
});

//移动文件
if (config.isOnlyServer[project] === true) {
    gulp.task("move", ["move-server", "move-project-server", "move-app", "move-project-app", "move-package", "build-mysql", "build-mongodb", "build-account"]);
} else {
    gulp.task("move", ["move-server", "move-project-server", "move-client", "move-common-html", "move-project-html", "move-icon", "move-app",
        "move-project-app", "move-package", "build-mysql", "build-mongodb", "build-account"]);
}

gulp.task("move-server", ["clean-up"], () => {
    let stream = gulp.src([
        `src/common/server/route/*`,
        `src/common/server/middleware/*`,
        `src/common/server/init/*`,
        `src/common/server/model/*`,
        `src/common/server/util/*`,
    ]).pipe(gulp.dest(`dist/${project}/server/js/`));
    return stream;
});
gulp.task("move-project-server", ["clean-up", "move-server"], () => {
    let stream = gulp.src([
        `src/project/${project}/server/route/*`,
        `src/project/${project}/server/middleware/*`,
        `src/project/${project}/server/init/*`,
        `src/project/${project}/server/model/*`,
    ])
        .pipe(gulp.dest(`dist/${project}/server/js`));
    return stream;
});
gulp.task("move-client", ["clean-up"], () => {
    let stream = gulp.src([
        `src/project/${project}/client/*/*`,
        "src/common/client/*/*",
        "!src/common/client/icon/*",
        `!src/project/${project}/client/*/*.html`,
        "!src/common/client/*/*.html"
    ])
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
gulp.task("move-common-html", ["clean-up"], () => {
    let stream = gulp.src("src/common/client/*/*.html")
    // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(hash_src({
            build_dir: `dist/${project}/client`,
            src_path: "src/common/client"
        }))
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
gulp.task("move-project-html", ["clean-up"], () => {
    let stream = gulp.src(`src/project/${project}/client/*/*.html`)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(hash_src({
            build_dir: `dist/${project}/client`,
            src_path: `src/project/${project}/client`
        }))
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
gulp.task("move-icon", ["clean-up"], () => {
    let stream = gulp.src([`src/common/server/icon/*`])
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
gulp.task("move-app", ["clean-up"], () => {
    let stream = gulp.src(`src/common/server/app.js`);
    if (config.isProduction && config.port.hasOwnProperty(project)) {
        stream = stream.pipe(replace(/3000/g, config.port[project]));
    }
    stream = stream.pipe(gulp.dest(`dist/${project}/server/js/`));
    return stream;
});
gulp.task("move-project-app", ["clean-up", "move-app"], () => {
    let stream = gulp.src(`src/project/${project}/server/app.js`);
    if (config.isProduction && config.port.hasOwnProperty(project)) {
        stream = stream.pipe(replace(/3000/g, config.port[project]));
    }
    stream = stream.pipe(gulp.dest(`dist/${project}/server/js/`));
    return stream;
});
gulp.task("move-package", ["clean-up"], () => {
    let stream = gulp.src([`package.json`])
        .pipe(gulp.dest(`dist/${project}`));
    return stream;
});
//mysql.xml
gulp.task("build-mysql", ["clean-up"], () => {
    let promise = new Promise(resolve => {
        if (config.mysql.hasOwnProperty(project)) {
            if (Array.isArray(config.mysql[project].user)) {
                let json = config.mysql[project];
                //host默认值为localhost
                if (!json.hasOwnProperty("host")) {
                    let hostArr = [];
                    for (let i = 0; i < json.user.length; i++) {
                        hostArr.push("localhost");
                    }
                    json.host = hostArr;
                }
                let path = `./dist/${project}/server/config/mysql.xml`;
                xml.write(json, path);
                resolve();
            } else {
                let stream = gulp.src("src/common/server/config/mysql.xml");
                if (config.mysql[project].hasOwnProperty("host")) {
                    stream = stream.pipe(replace(/{host}/g, config.mysql[project].host));
                } else {
                    //host默认值为localhost
                    stream = stream.pipe(replace(/{host}/g, "localhost"));
                }
                stream.pipe(replace(/{user}/g, config.mysql[project].user))
                    .pipe(replace(/{password}/g, config.mysql[project].password))
                    .pipe(replace(/{database}/g, config.mysql[project].database))
                    .pipe(gulp.dest(`./dist/${project}/server/config`))
                    .on("end", () => {
                        resolve();
                    });
            }
        } else {
            resolve();
        }
    });
    return promise;
});
//mongodb.xml
gulp.task("build-mongodb", ["clean-up"], () => {
    let promise = new Promise(resolve => {
        if (config.mongodb.hasOwnProperty(project)) {
            if (Array.isArray(config.mongodb[project].host)) {
                let json = config.mongodb[project];
                let path = `./dist/${project}/server/config/mongodb.xml`;
                xml.write(json, path);
                resolve();
            } else {
                gulp.src("src/common/server/config/mongodb.xml")
                    .pipe(replace(/{host}/g, config.mongodb[project].host))
                    .pipe(replace(/{port}/g, config.mongodb[project].port))
                    .pipe(replace(/{database}/g, config.mongodb[project].database))
                    .pipe(gulp.dest(`./dist/${project}/server/config`))
                    .on("end", () => {
                        resolve();
                    });
            }
        } else {
            resolve();
        }
    });
    return promise;
});
//account.xml
gulp.task("build-account", ["clean-up"], () => {
    let promise = new Promise(resolve => {
        if (config.account.hasOwnProperty(project)) {
            gulp.src("src/common/server/config/account.xml")
                .pipe(replace(/{project}/g, project))
                .pipe(replace(/{username}/g, config.account[project].username))
                .pipe(replace(/{password}/g, config.account[project].password))
                .pipe(replace(/{loginRedirect}/g, config.account[project].loginRedirect))
                .pipe(gulp.dest(`dist/${project}/server/config`))
                .on("end", () => {
                    resolve();
                });
        } else {
            resolve();
        }
    });
    return promise;
});

//编译
gulp.task("compile", ["compile-clean"]);
//编译scss为css
gulp.task("compile-scss", ["move"], () => {
    let stream = gulp.src(`dist/${project}/client/*/*.scss`)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
//获取视图模块
let views = [];
gulp.task("get-views", ["move"], () => {
    let promise = new Promise(resolve => {
        views = fs.readdirSync(`dist/${project}/client`).filter(d => {
            return fs.statSync(path.join(`dist/${project}/client`, d)).isDirectory() && d !== "common" && d !== "data";
        });
        resolve();
    });
    return promise;
});
//合并css为bundle.css
gulp.task("concat-css", ["compile-scss", "get-views"], () => {
    let promiseArr = views.map(d => {
        let promise = new Promise(resolve => {
            gulp.src([`dist/${project}/client/${d}/*.css`, `dist/${project}/client/common/*.css`])
                .pipe(concatCss("bundle.css", {rebaseUrls: false}))
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(gulp.dest(`dist/${project}/client/${d}`))
                .on("end", () => {
                    resolve();
                });
        });
        return promise;
    });
    return Promise.all(promiseArr);
});
//编译jsx
gulp.task("compile-jsx", ["concat-css"], () => {
    let webpackConfig = require('./webpack.config.js');
    if (config.isProduction) {
        //压缩
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    let promiseArr = views.map(d => {
        let promise = new Promise(resolve => {
            gulp.src(`dist/${project}/client/${d}/main.jsx`)
                .pipe(webpackStream(webpackConfig))
                .pipe(gulp.dest(`dist/${project}/client/${d}`))
                .on("end", () => {
                    resolve();
                });
        });
        return promise;
    });
    return Promise.all(promiseArr);
});
//删除编译前的文件
gulp.task("compile-clean", ["compile-jsx"], () => {
    return del([
        `dist/${project}/client/common`,
        `dist/${project}/client/*/*.scss`,
        `dist/${project}/client/*/*.css`,
        `dist/${project}/client/*/*.jsx`,
        `dist/${project}/client/*/*.js`,
        `!dist/${project}/client/*/bundle.css`,
        `!dist/${project}/client/*/bundle.js`
    ]);
});
