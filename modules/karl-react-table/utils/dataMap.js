"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 服务器原始数据=》客户端组件过滤=》客户端过滤组件过滤后的数据
 */
var mapSourceDataToComponentFilterData = exports.mapSourceDataToComponentFilterData = function mapSourceDataToComponentFilterData(props, sourceData) {
    var componentFilterData = sourceData.concat();
    props.columns.filter(function (d) {
        return d.clientFilter === true;
    }).forEach(function (d) {
        var id = d.id;
        var componentData = props["clientFilter" + id];
        componentFilterData = componentFilterData.filter(function (d1) {
            //过滤组件没有勾选的行
            var checkedArr = componentData.filter(function (d2) {
                return d2.checked;
            }).map(function (d2) {
                return d2.name;
            });
            var isValid = checkedArr.some(function (d2) {
                return d2 === d1[id];
            });
            return isValid;
        });
    });
    return componentFilterData;
};

/**
 * 客户端过滤组件过滤后的数据=》输入框字符串过滤=》输入框过滤后的数据
 */
var mapComponentFilterDataToInputFilterData = exports.mapComponentFilterDataToInputFilterData = function mapComponentFilterDataToInputFilterData(componentFilterData, rowFilterValue) {
    var inputFilterData = componentFilterData.filter(function (d) {
        var isFind = false;
        for (var k in d) {
            if (d[k] !== null && d[k].toString().toLowerCase().includes(rowFilterValue.toLowerCase())) {
                isFind = true;
                break;
            }
        }
        return isFind;
    });
    return inputFilterData;
};

/**
 * 输入框过滤后的数据=》排序=》排序后的数据
 */
var mapInputFilterDataToSortedData = exports.mapInputFilterDataToSortedData = function mapInputFilterDataToSortedData(inputFilterData, sortColumnId, sortDesc) {
    var id = sortColumnId;
    if (id === undefined || id === "") {
        return inputFilterData;
    }
    var sortedData = inputFilterData.concat();
    var regex = new RegExp(/^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/g);
    if (sortDesc) {
        sortedData.sort(function (a, b) {
            var va = void 0,
                vb = void 0;
            if (a[id] !== null && b[id] !== null && a[id].toString().match(regex) !== null && b[id].toString().match(regex) !== null) {
                va = a[id];
                vb = b[id];
            } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                va = parseFloat(a[id]);
                vb = parseFloat(b[id]);
            } else {
                va = a[id] === null ? "" : a[id];
                vb = b[id] === null ? "" : b[id];
            }
            return va > vb ? 1 : -1;
        });
    } else {
        sortedData.sort(function (a, b) {
            var va = void 0,
                vb = void 0;
            if (a[id] !== null && b[id] !== null && a[id].toString().match(regex) !== null && b[id].toString().match(regex) !== null) {
                va = a[id];
                vb = b[id];
            } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                va = parseFloat(a[id]);
                vb = parseFloat(b[id]);
            } else {
                va = a[id] === null ? "" : a[id];
                vb = b[id] === null ? "" : b[id];
            }
            return va < vb ? 1 : -1;
        });
    }
    return sortedData;
};

/**
 * 排序后的数据=》按页显示=》当前页的数据
 */
var mapSortedDataToDisplayData = exports.mapSortedDataToDisplayData = function mapSortedDataToDisplayData(sortedData, pageIndex, rowPerPage) {
    var start = (pageIndex - 1) * rowPerPage;
    var end = pageIndex * rowPerPage;
    end = Math.min(end, sortedData.length);
    var displayData = sortedData.slice(start, end);
    return displayData;
};
