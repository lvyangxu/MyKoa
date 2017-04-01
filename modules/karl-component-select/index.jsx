import React from "react";
import css from "./index.css";
import "font-awesome-webpack";

/**
 * react多选组件
 * text:显示的文字
 * data:值得json数组,例如{id:string,name:string,checked:boolean}
 * optionNumPerColumn:每一列显示option的数量，默认为10
 * lang:界面语言,en或ch，默认为en
 * callback:值改变后的回调，参数为值改变后对应的data数组
 * initCallback：初始化后执行的回调，参数为data数组
 *
 * 示例：
 * <Select text="呵呵" data=[
 *         {id:"a",name:"大概",checked:true},
 *         {id:"b",name:"asf",checked:true},
 *         {id:"c",name:"sf方式",checked:false},
 *     ] optionNumPerColumn={5} lang="ch" callback={d=>{
 *         console.log("data array is");
 *         console.log(data);
 *     }}/>
 */
class select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelShow: false,
            data: [],
            allChecked: false,
            optionNumPerColumn: this.props.optionNumPerColumn ? this.props.optionNumPerColumn : 10,
            lang: this.props.lang == "ch" ? "ch" : "en"
        };
        let bindArr = ["panelToggle", "setData", "check", "allCheck"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let data = this.setData(this.props.data);
        this.setState({data: data});

        window.addEventListener("click", () => {
            if (this.state.panelShow) {
                this.setState({panelShow: false});
            }
        }, false);
        if (this.props.initCallback) {
            let sourceData = [];
            data.forEach(d => {
                d.forEach(d1 => {
                    sourceData.push(d1);
                });
            });
            this.props.initCallback(sourceData);
        }
    }

    componentWillReceiveProps(nextProps) {
        let data = this.setData(nextProps.data);
        this.setState({data: data});
    }

    render() {
        return (
            <div className={css.base + " react-select"}>
                <div className={css.input} onClick={this.panelToggle}>
                    {this.props.text}<i className="fa fa-caret-down"></i>
                </div>
                <div className={css.panel} style={(this.state.panelShow) ? {} : {display: "none"}}
                     onClick={(e) => {
                         e.stopPropagation();
                     }}>
                    <div className={css.allCheck}>
                        <input type="checkbox" onChange={(e) => {
                            this.allCheck(e);
                        }} checked={this.state.allChecked}/>
                        <label>
                            {this.state.lang == "ch" ? "全选" : "check all"}
                        </label>
                    </div>
                    <div className={css.options}>
                        {
                            this.state.data.map((d, i) => {
                                return <div key={i} className={css.column}>
                                    {
                                        d.map((d1, j) => {
                                            return <div className={css.option} key={j}>
                                                <input type="checkbox" onChange={(e) => {
                                                    this.check(e, d1.id);
                                                }} checked={d1.checked}/><label>{d1.name}</label>
                                            </div>;
                                        })
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    panelToggle(e) {
        e.stopPropagation();
        this.setState({
            panelShow: !this.state.panelShow
        });
    }

    setData(d) {
        let columnDataArr = [];
        let num = this.state.optionNumPerColumn;
        for (let i = 0; i < d.length; i = i + num) {
            let end = (i + num) > d.length ? d.length : i + num;
            let columnData = d.slice(i, end);
            columnDataArr.push(columnData);
        }
        return columnDataArr;
    }

    check(e, id) {
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode.focus();
        let data = this.state.data.map(d => {
            d = d.map(d1 => {
                if (d1.id == id) {
                    d1.checked = !d1.checked;
                }
                return d1;
            });
            return d;
        });
        this.setState({
            data: data
        });
        if (this.props.callback) {
            let sourceData = [];
            this.state.data.forEach(d => {
                d.forEach(d1 => {
                    sourceData.push(d1);
                });
            });
            this.props.callback(sourceData);
        }
    }

    allCheck(e) {
        e.target.parentNode.parentNode.parentNode.focus();
        let isAllChecked = !this.state.allChecked;
        let data = this.state.data.map(d => {
            d.map(d1 => {
                d1.checked = isAllChecked;
            });
            return d;
        });
        this.setState({
            allChecked: isAllChecked,
            data: data
        });
        if (this.props.callback) {
            let sourceData = [];
            this.state.data.forEach(d => {
                d.forEach(d1 => {
                    sourceData.push(d1);
                });
            });
            this.props.callback(sourceData);
        }
    }
}

module.exports = select;