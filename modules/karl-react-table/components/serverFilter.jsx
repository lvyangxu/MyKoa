import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"

export default class MyComponent extends Component {

    static propTypes = {
        read: PropTypes.func.isRequired

    }

    static defaultProps = {
        serverFilter: [],
    }

    render() {
        let loadingJson = {}
        loadingJson[css.loading] = this.props.isLoading

        return (
            <div className={css.serverFilter}>
                {
                    this.props.serverFilter.map(d => {
                        let condition
                        //设置条件筛选的默认日期
                        let [add, startAdd, endAdd] = [0, -7, 0]
                        if (d.type === "rangeMonth") {
                            startAdd = -1
                        }
                        if (d.type === "rangeSecond") {
                            startAdd = -60 * 60 * 24 * 7
                        }
                        if (d.hasOwnProperty("dateAdd")) {
                            let dateAdd = d.dateAdd
                            add = dateAdd.hasOwnProperty("add") ? dateAdd.add : add
                            startAdd = dateAdd.hasOwnProperty("startAdd") ? dateAdd.startAdd : startAdd
                            endAdd = dateAdd.hasOwnProperty("endAdd") ? dateAdd.endAdd : endAdd
                        }
                        let {placeholder = d.name} = d
                        let requiredJson = {}
                        requiredJson[css.required] = d.required
                        switch (d.type) {
                            case "input":
                                condition = <div className={css.section}>
                                    <input className={classnames(css.filter, requiredJson)}
                                           placeholder={placeholder} type="text"
                                           value={this.props[d.id + "Condition"]}
                                           onChange={e => {
                                               this.props.serverFilterChangeCallback(d.id + "Condition", e.target.value)
                                           }}/>
                                </div>;
                                break;
                            case "integer":
                                condition = <div className={css.section}>
                                    <input className={css.filter + requiredClassName} placeholder={placeholder} min="0"
                                           type="number"
                                           value={this.props[d.id + "Condition"]}
                                           onChange={e => {
                                               this.props.serverFilterChangeCallback(d.id + "Condition", e.target.value)
                                           }}/>
                                </div>;
                                break;
                            case "radio":
                                condition = <div className={css.section}>
                                    <Radio data={d.data} prefix={d.name + " : "} initCallback={d1 => {
                                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                                    }} callback={d1 => {
                                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                                    }}/>
                                </div>;
                                break;
                            case "day":
                            case "month":
                            case "second":
                                condition = <div className={css.section}>
                                    <Datepicker type={d.type} add={add} initCallback={d1 => {
                                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                                    }} callback={d1 => {
                                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                                    }}/>
                                </div>;
                                break;
                            case "rangeDay":
                            case "rangeMonth":
                            case "rangeSecond":
                                let type;
                                switch (d.type) {
                                    case "rangeDay":
                                        type = "day";
                                        break;
                                    case "rangeMonth":
                                        type = "month";
                                        break;
                                    case "rangeSecond":
                                        type = "second";
                                        break;
                                }
                                condition = <div style={{display: "inline-block"}}>
                                    <div className={css.section}>
                                        <Datepicker type={type} add={startAdd} initCallback={d1 => {
                                            this.props.serverFilterChangeCallback(d.id + "ConditionStart", d1);
                                        }} callback={d1 => {
                                            this.props.serverFilterChangeCallback(d.id + "ConditionStart", d1);
                                        }}/>
                                    </div>
                                    <div className={css.section}>
                                        <Datepicker type={type} add={endAdd} initCallback={d1 => {
                                            this.props.serverFilterChangeCallback(d.id + "ConditionEnd", d1);
                                        }} callback={d1 => {
                                            this.props.serverFilterChangeCallback(d.id + "ConditionEnd", d1);
                                        }}/>
                                    </div>
                                </div>;
                                break;
                            case "select":
                                condition = <div className={css.section}>
                                    <Select data={d.data} text={d.name} initCallback={d1 => {
                                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                                    }} callback={d1 => {
                                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                                    }}/>
                                </div>;
                                break;
                        }
                        return condition;
                    })
                }
                <div className={css.section}>
                    <button className={classnames(css.filter, loadingJson) }
                            onClick={this.props.read} disabled={this.props.isLoading}>
                        <i className={classnames("fa fa-refresh", loadingJson)}></i>刷新
                    </button>
                </div>
                <div className={css.section}>
                    <button className={css.filter} onClick={this.download}>
                        <i className="fa fa-download"></i>导出
                    </button>
                </div>
            </div>
        )
    }
}