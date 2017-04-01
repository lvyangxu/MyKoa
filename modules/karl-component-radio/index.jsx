import React from "react";
import css from "./index.css";
import "font-awesome-webpack";
import http from "karl-http";

/**
 * react单选组件
 * data:单选值数组，元素可为数字或字符串
 * defaultBlank:如果该属性存在,组件input框显示的默认值为"",否则显示option的第一个元素的值
 * callback：值改变时执行的回调，参数为当前的值
 * initCallback：初始化后执行的回调，参数为当前的值
 * value：初始值
 * prefix：控件显示文字的前缀
 * suffix：控件显示文字的后缀
 * 示例：
 * <Radio defaultBlank data=[1,"asaga","根深蒂固"]/>
 */
class radio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelShow: false,
            sourceData: [],
            value: "",
            filterData: [],
            pageData: [],
            filterValue: "",
            pageIndex: 0
        };
        let bindArr = ["panelToggle", "filterChange", "select", "setOptionHtml", "slicePageData"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        if (this.props.url != undefined) {
            http.post(this.props.url).then(d => {
                let pageData = this.slicePageData(d, 0);
                let value = "";
                if (this.props.value == undefined) {
                    value = (this.props.defaultBlank != undefined) ? "" : d[0];
                } else {
                    value = this.props.value;
                }

                this.setState({
                    value: value,
                    sourceData: d,
                    filterData: d,
                    pageData: pageData
                });
            }).catch(d => {
                console.log("init radio failed:" + d);
            });

        } else {
            let data = this.props.data;
            let pageData = this.slicePageData(data, 0);
            let value = "";
            if (this.props.value == undefined) {
                value = (this.props.defaultBlank != undefined) ? "" : data[0];
            } else {
                value = this.props.value;
            }
            this.setState({
                value: value,
                sourceData: data,
                filterData: data,
                pageData: pageData
            }, ()=> {
                if (this.props.initCallback) {
                    this.props.initCallback(this.state.value);
                }
            });
        }


        window.addEventListener("click", () => {
            if (this.state.panelShow) {
                this.setState({panelShow: false});
            }
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    render() {
        let prefix = (this.props.hasOwnProperty("prefix") ? this.props.prefix : "");
        let suffix = (this.props.hasOwnProperty("suffix") ? this.props.suffix : "");
        return (
            <div className={css.base + " react-radio"}>
                <div className={css.display} onClick={this.panelToggle}>
                    {`${prefix}${this.state.value}${suffix}`}
                    <i className="fa fa-caret-down"></i>
                </div>
                <div className={css.panel}
                     onClick={(e) => {
                         e.stopPropagation();
                     }}
                     style={(this.state.panelShow) ? {} : {display: "none"}}>
                    <div className={css.filter}>
                        <input onChange={this.filterChange}
                               value={this.state.filterValue}
                               placeholder="filter"/>
                    </div>
                    <div className={css.options}>
                        {
                            this.state.pageData.map((d, i) => {
                                return <div key={i} className={css.option} onClick={() => {
                                    this.select(d)
                                }} dangerouslySetInnerHTML={this.setOptionHtml(d)}></div>
                            })
                        }
                        <div className={css.page}>
                            <button className={css.pageLeft} onClick={() => {
                                this.pageToStart();
                            }}>
                                <i className="fa fa-angle-double-left"></i>
                            </button>
                            <button className={css.pageLeft} onClick={() => {
                                this.pageLeft();
                            }}>
                                <i className="fa fa-angle-left"></i>
                            </button>
                            {(this.state.pageIndex + 1) + "/" + ((Math.ceil(this.state.filterData.length / 10) == 0)
                                ? 1 : Math.ceil(this.state.filterData.length / 10))}
                            <button className={css.pageRight} onClick={() => {
                                this.pageRight();
                            }}>
                                <i className="fa fa-angle-right"></i>
                            </button>
                            <button className={css.pageRight} onClick={() => {
                                this.pageToEnd();
                            }}>
                                <i className="fa fa-angle-double-right"></i>
                            </button>
                        </div>
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

    filterChange(e) {
        let filterData = this.state.sourceData.filter(d => {
            return d.toString().includes(e.target.value);
        });
        let pageData = this.slicePageData(filterData, 0);
        this.setState({
            filterValue: e.target.value,
            pageIndex: 0,
            filterData: filterData,
            pageData: pageData
        });
    }

    select(d) {
        this.setState({
            panelShow: false,
            value: d
        });

        if (this.props.callback) {
            this.props.callback(d);
        }
    }

    setOptionHtml(d) {
        d = d.toString();
        let v = this.state.filterValue;
        let regex = new RegExp(v, "g");
        if (v == "") {
            return {__html: d};
        } else {
            let result = d.toString().replace(regex, () => {
                return "<strong>" + v + "</strong>";
            });
            return {__html: result};
        }
    }

    slicePageData(data, i) {
        let filterData = data;
        let start = i * 10;
        let end = i * 10 + 10;
        end = end > filterData.length ? filterData.length : end;
        let columnData = filterData.slice(start, end);
        return columnData;
    }

    pageLeft() {
        let i = this.state.pageIndex;
        if (i != 0) {
            i--;
        }
        this.setState({
            pageIndex: i,
            pageData: this.slicePageData(this.state.filterData, i)
        });
    }

    pageRight() {
        let i = this.state.pageIndex;
        let end = Math.ceil(this.state.filterData.length / 10);
        if (i < end - 1) {
            i++;
        }
        this.setState({
            pageIndex: i,
            pageData: this.slicePageData(this.state.filterData, i)
        });
    }

    pageToStart() {
        let i = 0;
        this.setState({
            pageIndex: i,
            pageData: this.slicePageData(this.state.filterData, i)
        });
    }

    pageToEnd() {
        let end = Math.ceil(this.state.filterData.length / 10);
        let i = end - 1;
        this.setState({
            pageIndex: i,
            pageData: this.slicePageData(this.state.filterData, i)
        });
    }

}

module.exports = radio;