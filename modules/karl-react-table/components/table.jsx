import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Select from "karl-component-select"

export default class MyComponent extends Component {

    static propTypes = {
        thClickCallback: PropTypes.func.isRequired,
        sortDesc: PropTypes.bool.isRequired,
        sortColumnId: PropTypes.string.isRequired
    }

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
                        this.props.thClickCallback(d.id)
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
                    let tdDom
                    let {style = {}, imageStyle = {}} = d1
                    if (d1.type === "image") {
                        tdDom = <td key={j} style={style}>
                            <img style={imageStyle} src={`images/${d[d1.id]}`}/>
                        </td>
                    } else {
                        let tdHtml = d[d1.id];
                        if (tdHtml) {
                            tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                        }
                        //当含有后缀并且不为空字符串时，附加后缀
                        if (d1.hasOwnProperty("suffix") && tdHtml !== "") {
                            tdHtml += d1.suffix
                        }
                        if (d1.hasOwnProperty("checked") && d1.checked === false) {
                            style.display = "none"
                        } else {
                            delete style.display
                        }
                        tdDom = <td key={j} style={style} dangerouslySetInnerHTML={{__html: tdHtml}}></td>
                    }

                    return tdDom
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