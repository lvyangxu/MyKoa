import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"

export default class MyComponent extends Component {

    static propTypes = {
        columnFilterChangeCallback: PropTypes.func.isRequired,
        rowFilterValue: PropTypes.string.isRequired,
        rowFilterChangeCallback: PropTypes.func.isRequired,
        pageIndexChangeCallback: PropTypes.func.isRequired,
        pageArr: PropTypes.array.isRequired,
    }

    static defaultProps = {
        pageArr: [],
        columns: [],
    }

    render() {
        return (
            <div className={css.clientFilter}>
                <div className={css.section}>
                    <Select data={this.props.columns} text="列过滤" callback={this.props.columnFilterChangeCallback}/>
                </div>
                <div className={css.section}>
                    <input className={css.rowFilter} placeholder="行过滤" value={this.props.rowFilterValue}
                           onChange={e => {
                               this.props.rowFilterChangeCallback(e.target.value)
                           }}/>
                </div>
                <div className={css.section}>
                    <select className={css.page} value={this.props.pageIndex} onChange={e => {
                        this.props.pageIndexChangeCallback(e.target.value)
                    }}>
                        {
                            this.props.pageArr.map((d, i) => {
                                return <option key={i} value={d}>{d}</option>
                            })
                        }
                    </select>
                    <label>共{this.props.pageArr.length}页</label>
                </div>
            </div>
        )
    }
}