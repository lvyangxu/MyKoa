/**
 * json含义
 * name:表格名称，下载表格时的文件名
 * table:sql查询中用到的名称
 * type:数据库类型mysql/mongodb，未定义时默认为mysql
 * isMinColumn:最小列显示，根据查询结果自动隐藏为空的列，只有在为true时执行
 * dynamicColumn:动态列
 * limitNum:mongo查询的最大返回行
 * sort:mongo查询的排序字段json
 * database:表所属数据库,默认为global.mysqlObject变量中的第一个,单一数据库使用默认值
 * curd:表格需要展示的增删查改操作
 * autoRead:加载时是否自动执行一次读取,默认不读取,只有在为true时执行
 * rowPerPage:每一页显示的table数据行数,默认为10
 * createText:创建按钮的文本，默认为 "新增"
 * createUrl:创建按钮跳转的url，不为undefind时跳转到指定react-router路由
 * autoReadWithoutServerFilter:初次读取时是否使用serverFilter，false
 * totalParam：所有请求需要正则验证的参数并附加到sql条件中的参数，格式为{id:"**",regex:/.../g,isNum:true}
 *          id：客户端参数的key
 *          regex：如果存在，则需要验证正则
 *          isNum：sql拼接是否需要加""，默认为false
 * columns:前端所需的列及其属性，
 *          id:列id，
 *          name:列显示名称，
 *          checked:是否默认显示
 *          clientFilter:是否作为客户端筛选条件
 *          type:表格创建和修改时显示的类型，可为input,textarea,radio,select,day,month,week,rangeDay,rangeMonth,rangeWeek，默认为input
 *          serverFilter:是否作为服务端查询筛选条件
 *          clientFilter:是否作为客户端查询筛选条件
 *          data:该筛选组件初始化数据的数组，函数或固定值，为函数时参数为pool，返回promise
 *          dataMap:对data初始化的值进行处理
 *          radioArr:所有单选值的数组，仅在type为radio有效,
 *          placeholder:input输入框的placeholder，仅在type为integer或input时有效
 *          required:控制input输入框placeholder的颜色，仅在type为integer或input时有效
 *          dateAdd：筛选条件为日期类型时，默认的日期偏移量，默认为{add:0,startAdd:-7(日)或-1(月),endAdd:0}
 *          suffix：table中td显示的后缀文字
 *          thStyle:默认css样式
 *          tdStyle:默认td的样式
 * chart:图表数组
 *          title:标题
 *          x:x轴坐标id
 *          y:y轴坐标json，如{id: "aa", name: "bb"}
 *          yAxisText:y轴坐标单位
 *          type:图表类型，默认为curve
 *          tipsSuffix:tips后缀
 *          xAxisGroupNum:x坐标轴数字分组基数
 * extraFilter:额外的查询条件
 * create:表格创建默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * update:表格更新默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * read:表格查询语句
 * readCheck:表格查询前的参数检查
 * readValue:表格查询默认json值，匹配read值中的？
 * readMap:从数据库读取后对数据进行处理,参数为处理的data
 * @param ctx koa中的ctx对象
 */
let jwt = require("karl-jwt");
let jwt1 = new jwt({
    secret: "jwt-AvalonGame"
});

