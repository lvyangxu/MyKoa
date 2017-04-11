import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"

export default class MyComponent extends Component {

    static propTypes = {}

    static defaultProps = {
        columns: [],
    }

    render() {
        let thead = <thead>
        <tr>
            {
                this.props.columns.map((d, i) => {
                    let style = d.hasOwnProperty("thStyle") ? d.thStyle : {};
                    if (d.hasOwnProperty("checked") && d.checked === false) {
                        style.display = "none";
                    }
                    let th = <th key={i} style={style} onClick={() => {
                        let json = this.sort(d.id);
                        json.displayData = this.setDisplayData(json.sortedData);
                        this.setState(json);
                    }}>{d.name}
                        {
                            this.props.sortColumnId === d.id ? (
                                <i className={classnames("fa", {
                                    "fa-caret-up": this.props.sortDesc,
                                    "fa-caret-down": !this.props.sortDesc
                                })}></i>
                            ) : ""
                        }
                    </th>;
                    return th;
                })
            }
        </tr>
        </thead>;
        let tbody = <tbody>
        {
            this.props.displayData.map((d, i) => {
                let tds = this.props.columns.map((d1, j) => {
                    let tdHtml = d[d1.id];
                    if (tdHtml) {
                        tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                    }
                    //当含有后缀并且不为空字符串时，附加后缀
                    if (d1.hasOwnProperty("suffix") && tdHtml !== "") {
                        tdHtml += d1.suffix;
                    }
                    let style = d1.hasOwnProperty("tdStyle") ? d1.tdStyle : {};
                    if (d1.hasOwnProperty("checked") && d1.checked === false) {
                        style.display = "none";
                    } else {
                        delete style.display;
                    }
                    return <td key={j} style={style}
                               dangerouslySetInnerHTML={{__html: tdHtml}}></td>
                });
                let tr = <tr key={i}>{tds}</tr>;
                return tr;
            })
        }
        </tbody>;
        let dom = <div className={css.table}>
            <table>
                {
                    thead
                }
                {
                    tbody
                }
            </table>
        </div>;
        return dom;
    }
}