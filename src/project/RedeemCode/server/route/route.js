let router = require("koa-router")();
let response = require("./response");
let table = require("./table");
let tableConfig = require("./tableConfig");
// let decryptJWT = require("karl-jwt").decryptJWT;

/**
 * 验证客户端发来的兑换码
 */
router.get("/RedeemCode/check", async (ctx, next) => {
    let {"CHANNEL-ID": channelId, "USER-ID": userId, "GAME-NAME": game, "CD-KEY": code} = ctx.request.body
    if (channelId === undefined || userId === undefined || game === undefined || code === undefined) {
        response.fail(ctx, "lack of param")
        return
    }

    let codeRegex = /^[0-9a-zA-Z]{12}$/g
    if (!codeRegex.test(code)) {
        response.fail(ctx, "invalid code")
        return
    }

    let pool = global.mysqlObject.find(d => {
        return d.database === "RedeemCode"
    }).pool

    try {
        //验证渠道
        let {rows} = await global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: `select name from channel where channelId=${channelId}`,
        });
        if (rows.length === 0) {
            response.fail(ctx, "unknown channel")
            return
        }

        //根据兑换码类型进行验证
        code = code.toLowerCase()
        if (code[0] === "z") {
            //通用码
            //检查兑换码是否存在
            let {rows1} = await global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: `select name from ${game}_general_code where id="${code}"`,
            })
            let redeemCodeId = rows1[0].redeemCodeId
            if (rows1.length === 0) {
                response.fail(ctx, "unknown cd-key")
                return
            }

            //检查是否被该玩家使用过
            let {rows2} = await global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: `select name from ${game}_general_player where id="${code}" and player="${userId}"`,
            })
            if (rows2.length !== 0) {
                response.fail(ctx, "used cd-key")
                return
            }

            //根据redeemCodeId获取packId
            let {rows3} = await global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: `select packId from redeem_code where id="${redeemCodeId}"`,
            })
            if (rows3.length !== 0) {
                response.fail(ctx, "redeemCodeId not found")
                return
            }
            let packId = rows3[0].packId

            //根据packId获取道具的id和数量
            let {rows4} = await global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: `select itemIds,itemNums from  where id="${packId}"`,
            })
            if (rows4.length !== 0) {
                response.fail(ctx, "packId not found")
                return
            }
            let {itemIds, itemNums} = rows4[0]
            let itemIdArr = itemIds.split(",")
            let itemNumArr = itemNums.split(",")
            if (itemIdArr.length !== itemNumArr.length) {
                response.fail(ctx, "item id and num match error")
                return
            }

            let itemList = []
            for (let i = 0; i < itemIdArr.length; i++) {
                itemList.push({id: itemIdArr[i], numb: itemNumArr[i]})
            }

            //插入该玩家
            let {rows5} = await global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: `insert into ${game}_general_player set id="${code}",player="${userId}"`
            })
            console.log(rows5)
            response.success(ctx, {GoodsData: []})
        } else {
            //非通用码

        }
    } catch (e) {
        console.log(e)
        response.fail(ctx, "server error")
    }


    //查询兑换码所属类型

    //更新数据库，如果版本号字段不一致则表示该兑换码已使用
    response.success(ctx, "haha");

});

/**
 * 表格路由
 */
router.post("/RedeemCode/table/:id/:action", async (ctx, next) => {
    let {id, action} = ctx.params;
    if (!table(ctx).hasOwnProperty(action)) {
        console.log("unknown action:table/" + id + "/" + action);
        response.fail(ctx, "unknown action");
    } else {
        //根据表格id获得表格配置
        if (!tableConfig(ctx).hasOwnProperty(id)) {
            response.fail(ctx, "unknown table " + id);
            return;
        }

        //执行表格对应的action
        let config = tableConfig(ctx)[id];
        try {
            let dataJson = await table(ctx, config)[action](id);
            let {statusCode, message = ""} = dataJson
            if (response.hasOwnProperty("fail" + statusCode)) {
                response["fail" + statusCode](ctx, message)
            } else {
                response.success(ctx, message)
            }
        } catch (e) {
            console.log(e)
            response.fail(ctx, "server error")
        }


    }
});

module.exports = router;