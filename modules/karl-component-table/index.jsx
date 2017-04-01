// let http = require("karl-http");
// let React = require("react");
// let Select = require("karl-component-select");
// let upload = require("./upload");
//
// // class table extends React.Component {
// //     constructor(props) {
// //         super(props);
// //         this.state = {
// //             curd: (this.props.curd == undefined) ? "r" : this.props.curd,
// //             panel: "main",
// //             columns: [],
// //             sourceData: [],
// //             filterData: [],
// //             displayData: [],
// //             rowFilterValue: "",
// //             rowAllChecked: false,
// //             sortDesc: true,
// //             sortColumnId: "",
// //             createLineNum: 5,
// //             ct: [],
// //             ut: [],
// //             attachmentList: [],
// //             attachmentProgress: "0%",
// //             loading: false,
// //             selectFilter: [],
// //             createReferTableData: []
// //         };
// //         let bindArr = ["columnFilterCallback", "rowFilterChange", "refresh", "radioFilterChange", "tdCallback", "sort", "rowAllCheck",
// //             "rowCheck", "backToMain", "create", "createSubmit", "createTdChange", "update", "updateSubmit", "updateTdChange", "delete"];
// //         bindArr.forEach(d => {
// //             this[d] = this[d].bind(this);
// //         });
// //     }
// //
// //     async componentDidMount() {
// //         let tableId = this.props.tableId;
// //         if (tableId) {
// //             try {
// //                 let initData = await http.post("../table/" + tableId + "/init");
// //                 let readData = await http.post("../table/" + tableId + "/read");
// //                 readData = readData.map(d => {
// //                     d.checkboxChecked = false;
// //                     return d;
// //                 });
// //
// //                 //初始化创建ct的值
// //                 let ct = [];
// //                 for (let i = 0; i < this.state.createLineNum; i++) {
// //                     let ctRow = {};
// //                     initData.forEach(d => {
// //                         ctRow[d.id] = "";
// //                     });
// //                     ct.push(ctRow);
// //                 }
// //
// //                 let selectFilter = initData.filter(d => {
// //                     return d.select;
// //                 }).map(d => {
// //                     let values = [];
// //                     let data = [];
// //                     readData.forEach((d1, j) => {
// //                         if (!values.includes(d1[d.id])) {
// //                             values.push(d1[d.id]);
// //                             data.push({id: j, name: d1[d.id], checked: true});
// //                         }
// //                     });
// //                     return {id: d.id, name: d.name, data: data};
// //                 });
// //
// //                 this.setState({
// //                     columns: initData,
// //                     sourceData: readData,
// //                     filterData: readData,
// //                     displayData: readData,
// //                     ct: ct,
// //                     selectFilter: selectFilter
// //                 });
// //
// //             } catch (e) {
// //                 console.log("init table failed:" + tableId);
// //             }
// //         }
// //
// //
// //     }
// //
// //     componentWillReceiveProps(nextProps) {
// //         if (this.props.rowFilterValue != nextProps.rowFilterValue) {
// //             this.rowFilterChange({target: {value: nextProps.rowFilterValue}});
// //             this.setState({
// //                 rowFilterValue: nextProps.rowFilterValue
// //             });
// //         }
// //     }
// //
// //     render() {
// //         return (
// //             <div className="react-table">
// //                 {
// //                     this.setTop()
// //                 }
// //                 <div style={this.state.panel == "main" ? {} : {display: "none"}}>
// //
// //                     <div className="table-body">
// //                         <table style={this.props.fillWidth == false ? {} : {width: "100%"}}>
// //                             <thead>
// //                             <tr>
// //                                 <th className="checkbox"
// //                                     style={this.state.curd.includes("d") ? {} : {display: "none"}}>
// //                                     <input type="checkbox" checked={this.state.rowAllChecked} onChange={() => {
// //                                         this.rowAllCheck();
// //                                     }}/>
// //                                 </th>
// //                                 {
// //                                     this.state.columns.map(d => {
// //                                         return <th key={d.id} onClick={() => {
// //                                             this.sort(d.id);
// //                                         }} data-columnId={d.id} className={d.checked ? "" : "hide"}>{d.name}{
// //                                             (this.state.sortColumnId == d.id) ? (
// //                                                     this.state.sortDesc ?
// //                                                         <i className="fa fa-caret-up"></i> :
// //                                                         <i className="fa fa-caret-down"></i>
// //                                                 ) : ""
// //                                         }</th>
// //                                     })
// //                                 }
// //                             </tr>
// //                             </thead>
// //                             <tbody>
// //                             {
// //                                 this.state.displayData.map((d, i) => {
// //                                     return <tr key={i}>
// //                                         <td className="checkbox"
// //                                             style={(this.state.curd.includes("d") || this.state.curd.includes("d")) ? {} : {display: "none"}}>
// //                                             <input checked={d.checkboxChecked} type="checkbox" onChange={() => {
// //                                                 this.rowCheck(d);
// //                                             }}/></td>
// //                                         {
// //                                             this.state.columns.map(d1 => {
// //                                                 let tdHtml = d[d1.id];
// //                                                 if (tdHtml) {
// //                                                     tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
// //                                                 }
// //                                                 if (this.props[d1.id + "TdCallback"] != undefined) {
// //                                                     return <td data={d[d1.id]} key={d1.id}
// //                                                                data-columnId={d1.id}
// //                                                                className={d1.checked ? "" : "hide"}
// //                                                                onClick={() => {
// //                                                                    this.tdCallback(d1.id, d[d1.id])
// //                                                                }}
// //                                                                dangerouslySetInnerHTML={{__html: tdHtml}}></td>
// //                                                 } else {
// //                                                     return <td data={d[d1.id]} key={d1.id}
// //                                                                data-columnId={d1.id}
// //                                                                className={d1.checked ? "" : "hide"}
// //                                                                dangerouslySetInnerHTML={{__html: tdHtml}}></td>
// //                                                 }
// //                                             })
// //                                         }</tr>
// //                                 })
// //                             }
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </div>
// //                 <div className="panel-create"
// //                      style={this.state.panel == "create" ? {} : {display: "none"}}>
// //                     <div className="panel-head">
// //                         <button className="backToMain" onClick={() => {
// //                             this.backToMain();
// //                         }}><i className="fa fa-arrow-left"></i>返回表格主界面
// //                         </button>
// //                         <button className="submit" onClick={() => {
// //                             this.createSubmit();
// //                         }}><i className="fa fa-plus"></i>提交
// //                         </button>
// //                     </div>
// //                     <table>
// //                         <thead>
// //                         <tr>
// //                             {
// //                                 this.state.columns.filter(d => {
// //                                     let filter = (d.id == "id");
// //                                     return !filter;
// //                                 }).map(d => {
// //                                     return <th key={d.id}>{d.name}</th>;
// //                                 })
// //                             }
// //                         </tr>
// //                         </thead>
// //                         <tbody>
// //                         {
// //                             this.state.createReferTableData.map((d, i) => {
// //                                 return <tr key={i}>
// //                                     {
// //                                         this.state.columns.filter(d1 => {
// //                                             let filter = (d1.id == "id");
// //                                             return !filter;
// //                                         }).map(d1 => {
// //                                             let td = <td data-columnId={d1.id} key={d1.id}
// //                                                          dangerouslySetInnerHTML={{__html: d[d1.id].toString().replace(/\n/g, "<br/>")}}></td>;
// //                                             return td;
// //                                         })
// //                                     }
// //                                 </tr>
// //                             })
// //                         }
// //                         {
// //                             this.state.ct.map((d, i) => {
// //                                 return <tr key={i}>
// //                                     {
// //                                         this.state.columns.filter(d1 => {
// //                                             let filter = (d1.id == "id");
// //                                             return !filter;
// //                                         }).map(d1 => {
// //                                             let td;
// //                                             switch (d1.type) {
// //                                                 case "textarea":
// //                                                     td = <textarea disabled={d1.createReadonly} value={d[d1.id]}
// //                                                                    onChange={(e) => {
// //                                                                        this.createTdChange(e, i, d1.id);
// //                                                                    }}/>;
// //                                                     break;
// //                                                 case "radio":
// //                                                     td = <select disabled={d1.createReadonly}
// //                                                                  value={d[d1.id]}
// //                                                                  onChange={(e) => {
// //                                                                      this.createTdChange(e, i, d1.id);
// //                                                                  }}>
// //                                                         <option></option>
// //                                                         {d1.radioArr.map((d2, j) => {
// //                                                             return <option key={j}>{d2}</option>;
// //                                                         })}</select>;
// //                                                     break;
// //                                                 default:
// //                                                     td = <input disabled={d1.createReadonly} value={d[d1.id]}
// //                                                                 onChange={(e) => {
// //                                                                     this.createTdChange(e, i, d1.id);
// //                                                                 }}/>;
// //                                                     break;
// //                                             }
// //                                             td = <td key={d1.id}>{td}</td>;
// //                                             return td;
// //                                         })
// //                                     }</tr>;
// //                             })
// //                         }
// //                         </tbody>
// //                     </table>
// //                 </div>
// //                 <div className="panel-attachment" style={this.state.panel == "attachment" ? {} : {display: "none"}}>
// //                     <div className="panel-head">
// //                         <button className="backToMain" onClick={() => {
// //                             this.backToMain();
// //                         }}><i className="fa fa-arrow-left"></i>返回表格主界面
// //                         </button>
// //                     </div>
// //                     <div className="upload">
// //                         <input type="file" multiple="multiple"/>
// //                         <div className="progress">{this.state.attachmentProgress}</div>
// //                         <button onClick={(e) => {
// //                             this.uploadAttachment(e);
// //                         }}>上传附件
// //                         </button>
// //                     </div>
// //                     <table>
// //                         <thead>
// //                         <tr>
// //                             <th>附件名称</th>
// //                             <th>删除</th>
// //                         </tr>
// //                         </thead>
// //                         <tbody>
// //                         {
// //                             (this.state.attachmentList.length == 0) ?
// //                                 <tr>
// //                                     <td colSpan="2">no attachment</td>
// //                                 </tr> :
// //                                 this.state.attachmentList.map(d => {
// //                                     return <tr key={d}>
// //                                         <td>{d}</td>
// //                                         <td><i className="fa fa-times" onClick={() => {
// //                                             this.deleteAttachment(d);
// //                                         }}></i></td>
// //                                     </tr>
// //                                 })
// //                         }
// //                         </tbody>
// //                     </table>
// //                 </div>
// //                 {
// //                     this.setBottom()
// //                 }
// //             </div>
// //         );
// //     }
// //
// //     /**
// //      * 设置table顶部的dom
// //      * @returns {XML}
// //      */
// //     setTop() {
// //         let dom = <div className="table-head">
// //             <div className="column-filter">
// //                 <Select data={this.state.columns} text="列过滤" callback={this.columnFilterCallback}
// //                         optionNumPerColumn={5}/>
// //             </div>
// //             <div className="row-filter">
// //                 <input onChange={this.rowFilterChange} placeholder="行过滤"
// //                        value={this.state.rowFilterValue}/>
// //             </div>
// //             <div className="refresh"
// //                  style={this.state.curd.includes("r") ? {marginLeft: "20px"} : {display: "none"}}>
// //                 <button className={this.state.loading ? "loading" : ""} onClick={() => {
// //                     this.refresh();
// //                 }}><i className={this.state.loading ? "fa fa-refresh loading" : "fa fa-refresh"}></i>刷新
// //                 </button>
// //             </div>
// //             <div className="delete"
// //                  style={this.state.curd.includes("d") ? {marginLeft: "20px"} : {display: "none"}}>
// //                 <button onClick={() => {
// //                     this.delete();
// //                 }}><i className="fa fa-times"></i>删除
// //                 </button>
// //             </div>
// //             <div className="attachment"
// //                  style={this.props.attachment ? {marginLeft: "20px"} : {display: "none"}}>
// //                 <button onClick={() => {
// //                     this.attachment();
// //                 }}><i className="fa fa-paperclip"></i>附件
// //                 </button>
// //             </div>
// //             <div className="select-filter" style={this.state.columns.filter(d => {
// //                 return d.select;
// //             }).length > 0 ? {marginTop: "20px"} : {}}>
// //                 {
// //                     this.state.selectFilter.map((d, i) => {
// //                         let select = <Select key={i} data={d.data} text={d.name}
// //                                              callback={(d1 => {
// //                                                  this.rowFilterCallback(d.id, d1);
// //                                              })}
// //                                              optionNumPerColumn={5}/>;
// //                         return select;
// //                     })
// //                 }
// //             </div>
// //         </div>;
// //         return dom;
// //     }
// //
// //     setBottom() {
// //
// //     }
// //
// //
// //     columnFilterCallback(columns) {
// //         this.setState({columns: columns});
// //     }
// //
// //     rowFilterChange(e) {
// //         let matchValue = e.target.value;
// //         let filterData = this.state.sourceData.filter(d => {
// //             let isFind = false;
// //             for (let k in d) {
// //                 if (d[k] != null && d[k].toString().toLowerCase().includes(matchValue.toLowerCase())) {
// //                     isFind = true;
// //                     break;
// //                 }
// //             }
// //             return isFind;
// //         });
// //         this.setState({
// //             filterData: filterData,
// //             displayData: filterData,
// //             rowFilterValue: matchValue
// //         });
// //     }
// //
// //     rowFilterCallback(id, data) {
// //         let checkedValues = data.filter(d => {
// //             return d.checked;
// //         }).map(d => {
// //             return d.name;
// //         });
// //         let filterData = this.state.sourceData.filter(d => {
// //             let isFind = false;
// //             checkedValues.forEach(d1 => {
// //                 if (d[id] != null && d[id].toString().toLowerCase() == d1.toString().toLowerCase()) {
// //                     isFind = true;
// //                 }
// //             });
// //             return isFind;
// //         });
// //         this.state.selectFilter.filter(d => {
// //             return d.id != id;
// //         }).map(d => {
// //             let checkedValues = d.data.filter(d1 => {
// //                 return d1.checked;
// //             });
// //
// //             filterData = filterData.filter(d1 => {
// //                 let isFind = false;
// //                 checkedValues.forEach(d2 => {
// //                     let tdValue = d1[d.id];
// //                     let matchValue = d2.name.toString().toLowerCase();
// //                     if (tdValue != null && tdValue.toString().toLowerCase() == matchValue) {
// //                         isFind = true;
// //                     }
// //                 });
// //                 return isFind;
// //             })
// //         });
// //
// //         this.setState({
// //             filterData: filterData,
// //             displayData: filterData
// //         });
// //     }
// //
// //     refresh() {
// //         let tableId = this.props.tableId;
// //         this.setState({
// //             loading: true
// //         });
// //         http.post("../table/" + tableId + "/read").then(d => {
// //             d = d.map(d1 => {
// //                 d1.checkboxChecked = false;
// //                 return d1;
// //             });
// //             this.setState({
// //                 loading: false,
// //                 sourceData: d,
// //                 filterData: d,
// //                 displayData: d,
// //                 rowFilterValue: "",
// //                 rowAllCheck: false
// //             });
// //         }).catch(d => {
// //             this.setState({
// //                 loading: false
// //             });
// //             alert("刷新数据失败:" + d);
// //         });
// //     }
// //
// //     radioFilterChange(e, d) {
// //         let filterData = (e.target.value == d.name) ? this.state.sourceData : this.state.sourceData.filter(d1 => {
// //                 d1 = d1[d.id];
// //                 d1 = (d1 == null) ? "" : d1.toString();
// //                 return d1 == e.target.value;
// //             });
// //         this.setState({
// //             filterData: filterData,
// //             displayData: filterData
// //         });
// //     }
// //
// //     tdCallback(id, value) {
// //         this.props[id + "TdCallback"](value);
// //     }
// //
// //     sort(id) {
// //         let sortDesc = this.state.sortDesc;
// //         if (this.state.sortColumnId == id) {
// //             sortDesc = !sortDesc;
// //         }
// //         let sortedData = this.state.displayData.concat();
// //         let regex = new RegExp(/^\d{4}-\d{2}-\d{2}$/g);
// //         if (sortDesc) {
// //             sortedData.sort((a, b) => {
// //                 let va, vb;
// //                 if (a[id] != null && b[id] != null && a[id].match(regex) != null && b[id].match(regex) != null) {
// //                     va = a[id];
// //                     vb = b[id];
// //                 } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
// //                     va = parseFloat(a[id]);
// //                     vb = parseFloat(b[id]);
// //                 } else {
// //                     va = (a[id] == null) ? "" : a[id];
// //                     vb = (b[id] == null) ? "" : b[id];
// //                 }
// //                 return va > vb ? 1 : -1;
// //             });
// //         } else {
// //             sortedData.sort((a, b) => {
// //                 let va, vb;
// //                 if (a[id] != null && b[id] != null && a[id].match(regex) != null && b[id].match(regex) != null) {
// //                     va = a[id];
// //                     vb = b[id];
// //                 } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
// //                     va = parseFloat(a[id]);
// //                     vb = parseFloat(b[id]);
// //                 } else {
// //                     va = (a[id] == null) ? "" : a[id];
// //                     vb = (b[id] == null) ? "" : b[id];
// //                 }
// //                 return va < vb ? 1 : -1;
// //             });
// //         }
// //
// //         this.setState({
// //             sortColumnId: id,
// //             sortDesc: sortDesc,
// //             displayData: sortedData
// //         });
// //     }
// //
// //     rowAllCheck() {
// //         let newData = this.state.displayData.map(d => {
// //             d.checkboxChecked = !this.state.rowAllChecked;
// //             return d;
// //         });
// //         this.setState({
// //             rowAllChecked: !this.state.rowAllChecked,
// //             displayData: newData
// //         });
// //     }
// //
// //     rowCheck(d) {
// //         let newData = this.state.displayData.map(d1 => {
// //             if (d1 == d) {
// //                 d1.checkboxChecked = !d1.checkboxChecked;
// //             }
// //             return d1;
// //         });
// //         this.setState({
// //             displayData: newData
// //         });
// //     }
// //
// //     backToMain() {
// //         this.setState({
// //             panel: "main"
// //         });
// //     }
// //
// //     create() {
// //         let data = {panel: "create", createReferTableData: []};
// //         if (this.props.createButtonCallback) {
// //             let checkedData = this.state.displayData.filter(d => {
// //                 return d.checkboxChecked;
// //             });
// //             if (checkedData.length != 0) {
// //                 this.props.createButtonCallback(checkedData).then(d => {
// //                     let defaultCreateValue = d.defaultData;
// //                     if (d.hasOwnProperty("displayData")) {
// //                         data.createReferTableData = d.displayData;
// //                     }
// //
// //                     let ct = defaultCreateValue.concat();
// //                     for (let i = 0; i < this.state.createLineNum; i++) {
// //                         if (defaultCreateValue[i]) {
// //                             this.state.columns.forEach(d1 => {
// //                                 if (!defaultCreateValue[i].hasOwnProperty(d1.id)) {
// //                                     ct[i][d1.id] = "";
// //                                 }
// //                             });
// //                         } else {
// //                             let row = {};
// //                             this.state.columns.forEach(d1 => {
// //                                 row[d1.id] = "";
// //                             });
// //                             ct.push(row);
// //                         }
// //                     }
// //                     data.ct = ct;
// //                     this.setState(data);
// //                 }).catch(d => {
// //                     this.setState(data);
// //                 });
// //             } else {
// //                 this.setState(data);
// //             }
// //         } else {
// //             this.setState(data);
// //         }
// //     }
// //
// //     createSubmit() {
// //         let rows = this.state.ct.filter(d => {
// //             let isEmpty = true;
// //             for (let k in d) {
// //                 if (d[k].trim() != "") {
// //                     isEmpty = false;
// //                     break;
// //                 }
// //             }
// //             return !isEmpty;
// //         });
// //         if (rows.length == 0) {
// //             alert("请至少填写一行数据");
// //             return;
// //         }
// //         if (confirm("你确认要提交以下" + rows.length + "行数据吗?")) {
// //             let data = {requestRowsLength: rows.length};
// //             this.state.columns.forEach(d => {
// //                 let v = rows.map(d1 => {
// //                     return d1[d.id];
// //                 });
// //                 data[d.id] = v;
// //             });
// //             let tableId = this.props.tableId;
// //             http.post("../table/" + tableId + "/create", data).then(d => {
// //                 this.refresh();
// //                 alert("提交成功");
// //                 this.setState({panel: "main"});
// //             }).catch(d => {
// //                 alert("提交失败:" + d);
// //             });
// //         }
// //     }
// //
// //     createTdChange(e, i, id) {
// //         let ct = this.state.ct;
// //         ct[i][id] = e.target.value;
// //         this.setState({
// //             ct: ct
// //         });
// //     }
// //
// //     update() {
// //         let checkedData = this.state.displayData.filter(d => {
// //             return d.checkboxChecked;
// //         });
// //         if (checkedData.length == 0) {
// //             alert("请至少选择一行数据");
// //             return;
// //         }
// //         let json = {
// //             panel: "update",
// //             ut: checkedData
// //         };
// //         checkedData.map((d, i) => {
// //             for (let k in d) {
// //                 json["ut" + i + "_" + k] = d[k];
// //             }
// //         });
// //         this.setState(json);
// //     }
// //
// //     updateSubmit() {
// //         let rows = this.state.ut;
// //         if (confirm("你确认要提交以下" + rows.length + "行数据吗?")) {
// //             let data = {requestRowsLength: rows.length};
// //             this.state.columns.forEach(d => {
// //                 let v = [];
// //                 for (let i = 0; i < rows.length; i++) {
// //                     v.push(this.state["ut" + i + "_" + d.id]);
// //                 }
// //                 data[d.id] = v;
// //             });
// //             let tableId = this.props.tableId;
// //             http.post("../table/" + tableId + "/update", data).then(d => {
// //                 this.refresh();
// //                 alert("提交成功");
// //                 this.setState({panel: "main"});
// //             }).catch(d => {
// //                 alert("提交失败:" + d);
// //             });
// //         }
// //     }
// //
// //     updateTdChange(e, i, id) {
// //         let json = {};
// //         json["ut" + i + "_" + id] = e.target.value;
// //         this.setState(json);
// //     }
// //
// //     delete() {
// //         let checkedData = this.state.displayData.filter(d => {
// //             return d.checkboxChecked;
// //         });
// //         if (checkedData.length == 0) {
// //             alert("请至少选择一行数据");
// //             return;
// //         }
// //         let data = {
// //             id: checkedData.map(d => {
// //                 return d.id;
// //             })
// //         };
// //         if (confirm("确定要删除以下勾选的" + checkedData.length + "行数据吗?")) {
// //             let tableId = this.props.tableId;
// //             http.post("../table/" + tableId + "/delete", data).then(d => {
// //                 this.refresh();
// //                 alert("删除成功");
// //             }).catch(d => {
// //                 alert("删除失败:" + d);
// //             });
// //         }
// //     }
// //
// //     attachment() {
// //         let checkedData = this.state.displayData.filter(d => {
// //             return d.checkboxChecked;
// //         });
// //         if (checkedData.length != 1) {
// //             alert("请选择一行数据");
// //             return;
// //         }
// //         let attachmentId = checkedData.map(d => {
// //             return d.id;
// //         })[0];
// //         this.setState({
// //             panel: "attachment",
// //             attachmentId: attachmentId
// //         });
// //         this.refreshAttachment(attachmentId);
// //     }
// //
// //     refreshAttachment(id) {
// //         let tableId = this.props.tableId;
// //         http.post("../table/" + tableId + "/attachmentRead", {id: id}).then(d => {
// //             this.setState({
// //                 panel: "attachment",
// //                 attachmentList: d
// //             });
// //         }).catch(d => {
// //             alert("获取附件列表失败:" + d);
// //         });
// //     }
// //
// //     deleteAttachment(d) {
// //         let id = this.state.attachmentId;
// //         let tableId = this.props.tableId;
// //         let data = {
// //             id: id,
// //             name: d
// //         };
// //         http.post("../table/" + tableId + "/attachmentDelete", data).then(d1 => {
// //             this.refreshAttachment(id);
// //             alert("删除成功");
// //         }).catch(d1 => {
// //             alert("删除失败:" + d1);
// //         })
// //     }
// //
// //     uploadAttachment(e) {
// //         let id = this.state.attachmentId;
// //         let tableId = this.props.tableId;
// //         upload.do("../table/" + tableId + "/attachmentUpload?id=" + id, e.target.parentNode.childNodes[0], d => {
// //             this.setState({
// //                 attachmentProgress: d + "%"
// //             });
// //         }).then(d => {
// //             this.refreshAttachment(id);
// //             alert("上传成功");
// //         }).catch(d => {
// //             alert("上传失败:" + d);
// //         });
// //     }
// // }
//
//
// module.exports = table;

