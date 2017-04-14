module.exports = ctx => {
    return {
        /**
         * 字段拼接
         */
        column: {
            /**
             * 前端select控件表示的查询字段,未选中时忽略,选中时返回结尾有","以便于拼接
             */
            optionalSelect: (fieldExpression, param, table) => {
                let selected = ctx.request.body[param].filter(d => {
                    return d.checked;
                }).map(d => {
                    return d.name;
                });
                let str = "";
                let tableStr = table === undefined ? "" : (table + ".");
                if (selected.length !== 0) {
                    str = `${tableStr}${fieldExpression} as ${param},`;
                }
                return str;
            }
        },
        /**
         * 查询条件拼接
         * @param conditionArr
         * @returns {string}
         */
        where: conditionArr => {
            let str = "";
            if (conditionArr.length > 0) {
                str = " where " + conditionArr.filter(d => {
                        return d !== "";
                    }).join(" and ");
            }
            return str;
        },
        /**
         * 分组字符串
         * @param columns
         * @returns {string}
         */
        group: columns => {
            let str = "";
            columns = columns.filter(d => {
                //检查是否是多选插件
                if (ctx.request.body.hasOwnProperty(d) && Array.isArray(ctx.request.body[d])) {
                    let isSelect = ctx.request.body[d].every(d1 => {
                        return d1.hasOwnProperty("id") && d1.hasOwnProperty("name") && d1.hasOwnProperty("checked");
                    });
                    if (isSelect) {
                        //计算选中的个数
                        let selectedNum = ctx.request.body[d].filter(d1 => {
                            return d1.checked;
                        }).length;
                        return selectedNum !== 0;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            });
            if (columns.length > 0) {
                str = "group by " + columns.join(",");
            }
            return str;
        },
        /**
         * 排序字符串
         * @param columns
         * @param type
         * @returns {string}
         */
        order: (columns, type) => {
            let str = "";
            columns = columns.filter(d => {
                //检查是否是多选插件
                if (ctx.request.body.hasOwnProperty(d) && Array.isArray(ctx.request.body[d])) {
                    let isSelect = ctx.request.body[d].every(d1 => {
                        return d1.hasOwnProperty("id") && d1.hasOwnProperty("name") && d1.hasOwnProperty("checked");
                    });
                    if (isSelect) {
                        //计算选中的个数
                        let selectedNum = ctx.request.body[d].filter(d1 => {
                            return d1.checked;
                        }).length;
                        return selectedNum !== 0;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            });
            if (columns.length > 0) {
                let typeStr = (type === "desc") ? " desc" : "";
                str = "order by " + columns.join(",") + typeStr;
            }
            return str;
        },
        /**
         * 查询条件
         */
        condition: {
            //范围的日期值
            rangeDate: (field, param) => {
                let str = ` ${field}>="${ctx.request.body[param].start}" and ${field}<="${ctx.request.body[param].end}" `;
                return str;
            },
            //固定的字符串值
            simpleStr: (field, param) => {
                let str = ` ${field}="${ctx.request.body[param]}" `;
                return str;
            },
            //大于等于固定的字符串值
            biggerThanOrEqual: (field, param) => {
                let str = ` ${field}>="${ctx.request.body[param]}" `;
                return str;
            },
            //小于等于固定的字符串值
            lessThanOrEqual: (field, param) => {
                let str = ` ${field}<="${ctx.request.body[param]}" `;
                return str;
            },
            //前端select控件传入的整形
            optionalSelectNum: (field, param) => {
                let selected = ctx.request.body[param].filter(d => {
                    return d.checked;
                }).map(d => {
                    return d.name;
                });
                let str = "";
                if (selected.length !== 0) {
                    let d = selected.join(",");
                    str = ` ${field} in (${d}) `;
                }
                return str;
            },
            //前端select控件传入的字符串
            optionalSelectStr: (field, param) => {
                let selected = ctx.request.body[param].filter(d => {
                    return d.checked;
                }).map(d => {
                    return JSON.stringify(d.name);
                });
                let str = "";
                if (selected.length !== 0) {
                    let d = selected.join(",");
                    str = ` ${field} in (${d}) `;
                }
                return str;
            },
            //前端输入框传入的值
            optionalInputStr: (field, param) => {
                let str = "";
                if (ctx.request.body[param] !== undefined && ctx.request.body[param] !== "") {
                    str = ` ${field}="${ctx.request.body[param]}" `;
                }
                return str;
            },
            //前端输入框传入的模糊匹配值
            optionalInputLikeStr: (field, param) => {
                let str = "";
                if (ctx.request.body[param] !== undefined && ctx.request.body[param] !== "") {
                    str = ` ${field} like "%${ctx.request.body[param]}%" `;
                }
                return str;
            },
            //不等于固定的值
            notEqual: (field, value) => {
                let str = ` ${field}<>"${value}" `;
                return str;
            },
            //等于固定的值
            equal: (field, value) => {
                let str = ` ${field}="${value}" `;
                return str;
            },
        },
        /**
         * 参数检查
         */
        check: {
            //固定时间
            day: (param) => {
                let hasParam = ctx.request.body.hasOwnProperty(param);
                let regex = /^\d{4}-\d{2}-\d{2}$/;
                let isValid = regex.test(ctx.request.body[param]);
                return hasParam && isValid;
            },
            //范围时间-天
            rangeDay: (param) => {
                let hasParam = ctx.request.body.hasOwnProperty(param) && ctx.request.body[param].hasOwnProperty("start") && ctx.request.body[param].hasOwnProperty("end");
                let regex = /^\d{4}-\d{2}-\d{2}$/;
                let isValid = regex.test(ctx.request.body[param].start) && regex.test(ctx.request.body[param].end);
                return hasParam && isValid;
            },
            //范围时间-秒
            rangeSecond: (param) => {
                let hasParam = ctx.request.body.hasOwnProperty(param) && ctx.request.body[param].hasOwnProperty("start") && ctx.request.body[param].hasOwnProperty("end");
                let regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
                let isValid = regex.test(ctx.request.body[param].start) && regex.test(ctx.request.body[param].end);
                return hasParam && isValid;
            },
            //多选插件的数组
            select: (param) => {
                let hasParam = ctx.request.body.hasOwnProperty(param);
                let isValid = Array.isArray(ctx.request.body[param]);
                return hasParam && isValid;
            },
            //必要条件,参数必须匹配正则
            regex: (param, regex) => {
                if (ctx.request.body.hasOwnProperty(param) && ctx.request.body[param] !== "") {
                    return regex.test(ctx.request.body[param]);
                } else {
                    return false;
                }
            },
            //可选条件,参数不为""时必须匹配正则,为""时忽略
            optionalRegex: (param, regex) => {
                if (ctx.request.body.hasOwnProperty(param) && ctx.request.body[param] !== "") {
                    return regex.test(ctx.request.body[param]);
                } else {
                    return true;
                }
            },
        },
        /**
         * 通过mysql数据库,初始化服务端筛选控件的数据
         */
        initMysqlServerFilter: (pool, sqlCommand) => {
            return global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: sqlCommand
            });
        }
    };
};