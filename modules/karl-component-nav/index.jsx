import React from "react";
import css from "./index.css";
import "font-awesome-webpack";
import $ from "jquery";


/**
 * react左侧菜单导航组件
 * data：菜单json数组，例如{id:"a",name:"啊",group:"哈",dom:<div>1</div>}
 *       id表示该菜单的id，用户锚点定位
 *       name表示菜单显示的文本
 *       group表示该二级菜单所属的一级菜单，如果没有group属性，表示自身是一级菜单
 *       dom表示该菜单对应的dom
 * sectionStyle：section自带的样式，可用于设置边距，例如{padding:"50px"}
 *
 * 示例：
 * <Nav sectionStyle={{padding:"50px"}} data={[
 *     {id: "a", name: "gasga", group: "1级菜单a", dom: <div>fasfs</div>},
 *     {id: "e", name: "sagas", dom: <div>afafs</div>},
 *     {id: "b", name: "safas", group: "1级菜单a", dom: <div>4324</div>},
 *     {id: "c", name: "gasgsa", group: "1级菜单b", dom: <div>43q4</div>},
 *     {id: "d", name: "gas12rgsa", group: "1级菜单b", dom: <div>123</div>},
 *     {id: "f", name: "sagas1", dom: <div>1wrq</div>}
 * ]}/>
 */
class nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activeDom: "",
            activeId: ""
        };
        let bindArr = [];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        //设置菜单和内容的宽度和高度自适应
        $(document).ready(()=>{
            this.setSize();
        });

        window.addEventListener("resize", e => {
            this.setSize();
        });

        let data = this.props.data;
        let activeId = data[0].id;
        let activeDom = data[0].dom;

        let json = {
            data: data,
            activeId: activeId,
            activeDom: activeDom
        };

        //根据锚点设置默认选中的菜单
        let hash = window.location.hash.replace(/#/g, "");
        if (hash != "") {
            let active = data.find(d => {
                return d.id == hash;
            });
            if (active != undefined) {
                json.activeId = hash;
                json["group-show-" + active.group] = true;
            }
        }

        this.setState(json);

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <div className={css.base + " react-nav"} ref={d => {
                this.base = d;
            }}>
                <div className={css.menu} ref={d => {
                    this.menu = d;
                }}>
                    {
                        this.setMenu()
                    }
                </div>
                <div style={this.props.sectionStyle == undefined ? {} : this.props.sectionStyle} className={css.content}
                     ref={d => {
                         this.content = d;
                     }}>
                    {
                        this.setContent()
                    }
                </div>
            </div>
        );
    }

    setSize() {
        let marginTop = $(this.base).offset().top;
        let height = $(window).height() - marginTop;
        let width = $(window).outerWidth(true) - 200;
        $(this.menu).css({height: height});
        $(this.content).css({
            height: height,
            width: width
        });
    }

    setMenu() {
        let groups = [];
        this.state.data.forEach(d => {
            if (!groups.includes(d.group)) {
                groups.push(d.group);
            }
        });

        let liArr = [];
        this.state.data.forEach(d => {
            if (d.hasOwnProperty("group")) {
                //如果含有group,判断是否添加过该group
                let hasInclude = liArr.find(d1 => {
                    return d1.group == d.group;
                });

                if (hasInclude != undefined) {
                    //如果添加过该group,则将新的数据合并到该一级菜单下
                    let li = <div onClick={() => {
                        this.setState({
                            activeId: d.id
                        });
                    }} key={d.id} className={this.state.activeId == d.id ?
                        (css.active + " " + css.li + " " + css.li1) : (css.li + " " + css.li1)}>{d.name}</div>;
                    liArr = liArr.map(d1 => {
                        if (d1.group == d.group) {
                            let arr = d1.dom.concat();
                            arr.push(li);
                            d1.dom = arr;
                            return d1;
                        } else {
                            return d1;
                        }
                    })
                } else {
                    //如果没有添加过group,则新添加一个一级菜单
                    let li = <div onClick={() => {
                        this.setState({
                            activeId: d.id
                        });
                    }} key={d.id} className={this.state.activeId == d.id ?
                        (css.active + " " + css.li + " " + css.li1) : (css.li + " " + css.li1)}>{d.name}</div>;
                    liArr.push({group: d.group, dom: [li]})
                }
            } else {
                //如果不含有group属性，则为第一级菜单
                let li = <div className={this.state.activeId == d.id ? (css.active + " " + css.li) : css.li}
                              onClick={() => {
                                  this.setState({
                                      activeId: d.id
                                  });
                              }}>
                    {d.name}
                </div>;
                liArr.push({dom: li});
            }
        });

        let menu = liArr.map((d, i) => {
            let showName = "group-show-" + d.group;
            if (d.hasOwnProperty("group")) {
                return <div key={i}>
                    <div className={css.li} onClick={() => {
                        let json = {};
                        json[showName] = !this.state[showName];
                        this.setState(json);
                    }}><i
                        className={this.state[showName] ? "fa fa-caret-down" : "fa fa-caret-right"}></i>{d.group}
                    </div>
                    <div style={this.state[showName] ? {} : {display: "none"}}>{d.dom}</div>
                </div>
            } else {
                return <div key={i}>{d.dom}</div>;
            }
        });
        return menu;

    }

    setContent() {
        let active = this.state.data.find(d => {
            return d.id == this.state.activeId;
        });
        if (active != undefined) {
            window.location.hash = active.id;
        }

        return this.state.data.map((d, i) => {
            return <div key={i} style={d.id == this.state.activeId ? {} : {display: "none"}}>{d.dom}</div>;
        });
    }

}

module.exports = nav;