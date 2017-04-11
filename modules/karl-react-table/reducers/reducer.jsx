import {
    INIT,
    CHANGE_ROW_FILTER,
    CHANGE_COLUMN_FILTER,
    CHANGE_PAGE_INDEX,
    READ,
    START_LOADING,
    END_LOADING,
} from "../actions/action"

export default (state, action) => {
    let newState
    switch (action.type) {
        case INIT:
            newState = Object.assign({}, state, {columns: action.columns, curd: action.curd})
            break
        case CHANGE_ROW_FILTER:
            // let matchValue = value == undefined ? this.state.rowFilterValue : value;
            // let inputFilterData = this.state.componentFilterData.filter(d => {
            //     let isFind = false;
            //     for (let k in d) {
            //         if (d[k] != null && d[k].toString().toLowerCase().includes(matchValue.toLowerCase())) {
            //             isFind = true;
            //             break;
            //         }
            //     }
            //     return isFind;
            // });
            // let json = this.sort();
            // let json2 = {
            //     pageIndex: 1,
            //     inputFilterData: inputFilterData
            // };
            // if (value != undefined) {
            //     json2.rowFilterValue = matchValue;
            // }
            // this.setState(json2, ()=> {
            //     let json1 = this.sort();
            //     for (let k in json1) {
            //         json[k] = json1[k];
            //     }
            //     json.displayData = this.setDisplayData(json.sortedData);
            //     this.setState(json);
            // });
            newState = Object.assign({}, state, {rowFilterValue: action.rowFilterValue})
            break
        case CHANGE_COLUMN_FILTER:
            newState = Object.assign({}, state, {columns: columns})
            break
        case CHANGE_PAGE_INDEX:
            // this.setState({pageIndex: e.target.value}, ()=> {
            //     let json = this.sort();
            //     json.displayData = this.setDisplayData(json.sortedData);
            //     this.setState(json);
            // });
            newState = Object.assign({}, state, {pageIndex: pageIndex})
            break
        // case READ:
        //     // try {

        //     //     //附加查询条件的数据
        //     //     let requestData = {};
        //     //     this.state.serverFilter.forEach(d=> {
        //     //         switch (d.type) {
        //     //             case "day":
        //     //             case "month":
        //     //             case "select":
        //     //             case "input":
        //     //             case "integer":
        //     //             case "radio":
        //     //                 requestData[d.id] = this.state[d.id + "Condition"];
        //     //                 break;
        //     //             case "rangeDay":
        //     //             case "rangeMonth":
        //     //             case "rangeSecond":
        //     //                 requestData[d.id] = {
        //     //                     start: this.state[d.id + "ConditionStart"],
        //     //                     end: this.state[d.id + "ConditionEnd"]
        //     //                 };
        //     //                 break;
        //     //         }
        //     //     });
        //     //     let message = await this.request("read", requestData);
        //     //     let data = message.data;
        //     //     let displayData = this.setDisplayData(data);
        //     //     let json = {
        //     //         loading: false,
        //     //         sourceData: data,
        //     //         sortedData: data,
        //     //         componentFilterData: data,
        //     //         inputFilterData: data,
        //     //         displayData: displayData,
        //     //         sortColumnId: "",
        //     //         rowFilterValue: ""
        //     //     };
        //     //
        //     //     //设置客户端筛选组件控件的值为undefind，恢复为全选
        //     //     this.state.columns.filter(d=> {
        //     //         return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
        //     //     }).forEach(d=> {
        //     //         let id = d.id;
        //     //         let componentData = [];
        //     //         data.forEach(d1=> {
        //     //             if (!componentData.includes(d1[id])) {
        //     //                 componentData.push(d1[id]);
        //     //             }
        //     //         });
        //     //         componentData = componentData.map((d1, i)=> {
        //     //             return {id: i, name: d1, checked: true};
        //     //         });
        //     //         json["clientFilter" + id] = componentData;
        //     //     });
        //     //
        //     //     if (message.hasOwnProperty("columns")) {
        //     //         json.columns = message.columns;
        //     //     }
        //     //
        //     //     //隐藏没有数据的列,显示有数据的列
        //     //     if (this.state.isMinColumn) {
        //     //         let columns = json.hasOwnProperty("columns") ? json.columns : this.state.columns;
        //     //         json.columns = columns.map(d=> {
        //     //             //判断该列是否为空
        //     //             let isNotEmpty = data.some(d1=> {
        //     //                 return d1.hasOwnProperty(d.id) && d1[d.id] != "" && d1[d.id] != null;
        //     //             });
        //     //             d.checked = isNotEmpty;
        //     //             return d;
        //     //         });
        //     //     }
        //     //     this.setState(json);

        case START_LOADING:
            newState = Object.assign({}, state, {isLoading: true})
            break
        case END_LOADING:
            newState = Object.assign({}, state, {isLoading: false})
            break
        default:
            newState = Object.assign({}, state)
            break
    }
    return newState
}