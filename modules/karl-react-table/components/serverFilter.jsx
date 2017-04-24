import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"
import Datepicker from "karl-component-datepicker"

class MyComponent extends Component {

    static propTypes = {}

    condition(d, i) {
        let conditionDom
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
                conditionDom = <div className={css.section} key={i}>
                    <input className={classnames(css.filter, requiredJson)}
                           placeholder={placeholder} type="text"
                           value={this.props[d.id + "Condition"]}
                           onChange={e => {
                               this.props.serverFilterChangeCallback(d.id + "Condition", e.target.value)
                           }}/>
                </div>;
                break;
            case "integer":
                conditionDom = <div className={css.section} key={i}>
                    <input className={css.filter + requiredClassName} placeholder={placeholder} min="0"
                           type="number"
                           value={this.props[d.id + "Condition"]}
                           onChange={e => {
                               this.props.serverFilterChangeCallback(d.id + "Condition", e.target.value)
                           }}/>
                </div>;
                break;
            case "radio":
                conditionDom = <div className={css.section} key={i}>
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
                conditionDom = <div className={css.section} key={i}>
                    {d.name + "："}
                    <Datepicker prefix={d.name} type={d.type} add={add} initCallback={d1 => {
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
                conditionDom = <div style={{display: "inline-block"}} key={i}>
                    <div className={css.section}>
                        {d.name + "开始："}
                        <Datepicker type={type} add={startAdd} initCallback={d1 => {
                            this.props.serverFilterChangeCallback(d.id + "ConditionStart", d1);
                        }} callback={d1 => {
                            this.props.serverFilterChangeCallback(d.id + "ConditionStart", d1);
                        }}/>
                    </div>
                    <div className={css.section}>
                        {d.name + "结束："}
                        <Datepicker type={type} add={endAdd} initCallback={d1 => {
                            this.props.serverFilterChangeCallback(d.id + "ConditionEnd", d1);
                        }} callback={d1 => {
                            this.props.serverFilterChangeCallback(d.id + "ConditionEnd", d1);
                        }}/>
                    </div>
                </div>;
                break;
            case "select":
                conditionDom = <div className={css.section} key={i}>
                    <Select data={d.data} text={d.name} initCallback={d1 => {
                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                    }} callback={d1 => {
                        this.props.serverFilterChangeCallback(d.id + "Condition", d1);
                    }}/>
                </div>;
                break;
        }
        return conditionDom
    }

    render() {
        return (
            <div className={css.serverFilter}
                 style={this.props.serverFilter.length === 0 ? {} : {marginBottom: "20px"}}>
                {
                    this.props.serverFilter.map((d, i) => {
                        return this.condition(d, i);
                    })
                }
            </div>
        )
    }
}

let mapStateToProps = state => {
    let props = Object.assign({}, state, {})
    return props
}

let mapDispatchToProps = dispatch => ({
    //监听服务器控件状态变化
    serverFilterChangeCallback: (id, value) => {
        dispatch({type: "CHANGE_SERVER_FILTER", id: id, value: value})
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)