import React from "react";
import css from "./index.scss";
import http from "karl-http";
import "font-awesome-webpack";
import Select from "karl-component-select";
import Datepicker from "karl-component-datepicker";


class table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableId: this.props.tableId,
            project: this.props.project,
            sectionStyle: this.props.sectionStyle ? this.props.sectionStyle : {}
        };

        let bindArr = [];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });

    }

    async componentDidMount() {
        try {
            let data = await request("init");
            console.log(data);
        } catch (e) {
            console.log("init table " + this.state.tableId + " failed");
        }
    }


    componentWillReceiveProps(nextProps) {

    }

    /**
     * 带jwt的http请求
     */
    async request(action, data) {
        data = (data == undefined) ? {} : data;
        let jwt = localStorage.getItem(this.state.project + "-jwt");
        // let promise = new Promise((resolve,reject)=>{
        //
        // });

        if (jwt == null) {
            location.href = "../login/";
        } else {
            let data = await http.post("../table/" + this.state.tableId + "/" + action, data);
            return data;
        }
    }

    render() {
        return (
            <div style={this.state.sectionStyle} className={css.base + " react-table"}>
                {
                    this.setTop()
                }
                {
                    this.setTable()
                }
                {
                    this.setBottom()
                }
            </div>
        );
    }

    setTop() {

    }

    setTable() {
        let dom = <div className={css.middle}>
            <table>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>;
        return dom;
    }

    setBottom() {

    }

}

module.exports = table;