module.exports = ctx => {
    let tableModel = require("./tableModel")(ctx)

    //客户端ui中的game
    let uiGameJson = {
        id: "uiGame",
        regex: /^[a-z]+$/g
    }

    return {
        item: {
            name: "道具列表",
            database: "RedeemCode",
            curd: "curd",
            autoRead: true,
            is100TableWidth: false,
            totalParam: uiGameJson,
            columns: [
                {id: "id", name: "道具id", checked: true, thStyle: {minWidth: "200px"}},
                {id: "name", name: "道具名称", checked: true, thStyle: {minWidth: "200px"}},
                {id: "value", name: "价值", checked: true, thStyle: {minWidth: "200px"}},
                {
                    id: "image",
                    name: "图片",
                    checked: true,
                    type: "image",
                    imageStyle: {height: "40px"},
                    thStyle: {minWidth: "200px"}
                },
            ],
            read: `select * from item where game="${ctx.request.body.uiGame}"`
        },
        pack: {
            name: "礼包管理",
            database: "RedeemCode",
            totalParam: uiGameJson,
            curd: "curd",
            autoRead: true,
            createText: "创建新礼包",
            createUrl: "pack/create",
            columns: [
                {id: "name", name: "名称", checked: true},
                {id: "id", name: "ID", checked: true},
                {id: "creater", name: "创建者", checked: true},
                {id: "createTime", name: "创建日期", checked: true, type: "rangeDay", serverFilter: true},
                {id: "itemNum", name: "包含物品数量", checked: true},
                {id: "usedTimes", name: "被引用次数", checked: true},
                {id: "review", name: "审核", checked: true},
            ],
            read: () => {
                let whereArr = [
                    tableModel.condition.rangeDate("createTime", "createTime"),
                    tableModel.condition.simpleStr("game", "uiGame")
                ];
                let whereStr = tableModel.where(whereArr);
                let sqlCommond = `select id,name,creater,createTime,(length(itemIds)-length(replace(itemIds,",",""))+1) as itemNum
                                    from pack ${whereStr}`;
                return sqlCommond;
            },
            create: () => {
                let {payload} = jwt1.decryptJWT(ctx.request.body.jwt)
                let {user} = payload
                return {
                    creater: `"${user}"`,
                    createTime: "now()",
                    status: `"未通过"`,
                    game: `"${ctx.request.body.uiGame}"`
                }
            },
            createCheck: () => {
                return tableModel.check.regexArr("data", "name", /.+/)
                    && tableModel.check.regexArr("data", "itemIds", /^([0-9,]+|[0-9]+)$/g)
                    && tableModel.check.regexArr("data", "itemNums", /^([0-9,]+|[0-9]+)$/g)
            }
        },
        packName: {
            name: "礼包名称",
            database: "RedeemCode",
            totalParam: uiGameJson,
            curd: "r",
            columns: [
                {id: "name", name: "名称", checked: true},
                {id: "id", name: "ID", checked: true},
            ],
            read: `select id,name from pack where game="${ctx.request.body.uiGame}"`
        },
        redeemCode: {
            name: "兑换码管理",
            database: "RedeemCode",
            table: "redeem_code",
            curd: "curd",
            totalParam: uiGameJson,
            createText: "创建新兑换码",
            autoRead: true,
            autoReadWithoutServerFilter: true,
            createUrl: "redeemCode/create",
            columns: [
                {id: "name", name: "名称", checked: true},
                {id: "id", name: "ID", checked: true},
                {id: "creater", name: "创建者", checked: true},
                {
                    id: "startTime",
                    name: "开始时间",
                    checked: true,
                    type: "second",
                    serverFilter: true,
                    dateAdd: {add: -7 * 60 * 60 * 24}
                },
                {
                    id: "endTime",
                    name: "结束时间",
                    checked: true,
                    type: "second",
                    serverFilter: true,
                    dateAdd: {add: 60 * 60 * 60 * 24}
                },
                {
                    id: "createTime",
                    name: "创建时间",
                    checked: true,
                    type: "rangeSecond",
                    serverFilter: true,
                    dateAdd: {startAdd: -7 * 60 * 60 * 24, endAdd: 1 * 60 * 60 * 24}
                },
                {id: "packName", name: "关联礼包", checked: true},
                {id: "num", name: "激活数量/生成数量", checked: true},
                {id: "channel", name: "渠道", checked: true},
            ],
            read: () => {
                let whereArr
                if (ctx.request.body.autoRead !== true) {
                    whereArr = [
                        tableModel.condition.biggerThanOrEqual("startTime", "startTime"),
                        tableModel.condition.lessThanOrEqual("endTime", "endTime"),
                        tableModel.condition.rangeDate("createTime", "createTime"),
                        tableModel.condition.equalNum("isValid", 1),
                        tableModel.condition.simpleStr("game", "uiGame")
                    ]
                } else {
                    whereArr = [
                        tableModel.condition.simpleStr("game", "uiGame"),
                        tableModel.condition.equalNum("isValid", 1),
                    ]
                }

                let whereStr = tableModel.where(whereArr);
                let sqlCommond = `select id,name,creater,startTime,endTime,createTime,channel,
                                    (select name from pack where id=packId) as packName,
                                        concat(total,"/",total," ","100%") as num
                                            from redeem_code ${whereStr}`;
                return sqlCommond;
            },
            create: () => {
                let {payload} = jwt1.decryptJWT(ctx.request.body.jwt)
                let {user} = payload
                return {
                    creater: `"${user}"`,
                    createTime: "now()",
                    isValid: 0,
                    game: `"${ctx.request.body.uiGame}"`
                }
            },
            createCheck: () => {
                return tableModel.check.regexArr("data", "name", /.+/)
                    && tableModel.check.regexArr("data", "packId", /\d+/)
                    && tableModel.check.regexArr("data", "channel", /.+/)
                    && tableModel.check.secondArr("data", "startTime")
                    && tableModel.check.secondArr("data", "endTime")
                    && tableModel.check.regexArr("data", "total", /^([1-9]\d*)$/g)
                    && tableModel.check.regexArr("data", "maxTimes", /^([1-9]\d*)$/g)
                    && tableModel.check.regexArr("data", "type", /^(单个账号激活本批次一个码|单个账号激活本批次多个码|通用码)$/g)
            },
            createCallback: jsonParam => {
                let {total: num, type} = ctx.request.body.data[0]

                let {pool, rows} = jsonParam
                let {insertId} = rows

                //查询数据库中的历史兑换码
                let getHistoryCodeList = async table => {
                    try {
                        let {rows: codeList} = await global.mysql.excuteQuery({
                            pool: pool,
                            sqlCommand: `select id from ${table}`
                        })
                        codeList = codeList.map(d => {
                            return d.id
                        })
                        return codeList
                    } catch (e) {
                        console.log(e)
                        reject("get history code list failed")
                    }
                }

                //按数量生成12位随机兑换码
                let buildRandomCode = (buildNum, codeList, isGeneral) => {
                    let arr = [
                        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                        "a", "b", "c", "d", "e", "f", "g",
                        "h", "i", "j", "k", "l", "m", "n",
                        "o", "p", "q", "r", "s", "t",
                        "u", "v", "w", "x", "y", "z"
                    ]
                    let buildRandom = len => {
                        let value = ""
                        for (let i = 0; i < len; i++) {
                            if (i === 0) {
                                if (isGeneral) {
                                    //通用码第一位固定为z
                                    value += "z"
                                } else {
                                    //非通用码第一位不为z
                                    //创建0到34的随机数
                                    let randomIndex = Math.floor(Math.random() * 35)
                                    let randomStr = arr[randomIndex]
                                    value += randomStr
                                }
                            } else {
                                //创建0到35的随机数
                                let randomIndex = Math.floor(Math.random() * 36)
                                let randomStr = arr[randomIndex]
                                value += randomStr
                            }
                        }
                        return value
                    }
                    buildNum = Number.parseInt(buildNum)
                    let codeMap = new Map()
                    let fillMap = () => {
                        let len = buildNum - codeMap.size
                        for (let i = 0; i < len; i++) {
                            let randomStr = buildRandom(12)
                            if (!codeList.includes(randomStr)) {
                                codeMap.set(randomStr, randomStr)
                            }
                        }
                    }
                    while (codeMap.size < buildNum) {
                        fillMap()
                    }
                    return codeMap
                }

                let promise = new Promise(async (resolve, reject) => {
                    if (type === "通用码") {
                        let historyCodeList = await getHistoryCodeList(`${ctx.request.body.uiGame}_general_code`)
                        let buildCodeMap = buildRandomCode(1, historyCodeList, true)
                        let id = buildCodeMap.entries().next().value

                        //插入general_code表
                        try {
                            await global.mysql.excuteQuery({
                                pool: pool,
                                sqlCommand: `insert into ${ctx.request.body.uiGame}_general_code set id="${id}",redeemCodeId=${insertId}`
                            })
                        } catch (e) {
                            console.log(e)
                            reject(`insert ${ctx.request.body.uiGame}_general_code failed`)
                        }
                    } else {
                        let historyCodeList = await  getHistoryCodeList(`${ctx.request.body.uiGame}_code`)
                        let buildCodeMap = buildRandomCode(num, historyCodeList, false)

                        //插入code表
                        let insertRows = []
                        buildCodeMap.forEach(value => {
                            let row = `("${value}",${insertId})`
                            insertRows.push(row)
                        })
                        let insertRowsStr = insertRows.join(",")
                        try {
                            await global.mysql.excuteQuery({
                                pool: pool,
                                sqlCommand: `insert into ${ctx.request.body.uiGame}_code (id,redeemCodeId) values ${insertRowsStr}`
                            })
                        } catch (e) {
                            console.log(e)
                            reject("insert code failed")
                        }
                    }

                    //更改redeem_code的isValid状态
                    try {
                        await global.mysql.excuteQuery({
                            pool: pool,
                            sqlCommand: `update redeem_code set isValid=1 where id=${insertId}`
                        })
                    } catch (e) {
                        console.log(e)
                        reject("update redeem_code isValid failed")
                    }

                    resolve("build code done")
                })
                return promise
            }
        },
        redeemCodeName: {
            name: "兑换码名称",
            database: "RedeemCode",
            totalParam: uiGameJson,
            curd: "r",
            columns: [
                {id: "name", name: "名称", checked: true},
                {id: "id", name: "ID", checked: true},
            ],
            read: `select id,name from redeem_code where game="${ctx.request.body.uiGame}"`
        },
        channel: {
            name: "渠道名称",
            database: "RedeemCode",
            totalParam: uiGameJson,
            curd: "curd",
            autoRead: true,
            is100TableWidth: false,
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "channelId", name: "客户端渠道id", checked: true},
                {id: "channelName", name: "客户端渠道名称", checked: true},
                {id: "name", name: "名称", checked: true, thStyle: {minWidth: "200px"}},
            ],
            read: `select * from channel where game="${ctx.request.body.uiGame}"`
        }
    }

}