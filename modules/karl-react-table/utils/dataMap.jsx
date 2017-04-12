/**
 * 服务器原始数据=》客户端组件过滤=》客户端过滤组件过滤后的数据
 */
export const mapSourceDataToComponentFilterData = (props, sourceData) => {
    let componentFilterData = sourceData.concat();
    props.columns.filter(d => {
        return d.clientFilter === true;
    }).forEach(d => {
        let id = d.id;
        let componentData = props["clientFilter" + id];
        componentFilterData = componentFilterData.filter(d1 => {
            //过滤组件没有勾选的行
            let checkedArr = componentData.filter(d2 => {
                return d2.checked;
            }).map(d2 => {
                return d2.name;
            });
            let isValid = checkedArr.some(d2 => {
                return d2 === d1[id];
            });
            return isValid;
        });
    });
    return componentFilterData
}

/**
 * 客户端过滤组件过滤后的数据=》输入框字符串过滤=》输入框过滤后的数据
 */
export const mapComponentFilterDataToInputFilterData = (componentFilterData, rowFilterValue) => {
    let inputFilterData = componentFilterData.filter(d => {
        let isFind = false;
        for (let k in d) {
            if (d[k] !== null && d[k].toString().toLowerCase().includes(rowFilterValue.toLowerCase())) {
                isFind = true;
                break;
            }
        }
        return isFind;
    });
    return inputFilterData
}

/**
 * 输入框过滤后的数据=》排序=》排序后的数据
 */
export const mapInputFilterDataToSortedData = (inputFilterData, sortColumnId, sortDesc) => {
    let id = sortColumnId
    if (id === undefined) {
        return inputFilterData
    }
    let sortedData = inputFilterData.concat()
    let regex = new RegExp(/^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/g)
    if (sortDesc) {
        sortedData.sort((a, b) => {
            let va, vb
            if (a[id] !== null && b[id] !== null && a[id].toString().match(regex) !== null && b[id].toString().match(regex) !== null) {
                va = a[id]
                vb = b[id]
            } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                va = parseFloat(a[id])
                vb = parseFloat(b[id])
            } else {
                va = (a[id] === null) ? "" : a[id]
                vb = (b[id] === null) ? "" : b[id]
            }
            return va > vb ? 1 : -1
        })
    } else {
        sortedData.sort((a, b) => {
            let va, vb
            if (a[id] !== null && b[id] !== null && a[id].toString().match(regex) !== null && b[id].toString().match(regex) !== null) {
                va = a[id]
                vb = b[id]
            } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                va = parseFloat(a[id])
                vb = parseFloat(b[id])
            } else {
                va = (a[id] === null) ? "" : a[id]
                vb = (b[id] === null) ? "" : b[id]
            }
            return va < vb ? 1 : -1
        })
    }
    return sortedData
}

/**
 * 排序后的数据=》按页显示=》当前页的数据
 */
export const mapSortedDataToDisplayData = (sortedData, pageIndex, rowPerPage) => {
    let start = (pageIndex - 1) * rowPerPage
    let end = pageIndex * rowPerPage
    end = Math.min(end, sortedData.length)
    let displayData = sortedData.slice(start, end)
    return displayData
}