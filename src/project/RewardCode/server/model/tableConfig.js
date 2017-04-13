/**
 * json含义
 * name:表格名称，下载表格时的文件名
 * type:数据库类型mysql/mongodb，未定义时默认为mysql
 * isMinColumn:最小列显示，根据查询结果自动隐藏为空的列，只有在为true时执行
 * dynamicColumn:动态列
 * limitNum:mongo查询的最大返回行
 * sort:mongo查询的排序字段json
 * database:表所属数据库,默认为global.mysqlObject变量中的第一个,单一数据库使用默认值
 * curd:表格需要展示的增删查改操作
 * autoRead:加载时是否自动执行一次读取,默认不读取,只有在为true时执行
 * rowPerPage:每一页显示的table数据行数,默认为10
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
module.exports = ctx => {
    let tableModel = require("./tableModel")(ctx);
    return {
        item: {
            name: "道具列表",
            database: "RewardCode",
            curd: "curd",
            columns: [
                {id: "id", name: "道具id", checked: true},
                {id: "name", name: "道具名称", checked: true},
                {id: "value", name: "价值", checked: true},
                {id: "image", name: "图片", checked: true, type: "image", imageStyle: {height: "40px"}},
            ]
        },
        itemBundle: {
            name: "礼包管理",
            database: "RewardCode",
            curd: "urd",
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
                console.log(ctx.request.body);
                let whereArr = [
                    tableModel.condition.rangeDate("createTime", "createTime")
                ];
                let whereStr = tableModel.where(whereArr);
                let sqlCommond = `select id,name,creater,createTime,(length(itemIds)-length(replace(itemIds,",",""))+1) as itemNum
                                    from itemBundle ${whereStr}`;
                return sqlCommond;
            }
        }
    }

}