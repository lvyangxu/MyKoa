import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Radio from "karl-react-radio"

export default class MyComponent extends Component {
    static propTypes = {
        itemList: PropTypes.array.isRequired,
        currentItemList: PropTypes.array.isRequired,
        addButtonClickCallback: PropTypes.func.isRequired,
        currentItemChangeCallback: PropTypes.func.isRequired,
    }

    render() {
        let valueArr = this.props.currentItemList.map(d => {
            return d.value
        })
        let totalValue = 0
        if (valueArr.length > 0) {
            totalValue = valueArr.reduce((a, b) => {
                return a + b
            })
        }
        return (
            <div className={css.itemBundleCreate}>
                <h2>创建礼包</h2>
                <div className={css.row}>
                    <h3 className={css.title}>礼包名称</h3>
                    <div><input className={css.input} placeholder="请输入礼包名称"/></div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>礼包内容</h3>
                    <div className={css.itemAction}>
                        <button className={css.button} onClick={this.props.addButtonClickCallback}>
                            <i className="fa fa-plus"></i>添加更多物品
                        </button>
                    </div>
                    <div className={css.table}>
                        <table>
                            <thead>
                            <tr>
                                <th style={{minWidth: "200px"}}>物品名称</th>
                                <th>图片</th>
                                <th>数量</th>
                                <th>换算成水晶价值</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.currentItemList.map((d, i) => {
                                    let dataArr = this.props.itemList.map(d1 => {
                                        return d1.name
                                    })
                                    return <tr key={i}>
                                        <td>
                                            <Radio data={dataArr} initValue={d.name} callback={d2 => {
                                                this.props.currentItemChangeCallback(d2, i)
                                            }}/>
                                        </td>
                                        <td>
                                            <img style={{height: "40px"}} src={`images/${d.image}`}/>
                                        </td>
                                        <td>
                                            <input type="number" min="1" className={css.input}/>
                                        </td>
                                        <td>
                                            <label>{d.value}</label>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div>总价值:{totalValue}水晶</div>
                </div>
                <div className={css.row}>
                    <button className={classnames(css.button, css.submit)}>保存</button>
                    <button className={css.button}>取消</button>
                </div>
            </div>
        )
    }
}