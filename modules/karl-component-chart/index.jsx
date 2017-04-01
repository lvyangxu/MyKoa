import React from "react";
import css from "./index.css";
import "karl-extend";
import $ from "jquery";

/**
 * react图表组件
 * title：顶部的文字
 * yAxisText: Y轴左边的文字，如果为undefined则显示为""
 * tipsSuffix：tips的后缀文字
 * type: 图表类型curve或bar，默认为curve
 * x: 代表x轴的id
 * y: 代表y轴的json，例如{id:id,name:name}
 * data: 包含x轴id和y轴所有或部分id的json(未被包含的id值默认为0)，例如{"x":1,"y1":4,"y2":5}
 * group：柱状图的分组id数组,例如["a","b"]
 * xAxisGroupNum：x轴数字分组的基数，较小的轴求余，较大的轴求除，对日期无效
 *
 * 示例：
 * <Chart title="chart" yAxisText="kg" x="date" group={["region","server"]} y={[
 *               {id: "apple", name: "apple"},
 *               {id: "banana", name: "banana"},
 *               {id: "pear", name: "pear"}
 *           ]} data={[
 *               {date: "2016-9-11", apple: 1, banana: 2, pear: 3,region:"china",server:2},
 *               {date: "2016-9-13", apple: 0.03, banana: 3, pear: 2,region:"china",server:3},
 *               {date: "2016-9-12", apple: 5, banana: 47,region:"japan",server:2},
 *               {date: "2016-9-14", apple: 0.05, banana: 7, pear: 4,region:"japan",server:2},
 *               {date: "2016-9-15", apple: 0.08, banana: 6,region:"china",server:2}
 *           ]}/>
 *
 */
class chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            x: this.props.x,
            xAxisArr: [],
            y: [],
            xUnitLength: 0,
            seriesData: [],
            yAxisNumArr: [],
            title: this.props.title,
            yAxisText: this.props.yAxisText == undefined ? "" : this.props.yAxisText,
            type: this.props.type ? this.props.type : "curve",
            angleNum: this.props.angleNum ? this.props.angleNum : 12,
            endPointLineLength: this.props.endPointLineLength ? this.props.endPointLineLength : 0.1,
            tipsRaisedX: 0.2,
            tipsRaisedY: 0.2,
            tipsMarginBottom: 1,
            tipsPaddingTop: 1,
            tipsPaddingBottom: 1,
            tipsPaddingLeft: 1,
            tipsPaddingRight: 1,
            viewBoxWidth: 115,
            viewBoxHeight: 65,
            isInAxis: false
        };
        let bindArr = ["sortData", "vectorTransformToSvg", "xTransformToSvg", "yTransformToSvg", "yTransformToNatural",
            "getYAxisNumArr", "setActive", "getNearestSeries", "setColor", "setTipsBorder", "doUpdate", "setSvgAnimate", "mouseLeave"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.doUpdate();
    }

    doUpdate() {
        let data = this.sortData(this.state.data);
        let xValueArr = [];
        let xAxisArr = data.filter(d=> {
            if (xValueArr.includes(d[this.state.x])) {
                return false;
            } else {
                xValueArr.push(d[this.state.x]);
                return true;
            }
        }).map(d=> {
            return d[this.state.x];
        });

        //根据group属性对data进行分组求和,计算正数和负数的最大最小值
        let groupData = [];
        data.forEach(d=> {
            let hasSameGroup = groupData.some(d1=> {
                let isSameGroup = this.props.group ? (this.props.group.every(d2=> {
                    return d1[d2] == d[d2];
                })) : true;
                return d1[this.state.x] == d[this.state.x] && isSameGroup;
            });
            if (hasSameGroup) {
                //对包含在y中的系列值进行求和
                for (let k in d) {
                    let isSeries = this.props.y.some(d2=> {
                        return k == d2.id;
                    });
                    if (isSeries) {
                        groupData = groupData.map(d1=> {
                            let isSameGroup = this.props.group ? (this.props.group.every(d2=> {
                                return d1[d2] == d[d2];
                            })) : true;
                            if (d1[this.state.x] == d[this.state.x] && isSameGroup) {
                                d1[k] = d1[k] + d[k];
                            }
                            return d1;
                        });
                    }
                }
            } else {
                let json = Object.assign({}, d);
                groupData.push(json);
            }
        });


        let yAxisNumArr = this.getYAxisNumArr(groupData, this.state.type);
        this.setState({
                xAxisArr: xAxisArr,
                xUnitLength: 100 * 0.8 / xAxisArr.length,
                yAxisNumArr: yAxisNumArr,
                yUnitLength: 50 * 0.8 / (yAxisNumArr.length - 1),
            }, ()=> {
                let seriesData = this.buildSeries(groupData, this.props.y);
                this.setState({
                    seriesData: seriesData,
                }, ()=> {
                    this.setSvgAnimate();
                });
            }
        )
    }

    /**
     * 设置svg绘制的动画
     */
    setSvgAnimate() {
        let ua = window.navigator.userAgent;
        if (ua.includes("Trident/7.0") || ua.includes("MSIE ")) {
            this.setState({
                isIE: true,
                svgWidth: $(this.svg).width(),
                svgHeight: $(this.svg).width() * this.state.viewBoxHeight / this.state.viewBoxWidth
            });
        } else {
            switch (this.state.type) {
                case "curve":
                    this.state.seriesData.forEach(d => {
                        let length = this["curve" + d.id].getTotalLength();
                        $(this["curve" + d.id]).css({
                            "stroke-dasharray": length,
                            "stroke-dashoffset": length
                        });
                        $(this["curve" + d.id]).animate({"stroke-dashoffset": "0px"}, 1000, "linear");
                    });
                    break;
                case "bar":
                    this.state.seriesData.forEach(d => {
                        this.state.xAxisArr.forEach((d1, i)=> {
                            let barRef = this["bar" + d.id + i];
                            if (barRef) {
                                let length = barRef.getTotalLength();
                                //计算bar的宽度
                                let w = this.state.xUnitLength;
                                let baseIdArr = [];
                                this.state.seriesData.forEach(d=> {
                                    if (!baseIdArr.includes(d.baseId)) {
                                        baseIdArr.push(d.baseId);
                                    }
                                });
                                let barWidth = w / ((baseIdArr.length + 2) * 1.5);

                                $(barRef).css({
                                    "stroke-dasharray": length,
                                    "stroke-dashoffset": length,
                                    "stroke-width": "0px"
                                });
                                $(barRef).animate({
                                    "stroke-dashoffset": "0px",
                                    "stroke-width": barWidth + "px"
                                }, 1000, "linear");
                            }
                        });
                    });
                    break;
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data != nextProps.data) {
            this.setState({
                data: nextProps.data
            }, ()=> {
                this.doUpdate();
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //设置tips的宽度和高度
        if (!((prevState.tipsX == this.state.tipsX) && (prevState.tipsY == this.state.tipsY)) && this.state.tipsX && this.state.tipsY) {
            let w = $(this.tipsText).width() / $(this.svg).width() * this.state.viewBoxWidth;
            w = w.toFixed(2);
            w = Number.parseFloat(w);
            let h = $(this.tipsText).height() / $(this.svg).height() * this.state.viewBoxHeight;
            h = h.toFixed(2);
            h = Number.parseFloat(h);
            this.setState({
                tipsWidth: w,
                tipsHeight: h
            });
        }
    }

    render() {
        let svgChild =
            <g>
                {
                    this.setXAxis()
                }
                {
                    this.setYAxis()
                }
                {
                    this.setXGrid()
                }
                {
                    this.setData()
                }
                {
                    this.setDots()
                }
                {
                    this.setDeclare()
                }
                {
                    this.setTips()
                }
            </g>;


        let svgTag = this.state.svgWidth ?
            <svg viewBox={`0 0 ${this.state.viewBoxWidth} ${this.state.viewBoxHeight}`} width={this.state.svgWidth}
                 height={this.state.svgHeight}
                 onMouseMove={this.setActive}
                 onMouseLeave={this.mouseLeave}
                 ref={(svg) => {
                     this.svg = svg;
                 }}>
                {
                    svgChild
                }
            </svg> :
            <svg viewBox={`0 0 ${this.state.viewBoxWidth} ${this.state.viewBoxHeight}`} onMouseMove={this.setActive}
                 onMouseLeave={this.mouseLeave}
                 ref={(svg) => {
                     this.svg = svg;
                 }}>
                {
                    svgChild
                }
            </svg>;
        let titleStyle = {}, resetColorStyle = {};
        if ($(this.svg).width() != undefined) {
            let width = $(this.svg).width() / this.state.viewBoxWidth;
            titleStyle = {width: width * 80, marginLeft: width * 10};
            resetColorStyle = {width: width * 24, marginLeft: width * 1};
        }

        return <div className={css.base + " react-chart"}>
            <div className={css.top}>
                <div className={css.title} style={titleStyle}>{this.state.title}</div>
                <div className={css.resetColor} style={resetColorStyle}>
                    <button onClick={()=> {
                        let seriesData = this.setColor();
                        this.setState({seriesData: seriesData});
                    }}>重新随机颜色
                    </button>
                </div>
            </div>
            {
                this.setBarTips()
            }
            {
                svgTag
            }
        </div>;
    }

    /**
     * 绘制柱状图的table说明
     */
    setBarTips() {
        let dom = "";
        if (this.state.type == "bar" && this.state.activeSeries != undefined) {
            //柱状图
            let index = this.state.xAxisArr.findIndex(d=> {
                return d == this.state.activeX;
            });
            if (index >= 0 && this.state.isInAxis) {
                let activeSeries = this.state.seriesData.filter(d=> {
                    return d.vectors[index].sourceY != 0 && d.vectors[index].sourceY != undefined;
                });
                let [h,w] = [$(this.svg).height(), $(this.svg).width()];
                let tipsMarginTop = 9 / this.state.viewBoxHeight * h;
                let tipsMarginLeft = 91 / this.state.viewBoxWidth * w;
                let unitWidth = this.state.xUnitLength / this.state.viewBoxWidth * w;
                let coverMarginLeft = 10 / this.state.viewBoxWidth * w + index * unitWidth;
                let coverMarginTop = 15 / this.state.viewBoxHeight * h;
                let coverHeight = 40 / this.state.viewBoxHeight * h;

                //表格列为所有group值的组合
                let columns = [];
                activeSeries.forEach(d=> {
                    let groupName = d.groupId;
                    if (!columns.includes(groupName)) {
                        columns.push(groupName);
                    }
                });

                //排除掉没有数据的系列
                let activeY = this.props.y.filter(d=> {
                    let isValid = activeSeries.some(d1=> {
                        return d1.baseId == d.id;
                    });
                    return isValid;
                });

                let rows = columns.map((d, i)=> {
                    let tds = activeY.map((d1, j)=> {
                        let id = d1.id;
                        let findElement = activeSeries.find(d2=> {
                            return d2.baseId == id && d2.groupId == d;
                        });
                        let td = <td key={j} style={{backgroundColor: "rgba(233, 233, 233, 1)"}}></td>;
                        if (findElement != undefined) {
                            td = <td key={j}
                                     style={{backgroundColor: findElement.color}}>{findElement.vectors[index].sourceY}</td>;
                        }
                        return td;
                    });
                    let tr = (columns.length == 1 && columns[0] == "") ?
                        <tr key={i}>
                            {
                                tds
                            }
                        </tr>
                        :
                        <tr key={i}>
                            {
                                <td>{d}</td>
                            }
                            {
                                tds
                            }
                        </tr>;
                    return tr;
                });

                let thead = (columns.length == 1 && columns[0] == "") ?
                    <thead>
                    <tr>
                        {
                            activeY.map((d, i)=> {
                                return <th key={i}>{d.name}</th>
                            })
                        }
                    </tr>
                    </thead> :
                    <thead>
                    <tr>
                        <th>系列</th>
                        {
                            activeY.map((d, i)=> {
                                return <th key={i}>{d.name}</th>
                            })
                        }
                    </tr>
                    </thead>;
                dom = <div className={css.barTips}>
                    <div className={css.table} style={{top: tipsMarginTop, left: tipsMarginLeft}} onMouseOver={e=> {
                        this.setState({
                            isInAxis: false
                        });
                    }}>
                        <table>
                            {thead}
                            <tbody>
                            {
                                rows
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className={css.cover} style={{
                        left: coverMarginLeft,
                        top: coverMarginTop,
                        width: unitWidth,
                        height: coverHeight
                    }}></div>
                </div>;
            }
        }
        return dom;
    }

    /**
     * 绘制x轴
     */
    setXAxis() {
        //判断是否需要细分x轴文字
        let dateRegex = new RegExp(/^[1-2]\d{3}-((0[1-9])|(1[0-2])|[1-9])-((0[1-9])|([1-2]\d)|(3[0-1])|[1-9])$/);
        let numberRegex = /^\d+$/;
        let isDate = this.state.xAxisArr.every(d => {
            return dateRegex.test(d);
        });
        let isNumber = this.state.xAxisArr.every(d=> {
            return numberRegex.test(d);
        });
        let textPaddingBottom = 2;
        let textY1 = (this.state.viewBoxHeight - textPaddingBottom - 55) / 3 + 55;
        let textY2 = (this.state.viewBoxHeight - textPaddingBottom - 55) * 2 / 3 + 55;
        let textY3 = this.state.viewBoxHeight - textPaddingBottom;
        let monthXAxisArr = [];
        let yearXAxisArr = [];
        let numberSmallXAxisArr = [];
        let numberBigXAxisArr = [];

        if (isDate) {
            let data = this.state.xAxisArr.map(d=> {
                let arr = d.split("-");
                let year = arr[0];
                let month = arr[1];
                return {year: year, month: month};
            });
            data.forEach((d, i)=> {
                let monthJson = {year: d.year, month: d.month, index: i};
                let yearJson = {year: d.year, index: i};
                let hasMonth = monthXAxisArr.some(d1=> {
                    return d1.year == d.year && d1.month == d.month;
                });
                if (!hasMonth) {
                    let monthLength = data.filter(d1=> {
                        return d1.year == d.year && d1.month == d.month;
                    }).length;
                    monthJson.length = monthLength;
                    monthXAxisArr.push(monthJson);
                }
                let hasYear = yearXAxisArr.some(d1=> {
                    return d1.year == d.year;
                });
                if (!hasYear) {
                    let yearLength = data.filter(d1=> {
                        return d1.year == d.year;
                    }).length;
                    yearJson.length = yearLength;
                    yearXAxisArr.push(yearJson);
                }
            });
        } else if (this.props.xAxisGroupNum && isNumber) {
            this.state.xAxisArr.forEach((d, i)=> {
                let hasNumberSmall = numberSmallXAxisArr.some(d1=> {
                    return d1.value == d;
                });
                if (!hasNumberSmall) {
                    let value = d % 10;
                    numberSmallXAxisArr.push({value: value, index: i});
                }
                let hasNumberBig = numberBigXAxisArr.some(d1=> {
                    return d1.value == Math.floor(d / this.props.xAxisGroupNum);
                });
                if (!hasNumberBig) {
                    let length = this.state.xAxisArr.filter(d1=> {
                        return Math.floor(d1 / this.props.xAxisGroupNum) == Math.floor(d / this.props.xAxisGroupNum);
                    }).length;
                    let value = Math.floor(d / this.props.xAxisGroupNum);
                    numberBigXAxisArr.push({value: value, index: i, length: length});
                }
            });
        }

        let dom = <g className={css.xAxis}>
            <path d="M10 55 h 80"/>
            {
                this.state.xUnitLength == Infinity ? "" : this.state.xAxisArr.map((d, i) => {
                    let w = this.state.xUnitLength;
                    let x = i * w + 10;
                    let textDom;
                    //判断是否要对x坐标文字进行分组
                    if (isDate && this.state.xAxisArr.length > 1) {
                        let arr = d.split("-");
                        textDom = <g>
                            <text x="94.5" y={textY3}>年</text>
                            <text x="94.5" y={textY2}>月</text>
                            <text x="94.5" y={textY1}>日</text>
                            <text x={x + w / 2} y={textY1}>{arr[2]}</text>
                            {
                                monthXAxisArr.map((d1, j)=> {
                                    let startX = d1.index * w + 10;
                                    let endX = startX + d1.length * w;
                                    return <g key={j}>
                                        <path d={`M${startX} ${textY2 - 2} h${d1.length * w}`}/>
                                        <path d={`M${startX} ${textY2 - 2} v1`}/>
                                        <path d={`M${endX} ${textY2 - 2} v1`}/>
                                        <text x={startX + d1.length * w / 2} y={textY2}>{d1.month}</text>
                                    </g>;
                                })
                            }
                            {
                                yearXAxisArr.map((d1, j)=> {
                                    let startX = d1.index * w + 10;
                                    let endX = startX + d1.length * w;
                                    return <g key={j}>
                                        <path d={`M${startX} ${textY3 - 2} h${d1.length * w}`}/>
                                        <path d={`M${startX} ${textY3 - 2} v1`}/>
                                        <path d={`M${endX} ${textY3 - 2} v1`}/>
                                        <text x={startX + d1.length * w / 2} y={textY3}>{d1.year}</text>
                                    </g>;
                                })
                            }
                        </g>;
                    } else if (this.props.xAxisGroupNum && isNumber && this.state.xAxisArr.length > 1) {
                        textDom = <g>
                            <text x="94.5" y={textY2}>x {this.props.xAxisGroupNum}</text>
                            {
                                numberSmallXAxisArr.map((d, i)=> {
                                    let startX = d.index * w + 10;
                                    return <g key={i}>
                                        <text x={startX + w / 2} y={textY1}>{d.value}</text>
                                    </g>;
                                })
                            }
                            {
                                numberBigXAxisArr.map((d, i)=> {
                                    let startX = d.index * w + 10;
                                    let endX = startX + d.length * w;
                                    return <g key={i}>
                                        <path d={`M${startX} ${textY2 - 2} h${d.length * w}`}/>
                                        <path d={`M${startX} ${textY2 - 2} v1`}/>
                                        <path d={`M${endX} ${textY2 - 2} v1`}/>
                                        <text x={startX + d.length * w / 2} y={textY2}>{d.value}</text>
                                    </g>;
                                })
                            }
                        </g>;
                    } else {
                        textDom = <text x={x + w / 2} y={textY1}>{d}</text>;
                    }

                    return <g key={i}>
                        <path d={`M${x} 55 v1`}/>
                        {textDom}
                    </g>
                })
            }
        </g>;
        return dom;
    }

    /**
     * 绘制y轴
     */
    setYAxis() {
        let dom = <g className={css.yAxis}>
            {
                this.state.yAxisNumArr.map((d, i) => {
                    let y = 55 - i * this.state.yUnitLength;
                    let yTextDelta = 0;
                    return <text key={i} x={9} y={y + yTextDelta}>{d}</text>
                })
            }
            {
                this.state.yAxisText ? <g className={css.yAxisText}>
                    <text x="3" y="35" transform="rotate(-90,3,35)">{this.state.yAxisText}</text>
                </g> : ""
            }
        </g>;
        return dom;
    }

    /**
     * 绘制x轴网格线
     */
    setXGrid() {
        let dom = <g className={css.xGrid}>
            {
                this.state.yAxisNumArr.map((d, i) => {
                    let y = 55 - i * this.state.yUnitLength;
                    return <path key={i} d={`M10 ${y} h 80`}/>
                })
            }
            <path d={`M90 55 v1`}/>
        </g>;
        return dom;
    }

    /**
     * 绘制曲线上的点
     * @returns {XML}
     */
    setDots() {
        let dom = "";
        if (this.state.xUnitLength != 0 && this.state.type == "curve") {
            dom = <g className={css.dots}>
                {
                    this.state.seriesData.map((d, i) => {
                        return d.vectors.map(d1 => {
                            let dots = this.getDotsSymbol(i, d.id, d1.x, d1.y, d.color);
                            return dots;
                        });
                    })
                }
            </g>;
        }
        return dom;
    }

    /**
     * 设置所有类型的 icon
     * @returns {XML}
     */
    setTypeList() {
        let activeStyle = {};
        let inactiveStyle = {opacity: 0.3};
        let iconUnderlineStartX = this.state.type == "curve" ? 91 : 95;
        let list = <g className={css.typeList}>
            <path d={`M${iconUnderlineStartX} 3.5 l3 0`} stroke="black" strokeWidth={0.2}/>
            <g className={css.typeIcon} onClick={() => {
                this.setState({
                    type: "curve"
                }, ()=> {
                    this.doUpdate();
                });
            }}>
                <path className={css.iconBackground} d={`M91 1 h3 v3 h-3 z`}></path>
                <path fill="none" d={`M91 2 l0.5 0 l0.5 -1 l0.5 2 l0.5 -1 l1 0`}
                      style={(this.state.type == "curve") ? activeStyle : inactiveStyle}/>
            </g>
            <g className={css.typeIcon} onClick={() => {
                this.setState({
                    type: "bar"
                }, ()=> {
                    this.doUpdate();
                });
            }}>
                <path className={css.iconBackground} d={`M95 1 h3 v3 h-3 z`}></path>
                <path fill="none" d={`M95.1 2 h0.8 v1 h-0.8 z`}
                      style={(this.state.type == "bar") ? activeStyle : inactiveStyle}/>
                <path fill="none" d={`M96.1 1.5 h0.8 v1.5 h-0.8 z`}
                      style={(this.state.type == "bar") ? activeStyle : inactiveStyle}/>
                <path fill="none" d={`M97.1 1 h0.8 v2 h-0.8 z`}
                      style={(this.state.type == "bar") ? activeStyle : inactiveStyle}/>
            </g>
        </g>;
        return list;
    }

    /**
     * 绘制表示数据的图
     * @returns {*}
     */
    setData() {
        let g = "";
        switch (this.state.type) {
            case "curve":
                g = <g className={css.curve}>
                    {
                        this.state.seriesData.map((d, i) => {
                            let lastX, lastY;
                            let path = d.vectors.map((d1, j) => {
                                let [x,y] = [d1.x, d1.y];
                                let p = "";
                                if (j == 0) {
                                    p = `M ${x} ${y}`;
                                } else {
                                    let {x1, y1, x2, y2} = this.getBezierCurvesVector(lastX, lastY, x, y);
                                    p = `C ${x1} ${y1},${x2} ${y2},${x} ${y}`;
                                }
                                lastX = x;
                                lastY = y;
                                return p;
                            }).join(" ");
                            let color = d.color;
                            let style = this.state["curve-" + d.id + "-active"] ? {strokeWidth: 0.4} : {};
                            return <path stroke={color} key={i} d={path} ref={curve => {
                                this["curve" + d.id] = curve;
                            }} style={style}/>
                        })
                    }
                </g>;
                break;
            case "bar":
                let bars = [];
                let w = this.state.xUnitLength;
                //根据y中的id对分组的数据进行bar的堆叠
                let baseIdArr = [];
                this.state.seriesData.forEach(d=> {
                    if (!baseIdArr.includes(d.baseId)) {
                        baseIdArr.push(d.baseId);
                    }
                });
                let barWidth = w / ((baseIdArr.length + 2) * 1.5);
                //react重绘机制导致的问题，如果长度不相等则忽略
                let isErrorData = this.state.seriesData.some(d=> {
                    return d.vectors.length != this.state.xAxisArr.length;
                });
                if (isErrorData) {
                    return "";
                }

                this.state.xAxisArr.map((d, i)=> {
                    //找出当前x区间内的数据
                    baseIdArr.map((d1, j)=> {
                        let startX = i * w + w / (baseIdArr.length + 2) + 10;
                        let barX = startX + (j + 0.5) * w / (baseIdArr.length + 2);
                        let seriesArr = this.state.seriesData.filter(d2=> {
                            return d2.baseId == d1;
                        });
                        let stackY = 0, minusStackY = 0;
                        seriesArr.forEach((d2, k)=> {
                            let barHeight = d2.vectors[i].sourceY;
                            if (barHeight > 0) {
                                let bar = <path key={i + "-" + j + "-" + k} stroke={d2.color} strokeWidth={barWidth}
                                                d={`M${barX} ${this.yTransformToSvg(stackY)} L${barX} ${this.yTransformToSvg(stackY + barHeight)}`}
                                                ref={bar => {
                                                    this["bar" + d2.id + i] = bar;
                                                }}/>;
                                stackY += barHeight;
                                bars.push(bar);
                            } else if (barHeight < 0) {
                                let bar = <path key={i + "-" + j + "-" + k} stroke={d2.color} strokeWidth={barWidth}
                                                d={`M${barX} ${this.yTransformToSvg(minusStackY)} L${barX} ${this.yTransformToSvg(minusStackY + barHeight)}`}
                                                ref={bar => {
                                                    this["bar" + d2.id + i] = bar;
                                                }}/>;
                                minusStackY += barHeight;
                                bars.push(bar);
                            }
                        });
                    })
                });

                g = <g className={css.bar}>
                    {
                        bars
                    }
                </g>;
                break;
        }
        return g;
    }

    /**
     * 绘制右上角的说明
     */
    setDeclare() {
        let dom = <g className={css.declare}>
            {
                this.state.seriesData.map((d, i) => {
                    let x = 91;
                    let y = 15 + i * 2;
                    let color = d.color;
                    let symbol;
                    switch (this.state.type) {
                        case "curve":
                            symbol = <g key={i}>
                                <path
                                    style={this.state["dot-" + d.id + "-active"] ? {strokeWidth: 0.6} : {}}
                                    stroke={color} d={`M${x} ${y} h3`}/>
                                {
                                    this.getDotsSymbol(i, d.id, 92.5, y, color)
                                }
                                <text x="94.5" y={y + 0.5}>{d.name}</text>
                            </g>;
                            break;
                        case "bar":
                            let isValid = true;
                            if (this.state.type == "bar" && this.state.activeSeries != undefined) {
                                //柱状图
                                let index = this.state.xAxisArr.findIndex(d=> {
                                    return d == this.state.activeX;
                                });
                                if (index >= 0) {
                                    isValid = false;
                                }
                            }
                            let offsetX = this.state["dot-" + d.id + "-active"] ? 0.2 : 0;
                            let offsetY = this.state["dot-" + d.id + "-active"] ? 0.2 : 0;
                            symbol = isValid ? <g key={i}>
                                <rect fill={color} x={x - offsetX} y={y - offsetY} width={3 + offsetX * 2}
                                      height={1 + offsetY * 2}/>
                                <text x="94.5" y={y + 1}>{d.name}</text>
                            </g> : "";
                            break;
                    }
                    return symbol;
                })
            }
            {
                this.setTypeList()
            }
        </g>;
        return dom;
    }

    /**
     * 绘制鼠标悬浮时的提示框
     * @returns {*}
     */
    setTips() {
        let dom = (this.state.tipsX && this.state.tipsY) ?
            <g className={css.tips}>
                {
                    this.setTipsBorder()
                }
                {
                    this.setTipsText()
                }
            </g>
            : "";
        return dom;
    }

    /**
     * 如果x坐标类型为日期或数字，则自动根据大小对x轴进行排序
     * @param d
     * @returns {Array.<T>|*|{options, browsertest, dist, rhino, rhinolessc}|string}
     */
    sortData(d) {
        let data = d.concat();
        let dateRegex = new RegExp(/^[1-2]\d{3}-((0[1-9])|(1[0-2])|[1-9])-((0[1-9])|([1-2]\d)|(3[0-1])|[1-9])$/);
        let numberRegex = new RegExp(/^\d+$/);
        let isDate = data.every(d1 => {
            return dateRegex.test(d1[this.props.x]);
        });
        let isNumber = data.every(d1=> {
            return numberRegex.test(d1[this.props.x]);
        });

        if (isDate) {
            data.sort((a, b) => {
                let arr1 = a[this.props.x].split("-");
                let arr2 = b[this.props.x].split("-");
                if (arr1[0] != arr2[0]) {
                    return arr1[0] - arr2[0];
                } else if (arr1[1] != arr2[1]) {
                    return arr1[1] - arr2[1];
                } else if (arr1[2] != arr2[2]) {
                    return arr1[2] - arr2[2];
                } else {
                    return 0;
                }
            });
        }
        if (isNumber) {
            data.sort((a, b) => {
                return a[this.props.x] - b[this.props.x];
            });
        }

        return data;
    }

    /**
     * 获取每个系列
     * @param data
     */
    buildSeries(data, y) {
        let xValueArr = [];
        let xAxisArr = data.filter(d=> {
            if (xValueArr.includes(d[this.state.x])) {
                return false;
            } else {
                xValueArr.push(d[this.state.x]);
                return true;
            }
        }).map(d=> {
            return d[this.state.x];
        });
        let group = this.props.group ? this.props.group : [];

        //找出data中存在的所有分组
        let groupIdArr = [];
        data.forEach(d=> {
            let groupId = group.map(d1=> {
                return d[d1];
            }).join("-");
            if (!groupIdArr.includes(groupId)) {
                groupIdArr.push(groupId);
            }
        });

        let groupData = groupIdArr.map(d=> {
            //遍历data，找到该分组的所有数据
            let thisGroupData = data.filter(d1=> {
                let groupId = group.map(d2=> {
                    return d1[d2];
                }).join("-");
                return groupId == d;
            });
            //按0补全分组数据
            xAxisArr.forEach(d2=> {
                let findData = thisGroupData.find(d3=> {
                    return d3[this.state.x] == d2;
                });
                if (findData == undefined) {
                    //如果该x坐标内没有对应的数据，全部补全为0
                    let json = {};
                    json[this.state.x] = d2;
                    y.forEach(d3=> {
                        json[d3.id] = 0;
                    });
                    thisGroupData.push(json);
                } else {
                    //如果该x坐标内的数据未包含的y[id]属性或y[id]为null的值，全部设置为0
                    thisGroupData = thisGroupData.map(d3=> {
                        if (d3[this.state.x] == d2) {
                            y.forEach(d4=> {
                                if (!d3.hasOwnProperty(d4.id) || d3[d4.id] == null) {
                                    d3[d4.id] = 0;
                                }
                            });
                        }
                        return d3;
                    });

                }
            });
            thisGroupData = this.sortData(thisGroupData);
            return {id: d, data: thisGroupData};
        });

        //根据分组data得出每个系列的data
        let seriesData = [];
        groupData.forEach(d=> {
            y.forEach(d1=> {
                let id = d1.id + "-" + d.id;
                let vectors = d.data.map((d2, i)=> {
                    let x = this.xTransformToSvg(i);
                    let y = this.yTransformToSvg(d2[d1.id]);
                    return {x: x, y: y, sourceY: d2[d1.id]};
                });

                //如果所有的y值均为0,则忽略该系列
                let isAll0 = vectors.every(d2=> {
                    return d2.sourceY === 0;
                });
                if (!isAll0) {
                    let groupId = d.id;
                    groupId = (groupId == "-" || groupId == "") ? "" : ("-" + groupId);
                    let name = d1.name + groupId;
                    let json = {id: id, name: name, vectors: vectors, groupId: d.id, baseId: d1.id};
                    seriesData.push(json);
                }
            })
        });
        //为每个系列附加颜色属性
        seriesData = this.setColor(seriesData);
        return seriesData;
    }

    /**
     * 获取y轴的值数组
     * @param data
     * @returns {Array}
     */
    getYAxisNumArr(data, type) {
        //获取data中最大和最小的值
        let max, min;
        if (type == "bar") {
            let xValueArr = [];
            let xAxisArr = data.filter(d=> {
                if (xValueArr.includes(d[this.state.x])) {
                    return false;
                } else {
                    xValueArr.push(d[this.state.x]);
                    return true;
                }
            }).map(d=> {
                return d[this.state.x];
            });
            //bar需要按分组先堆叠，再进行计算
            this.props.y.forEach(d=> {
                xAxisArr.forEach(d1=> {
                    let minValue = 0, maxValue = 0;
                    data.filter(d2=> {
                        return d2.hasOwnProperty(d.id) && d2[this.state.x] == d1;
                    }).forEach(d2=> {
                        let v = d2[d.id];
                        if (v > 0) {
                            maxValue += v;
                        } else {
                            minValue += v;
                        }
                    });
                    if (max == undefined) {
                        max = maxValue;
                    } else {
                        max = Math.max(maxValue, max);
                    }
                    if (min == undefined) {
                        min = minValue;
                    } else {
                        min = Math.min(minValue, min);
                    }
                })
            });
        } else {
            data.forEach(d => {
                this.props.y.forEach(d1=> {
                    let id = d1.id;
                    let value = d[id];
                    if (d.hasOwnProperty(id)) {
                        if (max == undefined) {
                            max = value;
                        } else {
                            max = Math.max(value, max);
                        }
                        if (min == undefined) {
                            min = value;
                        } else {
                            min = Math.min(value, min);
                        }
                    }
                });
            });
        }

        let yStart = Math.abs(min);
        let yEnd = Math.abs(max);
        let pStart, pEnd = 0;
        if (yStart < 1 && yEnd < 1) {
            //from 0 to lower
            if (yStart != 0) {
                pStart = 0;
                while (yStart * 10 <= 1) {
                    yStart = yStart * 10;
                    pStart--;
                }
            }
            if (yEnd != 0) {
                while (yEnd * 10 <= 1) {
                    yEnd = yEnd * 10;
                    pEnd--;
                }
            }

        } else {
            //from 10 to bigger
            pStart = 0;
            pStart++;
            pEnd++;
            while (yStart / 10 > 1) {
                yStart = yStart / 10;
                pStart++;
            }
            while (yEnd / 10 > 1) {
                yEnd = yEnd / 10;
                pEnd++;
            }
        }

        //get calibration start and end
        let p;
        if (pStart == undefined) {
            p = pEnd;
        } else {
            p = Math.max(pStart, pEnd);
        }
        let yAixsStart, yAixsEnd;
        let calibration = Math.pow(10, p - 1);
        if (min < 0 && max < 0) {
            yAixsStart = -Math.pow(10, p);
            yAixsEnd = 0;
        } else if (min < 0 && max >= 0) {
            yAixsStart = -Math.pow(10, pStart);
            yAixsEnd = Math.pow(10, p);
            calibration = calibration * 2;
        } else if (min >= 0 && max >= 0) {
            yAixsStart = 0;
            yAixsEnd = Math.pow(10, p);
        }
        let calibrationStart, calibrationEnd;
        for (let i = yAixsStart; i <= yAixsEnd; i = i + calibration) {
            if (p <= 0) {
                let scale = Math.pow(10, -p + 1);
                if ((i * scale + calibration * scale) >= min * scale) {
                    calibrationStart = i;
                    break;
                }
            } else {
                if ((i + calibration) >= min) {
                    calibrationStart = i;
                    break;
                }
            }

        }
        for (let i = yAixsStart; i <= yAixsEnd; i = i + calibration) {
            if (p <= 0) {
                let scale = Math.pow(10, -p + 1);
                if ((i * scale + calibration * scale) >= max * scale) {
                    calibrationEnd = (i * scale + calibration * scale) / scale;
                    break;
                }
            } else {
                if ((i + calibration) >= max) {
                    calibrationEnd = i + calibration;
                    break;
                }
            }
        }

        let yAxisNumArr = [];
        let n;
        if (p <= 0) {
            let scale = Math.pow(10, -p + 1);
            n = (calibrationEnd * scale - calibrationStart * scale) / (calibration * scale);
        } else {
            n = (calibrationEnd - calibrationStart) / calibration;
        }
        let step = calibration;
        let fixedNum = -p + 1;
        switch (n) {
            case 1:
            case 2:
                step = (calibrationEnd - calibrationStart) / 10;
                fixedNum++;
                break;
            case 3:
                step = (calibrationEnd - calibrationStart) / 6;
                fixedNum++;
                break;
            case 4:
                step = (calibrationEnd - calibrationStart) / 8;
                fixedNum++;
                break;
        }

        for (let i = calibrationStart; i <= calibrationEnd; i = i + step) {
            let d = i;
            if (fixedNum >= 0) {
                d = d.toFixed(fixedNum);
            }
            yAxisNumArr.push(d);
        }
        return yAxisNumArr;
    }

    /**
     * 将自然坐标 x,y 转化为 svg 坐标系的值
     * @param vector
     * @returns {{x: *, y: *}}
     */
    vectorTransformToSvg(vector) {
        let {x, y} = vector;
        x = this.xTransformToSvg(x);
        y = this.yTransformToSvg(y);
        return {x: x, y: y};
    }

    /**
     * 将自然坐标 x 转化为 svg 坐标系的值
     * @param x
     * @returns {number|*}
     */
    xTransformToSvg(x) {
        let w = this.state.xUnitLength;
        x = x * w + 10 + w / 2;
        return x;
    }

    /**
     * 将自然坐标 y 转化为 svg 坐标系的值
     * @param y
     * @returns {*}
     */
    yTransformToSvg(y) {
        let min, max;
        this.state.yAxisNumArr.forEach(d => {
            if (min == undefined) {
                min = d;
            } else {
                min = Math.min(min, d);
            }
            if (max == undefined) {
                max = d;
            } else {
                max = Math.max(max, d);
            }
        });
        let yPercent = (y - min) / (max - min);
        yPercent = Math.max(0, yPercent);
        yPercent = 1 - yPercent;
        let svgY = 15 + yPercent * 40;
        return svgY;
    }

    /**
     * 将自然坐标的高度转化为 svg 坐标系的高度
     * @param h
     */
    heightTransformToSvg(h) {
        let min, max;
        this.state.yAxisNumArr.forEach(d => {
            if (min == undefined) {
                min = d;
            } else {
                min = Math.min(min, d);
            }
            if (max == undefined) {
                max = d;
            } else {
                max = Math.max(max, d);
            }
        });
        let yPercent = h / (max - min);
        let height = yPercent * 40;
        return height;
    }

    /**
     * 将svg坐标 y 转化为自然坐标系的值
     * @param y
     * @returns {number|*}
     */
    yTransformToNatural(y) {
        let min, max;
        this.state.yAxisNumArr.forEach(d => {
            if (min == undefined) {
                min = d;
            } else {
                min = Math.min(min, d);
            }
            if (max == undefined) {
                max = d;
            } else {
                max = Math.max(max, d);
            }
        });
        let yPercent = (55 - y) / 55;
        y = (max - min) * yPercent + min;
        return y;
    }

    /**
     * 获取贝塞尔曲线两个点的左边 x1,y1 和 x2,y2
     * @param lastX
     * @param lastY
     * @param x
     * @param y
     * @returns {{x1: (number|*), y1: *, x2: (number|*), y2: *}}
     */
    getBezierCurvesVector(lastX, lastY, x, y) {
        let angleNum = this.state.angleNum;
        angleNum = angleNum / 180 * Math.PI;
        let endPointLineLength = this.state.endPointLineLength;
        let x1, y1, x2, y2;
        let pathLength = Math.sqrt(Math.pow(Math.abs(y - lastY), 2) + Math.pow(x - lastX, 2));
        let length = pathLength * endPointLineLength;
        let atanAngle = Math.atan(Math.abs(y - lastY) / (x - lastX));
        let anglePoint1 = Math.PI - angleNum - atanAngle;
        let anglePoint2 = Math.PI - angleNum - (Math.PI / 2 - atanAngle);
        let anglePoint1X = Math.cos(anglePoint1) * length;
        let anglePoint1Y = Math.sin(anglePoint1) * length;
        let anglePoint2X = Math.sin(anglePoint2) * length;
        let anglePoint2Y = Math.cos(anglePoint2) * length;
        x1 = Number.parseInt(lastX - anglePoint1X);
        x2 = Number.parseInt(x - anglePoint2X);
        if (y > lastY) {
            //曲线走势向下
            y1 = Number.parseInt(lastY + anglePoint1Y);
            y2 = Number.parseInt(y + anglePoint2Y);
        } else {
            //曲线走势向上
            y1 = Number.parseInt(lastY - anglePoint1Y);
            y2 = Number.parseInt(y - anglePoint2Y);
        }


        let vector = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };
        return vector;
    }

    /**
     * 获取符号的svg路径dom
     * @param index
     * @param id
     * @param x
     * @param y
     * @param color
     * @returns {*}
     */
    getDotsSymbol(index, id, x, y, color) {
        let dots, r;
        switch (index % 5) {
            //圆
            case 0:
                r = 0.3;
                dots = <circle stroke={color} fill={color} cx={x} cy={y} r={r}
                               style={this.state["dot-" + id + "-active"] ? {strokeWidth: 0.6} : {}}/>;
                break;
            //正方形
            case 1:
                r = 0.4;
                dots = <path stroke={color} fill={color} d={`M${x - r / 2} ${y - r / 2} h${r} v${r} h-${r} z`}
                             style={this.state["dot-" + id + "-active"] ? {strokeWidth: 0.6} : {}}/>;
                break;
            //正方形逆时针旋转45度
            case 2:
                r = 0.4;
                dots = <path stroke={color} fill={color} transform={`rotate(-45,${x},${y})`}
                             d={`M${x - r / 2} ${y - r / 2} h${r} v${r} h-${r} z`}
                             style={this.state["dot-" + id + "-active"] ? {strokeWidth: 0.6} : {}}/>;
                break;
            //三角形
            case 3:
                r = 0.4;
                dots = <path stroke={color} fill={color} d={`M${x - r / 2} ${y + r / 2} h${r} L${x} ${y - r / 2} z`}
                             style={this.state["dot-" + id + "-active"] ? {strokeWidth: 0.6} : {}}/>;
                break;
            //反三角形
            case 4:
                r = 0.4;
                dots = <path stroke={color} fill={color} d={`M${x - r / 2} ${y - r / 2} h${r} L${x} ${y + r / 2} z`}
                             style={this.state["dot-" + id + "-active"] ? {strokeWidth: 0.6} : {}}/>;
                break;

        }
        return dots;
    }

    /**
     * 根据鼠标位置设置激活的系列
     * @param e
     */
    setActive(e) {
        //如果没有数据，则不执行操作
        if (this.state.seriesData.length == 0) {
            return;
        }

        let offset = $(this.svg).offset();
        let x = e.pageX - offset.left;
        let y = e.pageY - offset.top;
        x = x / $(this.svg).width() * this.state.viewBoxWidth;
        y = y / $(this.svg).height() * this.state.viewBoxHeight;
        let {series, tipsX, tipsY, activeX, isInAxis} = this.getNearestSeries(x, y);
        let json = {tipsX: tipsX, tipsY: tipsY, activeSeries: series, activeX: activeX, isInAxis: isInAxis};
        if (series) {
            json["dot-" + series + "-active"] = true;
            json["curve-" + series + "-active"] = true;
            this.state.seriesData.filter(d => {
                return d.id != series;
            }).forEach(d => {
                json["dot-" + d.id + "-active"] = false;
                json["curve-" + d.id + "-active"] = false;
            });
            this.setState(json);
        } else {
            this.state.seriesData.forEach(d => {
                json["dot-" + d.id + "-active"] = false;
                json["curve-" + d.id + "-active"] = false;
            });
            this.setState(json);
        }
    }

    /**
     * 寻找最近的系列
     * @param x svgX
     * @param y svgY
     * @returns {*} series
     */
    getNearestSeries(x, y) {
        let series, isInAxis = false;
        let tipsX, tipsY, index, activeX;
        let w = this.state.xUnitLength;
        if (x >= 10 && x <= 90 && y >= 15 && y <= 55) {
            isInAxis = true;
            switch (this.state.type) {
                case "curve":
                    //根据x和斜率寻找最近的y
                    let yMap = [];
                    if (x <= 10 + w / 2) {
                        //线条左边空白区域取第一个元素的值
                        tipsX = 10 + w / 2;
                        index = 0;
                        yMap = this.state.seriesData.map(d => {
                            let lineY = d.vectors[0].y;
                            return {id: d.id, y: lineY};
                        });
                    } else if (x >= 90 - w / 2) {
                        //线条右边空白区域取最后一个元素的值
                        tipsX = 10 + w / 2 + (this.state.xAxisArr.length - 1) * w;
                        index = this.state.xAxisArr.length - 1;
                        yMap = this.state.seriesData.map(d => {
                            let lineY = d.vectors[d.vectors.length - 1].y;
                            return {id: d.id, y: lineY};
                        });
                    } else {
                        //线条中间部分根据斜率进行计算
                        let startIndex, endIndex;
                        for (let i = 0; i < this.state.xAxisArr.length - 1; i++) {
                            let startX = 10 + i * w + w / 2;
                            let endX = 10 + (i + 1) * w + w / 2;
                            if (x >= startX && x <= endX) {
                                startIndex = i;
                                endIndex = i + 1;
                                break;
                            }
                        }
                        let x1 = 10 + startIndex * w + w / 2;
                        let x2 = 10 + endIndex * w + w / 2;
                        if (x <= (x1 + x2) / 2) {
                            tipsX = 10 + w / 2 + startIndex * w;
                            index = startIndex;
                        } else {
                            tipsX = 10 + w / 2 + endIndex * w;
                            index = endIndex;
                        }
                        //根据斜率算出鼠标x点的各系列y数组
                        yMap = this.state.seriesData.map(d => {
                            let y1 = d.vectors[startIndex].y;
                            let y2 = d.vectors[endIndex].y;
                            let slope = (y2 - y1) / (x2 - x1);
                            let lineY = (x - x1) * slope + y1;
                            return {id: d.id, y: lineY};
                        });
                    }
                    //对获取到的所有y进行从小到大排序
                    yMap.sort((a, b) => {
                        return a.y - b.y;
                    });
                    if (y < yMap[0].y) {
                        series = yMap[0].id;
                    } else if (y > yMap[yMap.length - 1].y) {
                        series = yMap[yMap.length - 1].id;
                    } else {
                        for (let i = 0; i < yMap.length - 1; i++) {
                            let startY = yMap[i].y;
                            let endY = yMap[i + 1].y;
                            if (y >= startY && y <= endY) {
                                if (y < (startY + endY) / 2) {
                                    series = yMap[i].id;
                                } else {
                                    series = yMap[i + 1].id;
                                }
                                break;
                            }
                        }
                    }
                    let findSeries = this.state.seriesData.find(d => {
                        return d.id == series;
                    });
                    let vectors = findSeries.vectors;
                    let vector = vectors[index];
                    tipsY = vector.y;
                    activeX = this.state.xAxisArr[index];
                    break;
                case "bar":
                    if (x > 10 && x < 90 && y > 15 && y < 55) {
                        for (let i = 0; i < this.state.xAxisArr.length; i++) {
                            let startX = i * w + 10;
                            let endX = (i + 1) * w + 10;
                            if (x > startX && x < endX) {
                                series = "";
                                activeX = this.state.xAxisArr[i];
                            }
                        }
                    }
                    break;
            }

        }
        return {series: series, tipsX: tipsX, tipsY: tipsY, activeX: activeX, isInAxis: isInAxis};
    }


    /**
     * 设置随机颜色
     * @param seriesData
     * @returns {*}
     */
    setColor(seriesData) {
        let data = (seriesData == undefined) ? this.state.seriesData : seriesData;
        let max = 360;
        let step = Math.floor(max / data.length);
        data = data.map((d, i) => {
            //设定颜色的波动范围为25%-75%个step之间
            let h = step * i + step / 4;
            let r = Math.floor(Math.random() * step / 2);
            h = h + r;
            let s = "50%";
            let l = "50%";
            d.color = `hsla(${h},${s},${l},1)`;
            return d;
        });
        return data;
    }

    /**
     * 设置鼠标悬浮时提示的文字
     * @returns {*}
     */
    setTipsText() {
        let startX = this.state.tipsX;
        let startY = this.state.tipsY - this.state.tipsMarginBottom - this.state.tipsRaisedY - this.state.tipsPaddingBottom;
        let text = "", color;
        if (this.state.type != "bar") {
            let findSeries = this.state.seriesData.find(d => {
                return d.id == this.state.activeSeries;
            });
            color = findSeries.color;
            let xText = this.state.activeX;
            let xIndex = this.state.xAxisArr.findIndex(d=> {
                return d == xText;
            });
            let yText = findSeries.vectors[xIndex].sourceY;
            let activeText = this.state.seriesData.find(d => {
                return d.id == this.state.activeSeries;
            }).name;
            text = <text color={color} x={startX} y={startY} ref={d => {
                this.tipsText = d;
            }}>
                {activeText} : {yText + "" + (this.props.tipsSuffix ? this.props.tipsSuffix : "")}
            </text>;
        }
        return text;
    }

    /**
     * 设置鼠标悬浮时提示的边框
     * @returns {*}
     */
    setTipsBorder() {
        let path = "";
        if (this.state.type != "bar") {
            let arcRx = 0.5, arcRy = 0.5;
            let startX = this.state.tipsX;
            let startY = this.state.tipsY - this.state.tipsMarginBottom;
            let color = this.state.seriesData.find(d => {
                return d.id == this.state.activeSeries;
            }).color;
            path = this.state.tipsWidth ?
                <path stroke={color}
                      d={`M${startX} ${startY} l${-this.state.tipsRaisedX} ${-this.state.tipsRaisedY}
                  l${-(this.state.tipsWidth / 2 - this.state.tipsRaisedX + this.state.tipsPaddingLeft)} 0
                  a${arcRx} ${arcRy} 0 0 1 ${-arcRx} ${-arcRy}
                  l0 ${-(this.state.tipsHeight + this.state.tipsPaddingBottom + this.state.tipsPaddingTop - arcRy)}
                  l${this.state.tipsWidth + this.state.tipsPaddingLeft + this.state.tipsPaddingRight + arcRx * 2} 0
                  l0 ${(this.state.tipsHeight + this.state.tipsPaddingBottom + this.state.tipsPaddingTop - arcRy)}
                  a${arcRx} ${arcRy} 0 0 1 ${-arcRx} ${arcRy}
                  l${-(this.state.tipsWidth / 2 - this.state.tipsRaisedX + this.state.tipsPaddingRight)} 0 z`}/>
                : "";
        }
        return path;
    }


    /**
     * 鼠标离开svg元素时的判断
     * @param e
     */
    mouseLeave(e) {
        let isInAxis = false;
        let offset = $(this.svg).offset();
        let x = e.pageX - offset.left;
        let y = e.pageY - offset.top;
        x = x / $(this.svg).width() * this.state.viewBoxWidth;
        y = y / $(this.svg).height() * this.state.viewBoxHeight;
        if (x >= 10 && x <= 90 && y >= 15 && y <= 55) {
            isInAxis = true;
        }
        this.setState({
            isInAxis: isInAxis
        });
    }
}

module.exports = chart;