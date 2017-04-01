"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

require("karl-extend");

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var chart = function (_React$Component) {
    _inherits(chart, _React$Component);

    function chart(props) {
        _classCallCheck(this, chart);

        var _this = _possibleConstructorReturn(this, (chart.__proto__ || Object.getPrototypeOf(chart)).call(this, props));

        _this.state = {
            data: _this.props.data,
            x: _this.props.x,
            xAxisArr: [],
            y: [],
            xUnitLength: 0,
            seriesData: [],
            yAxisNumArr: [],
            title: _this.props.title,
            yAxisText: _this.props.yAxisText == undefined ? "" : _this.props.yAxisText,
            type: _this.props.type ? _this.props.type : "curve",
            angleNum: _this.props.angleNum ? _this.props.angleNum : 12,
            endPointLineLength: _this.props.endPointLineLength ? _this.props.endPointLineLength : 0.1,
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
        var bindArr = ["sortData", "vectorTransformToSvg", "xTransformToSvg", "yTransformToSvg", "yTransformToNatural", "getYAxisNumArr", "setActive", "getNearestSeries", "setColor", "setTipsBorder", "doUpdate", "setSvgAnimate", "mouseLeave"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(chart, [{
        key: "componentWillMount",
        value: function componentWillMount() {}
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.doUpdate();
        }
    }, {
        key: "doUpdate",
        value: function doUpdate() {
            var _this2 = this;

            var data = this.sortData(this.state.data);
            var xValueArr = [];
            var xAxisArr = data.filter(function (d) {
                if (xValueArr.includes(d[_this2.state.x])) {
                    return false;
                } else {
                    xValueArr.push(d[_this2.state.x]);
                    return true;
                }
            }).map(function (d) {
                return d[_this2.state.x];
            });

            //根据group属性对data进行分组求和,计算正数和负数的最大最小值
            var groupData = [];
            data.forEach(function (d) {
                var hasSameGroup = groupData.some(function (d1) {
                    var isSameGroup = _this2.props.group ? _this2.props.group.every(function (d2) {
                        return d1[d2] == d[d2];
                    }) : true;
                    return d1[_this2.state.x] == d[_this2.state.x] && isSameGroup;
                });
                if (hasSameGroup) {
                    var _loop = function _loop(k) {
                        var isSeries = _this2.props.y.some(function (d2) {
                            return k == d2.id;
                        });
                        if (isSeries) {
                            groupData = groupData.map(function (d1) {
                                var isSameGroup = _this2.props.group ? _this2.props.group.every(function (d2) {
                                    return d1[d2] == d[d2];
                                }) : true;
                                if (d1[_this2.state.x] == d[_this2.state.x] && isSameGroup) {
                                    d1[k] = d1[k] + d[k];
                                }
                                return d1;
                            });
                        }
                    };

                    //对包含在y中的系列值进行求和
                    for (var k in d) {
                        _loop(k);
                    }
                } else {
                    var json = Object.assign({}, d);
                    groupData.push(json);
                }
            });

            var yAxisNumArr = this.getYAxisNumArr(groupData, this.state.type);
            this.setState({
                xAxisArr: xAxisArr,
                xUnitLength: 100 * 0.8 / xAxisArr.length,
                yAxisNumArr: yAxisNumArr,
                yUnitLength: 50 * 0.8 / (yAxisNumArr.length - 1)
            }, function () {
                var seriesData = _this2.buildSeries(groupData, _this2.props.y);
                _this2.setState({
                    seriesData: seriesData
                }, function () {
                    _this2.setSvgAnimate();
                });
            });
        }

        /**
         * 设置svg绘制的动画
         */

    }, {
        key: "setSvgAnimate",
        value: function setSvgAnimate() {
            var _this3 = this;

            var ua = window.navigator.userAgent;
            if (ua.includes("Trident/7.0") || ua.includes("MSIE ")) {
                this.setState({
                    isIE: true,
                    svgWidth: (0, _jquery2.default)(this.svg).width(),
                    svgHeight: (0, _jquery2.default)(this.svg).width() * this.state.viewBoxHeight / this.state.viewBoxWidth
                });
            } else {
                switch (this.state.type) {
                    case "curve":
                        this.state.seriesData.forEach(function (d) {
                            var length = _this3["curve" + d.id].getTotalLength();
                            (0, _jquery2.default)(_this3["curve" + d.id]).css({
                                "stroke-dasharray": length,
                                "stroke-dashoffset": length
                            });
                            (0, _jquery2.default)(_this3["curve" + d.id]).animate({ "stroke-dashoffset": "0px" }, 1000, "linear");
                        });
                        break;
                    case "bar":
                        this.state.seriesData.forEach(function (d) {
                            _this3.state.xAxisArr.forEach(function (d1, i) {
                                var barRef = _this3["bar" + d.id + i];
                                if (barRef) {
                                    (function () {
                                        var length = barRef.getTotalLength();
                                        //计算bar的宽度
                                        var w = _this3.state.xUnitLength;
                                        var baseIdArr = [];
                                        _this3.state.seriesData.forEach(function (d) {
                                            if (!baseIdArr.includes(d.baseId)) {
                                                baseIdArr.push(d.baseId);
                                            }
                                        });
                                        var barWidth = w / ((baseIdArr.length + 2) * 1.5);

                                        (0, _jquery2.default)(barRef).css({
                                            "stroke-dasharray": length,
                                            "stroke-dashoffset": length,
                                            "stroke-width": "0px"
                                        });
                                        (0, _jquery2.default)(barRef).animate({
                                            "stroke-dashoffset": "0px",
                                            "stroke-width": barWidth + "px"
                                        }, 1000, "linear");
                                    })();
                                }
                            });
                        });
                        break;
                }
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var _this4 = this;

            if (this.props.data != nextProps.data) {
                this.setState({
                    data: nextProps.data
                }, function () {
                    _this4.doUpdate();
                });
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            //设置tips的宽度和高度
            if (!(prevState.tipsX == this.state.tipsX && prevState.tipsY == this.state.tipsY) && this.state.tipsX && this.state.tipsY) {
                var w = (0, _jquery2.default)(this.tipsText).width() / (0, _jquery2.default)(this.svg).width() * this.state.viewBoxWidth;
                w = w.toFixed(2);
                w = Number.parseFloat(w);
                var h = (0, _jquery2.default)(this.tipsText).height() / (0, _jquery2.default)(this.svg).height() * this.state.viewBoxHeight;
                h = h.toFixed(2);
                h = Number.parseFloat(h);
                this.setState({
                    tipsWidth: w,
                    tipsHeight: h
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var svgChild = _react2.default.createElement(
                "g",
                null,
                this.setXAxis(),
                this.setYAxis(),
                this.setXGrid(),
                this.setData(),
                this.setDots(),
                this.setDeclare(),
                this.setTips()
            );

            var svgTag = this.state.svgWidth ? _react2.default.createElement(
                "svg",
                { viewBox: "0 0 " + this.state.viewBoxWidth + " " + this.state.viewBoxHeight, width: this.state.svgWidth,
                    height: this.state.svgHeight,
                    onMouseMove: this.setActive,
                    onMouseLeave: this.mouseLeave,
                    ref: function ref(svg) {
                        _this5.svg = svg;
                    } },
                svgChild
            ) : _react2.default.createElement(
                "svg",
                { viewBox: "0 0 " + this.state.viewBoxWidth + " " + this.state.viewBoxHeight, onMouseMove: this.setActive,
                    onMouseLeave: this.mouseLeave,
                    ref: function ref(svg) {
                        _this5.svg = svg;
                    } },
                svgChild
            );
            var titleStyle = {},
                resetColorStyle = {};
            if ((0, _jquery2.default)(this.svg).width() != undefined) {
                var width = (0, _jquery2.default)(this.svg).width() / this.state.viewBoxWidth;
                titleStyle = { width: width * 80, marginLeft: width * 10 };
                resetColorStyle = { width: width * 24, marginLeft: width * 1 };
            }

            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-chart" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.top },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.title, style: titleStyle },
                        this.state.title
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.resetColor, style: resetColorStyle },
                        _react2.default.createElement(
                            "button",
                            { onClick: function onClick() {
                                    var seriesData = _this5.setColor();
                                    _this5.setState({ seriesData: seriesData });
                                } },
                            "\u91CD\u65B0\u968F\u673A\u989C\u8272"
                        )
                    )
                ),
                this.setBarTips(),
                svgTag
            );
        }

        /**
         * 绘制柱状图的table说明
         */

    }, {
        key: "setBarTips",
        value: function setBarTips() {
            var _this6 = this;

            var dom = "";
            if (this.state.type == "bar" && this.state.activeSeries != undefined) {
                (function () {
                    //柱状图
                    var index = _this6.state.xAxisArr.findIndex(function (d) {
                        return d == _this6.state.activeX;
                    });
                    if (index >= 0 && _this6.state.isInAxis) {
                        (function () {
                            var activeSeries = _this6.state.seriesData.filter(function (d) {
                                return d.vectors[index].sourceY != 0 && d.vectors[index].sourceY != undefined;
                            });
                            var _ref = [(0, _jquery2.default)(_this6.svg).height(), (0, _jquery2.default)(_this6.svg).width()],
                                h = _ref[0],
                                w = _ref[1];

                            var tipsMarginTop = 9 / _this6.state.viewBoxHeight * h;
                            var tipsMarginLeft = 91 / _this6.state.viewBoxWidth * w;
                            var unitWidth = _this6.state.xUnitLength / _this6.state.viewBoxWidth * w;
                            var coverMarginLeft = 10 / _this6.state.viewBoxWidth * w + index * unitWidth;
                            var coverMarginTop = 15 / _this6.state.viewBoxHeight * h;
                            var coverHeight = 40 / _this6.state.viewBoxHeight * h;

                            //表格列为所有group值的组合
                            var columns = [];
                            activeSeries.forEach(function (d) {
                                var groupName = d.groupId;
                                if (!columns.includes(groupName)) {
                                    columns.push(groupName);
                                }
                            });

                            //排除掉没有数据的系列
                            var activeY = _this6.props.y.filter(function (d) {
                                var isValid = activeSeries.some(function (d1) {
                                    return d1.baseId == d.id;
                                });
                                return isValid;
                            });

                            var rows = columns.map(function (d, i) {
                                var tds = activeY.map(function (d1, j) {
                                    var id = d1.id;
                                    var findElement = activeSeries.find(function (d2) {
                                        return d2.baseId == id && d2.groupId == d;
                                    });
                                    var td = _react2.default.createElement("td", { key: j, style: { backgroundColor: "rgba(233, 233, 233, 1)" } });
                                    if (findElement != undefined) {
                                        td = _react2.default.createElement(
                                            "td",
                                            { key: j,
                                                style: { backgroundColor: findElement.color } },
                                            findElement.vectors[index].sourceY
                                        );
                                    }
                                    return td;
                                });
                                var tr = columns.length == 1 && columns[0] == "" ? _react2.default.createElement(
                                    "tr",
                                    { key: i },
                                    tds
                                ) : _react2.default.createElement(
                                    "tr",
                                    { key: i },
                                    _react2.default.createElement(
                                        "td",
                                        null,
                                        d
                                    ),
                                    tds
                                );
                                return tr;
                            });

                            var thead = columns.length == 1 && columns[0] == "" ? _react2.default.createElement(
                                "thead",
                                null,
                                _react2.default.createElement(
                                    "tr",
                                    null,
                                    activeY.map(function (d, i) {
                                        return _react2.default.createElement(
                                            "th",
                                            { key: i },
                                            d.name
                                        );
                                    })
                                )
                            ) : _react2.default.createElement(
                                "thead",
                                null,
                                _react2.default.createElement(
                                    "tr",
                                    null,
                                    _react2.default.createElement(
                                        "th",
                                        null,
                                        "\u7CFB\u5217"
                                    ),
                                    activeY.map(function (d, i) {
                                        return _react2.default.createElement(
                                            "th",
                                            { key: i },
                                            d.name
                                        );
                                    })
                                )
                            );
                            dom = _react2.default.createElement(
                                "div",
                                { className: _index2.default.barTips },
                                _react2.default.createElement(
                                    "div",
                                    { className: _index2.default.table, style: { top: tipsMarginTop, left: tipsMarginLeft }, onMouseOver: function onMouseOver(e) {
                                            _this6.setState({
                                                isInAxis: false
                                            });
                                        } },
                                    _react2.default.createElement(
                                        "table",
                                        null,
                                        thead,
                                        _react2.default.createElement(
                                            "tbody",
                                            null,
                                            rows
                                        )
                                    )
                                ),
                                _react2.default.createElement("div", { className: _index2.default.cover, style: {
                                        left: coverMarginLeft,
                                        top: coverMarginTop,
                                        width: unitWidth,
                                        height: coverHeight
                                    } })
                            );
                        })();
                    }
                })();
            }
            return dom;
        }

        /**
         * 绘制x轴
         */

    }, {
        key: "setXAxis",
        value: function setXAxis() {
            var _this7 = this;

            //判断是否需要细分x轴文字
            var dateRegex = new RegExp(/^[1-2]\d{3}-((0[1-9])|(1[0-2])|[1-9])-((0[1-9])|([1-2]\d)|(3[0-1])|[1-9])$/);
            var numberRegex = /^\d+$/;
            var isDate = this.state.xAxisArr.every(function (d) {
                return dateRegex.test(d);
            });
            var isNumber = this.state.xAxisArr.every(function (d) {
                return numberRegex.test(d);
            });
            var textPaddingBottom = 2;
            var textY1 = (this.state.viewBoxHeight - textPaddingBottom - 55) / 3 + 55;
            var textY2 = (this.state.viewBoxHeight - textPaddingBottom - 55) * 2 / 3 + 55;
            var textY3 = this.state.viewBoxHeight - textPaddingBottom;
            var monthXAxisArr = [];
            var yearXAxisArr = [];
            var numberSmallXAxisArr = [];
            var numberBigXAxisArr = [];

            if (isDate) {
                (function () {
                    var data = _this7.state.xAxisArr.map(function (d) {
                        var arr = d.split("-");
                        var year = arr[0];
                        var month = arr[1];
                        return { year: year, month: month };
                    });
                    data.forEach(function (d, i) {
                        var monthJson = { year: d.year, month: d.month, index: i };
                        var yearJson = { year: d.year, index: i };
                        var hasMonth = monthXAxisArr.some(function (d1) {
                            return d1.year == d.year && d1.month == d.month;
                        });
                        if (!hasMonth) {
                            var monthLength = data.filter(function (d1) {
                                return d1.year == d.year && d1.month == d.month;
                            }).length;
                            monthJson.length = monthLength;
                            monthXAxisArr.push(monthJson);
                        }
                        var hasYear = yearXAxisArr.some(function (d1) {
                            return d1.year == d.year;
                        });
                        if (!hasYear) {
                            var yearLength = data.filter(function (d1) {
                                return d1.year == d.year;
                            }).length;
                            yearJson.length = yearLength;
                            yearXAxisArr.push(yearJson);
                        }
                    });
                })();
            } else if (this.props.xAxisGroupNum && isNumber) {
                this.state.xAxisArr.forEach(function (d, i) {
                    var hasNumberSmall = numberSmallXAxisArr.some(function (d1) {
                        return d1.value == d;
                    });
                    if (!hasNumberSmall) {
                        var value = d % 10;
                        numberSmallXAxisArr.push({ value: value, index: i });
                    }
                    var hasNumberBig = numberBigXAxisArr.some(function (d1) {
                        return d1.value == Math.floor(d / _this7.props.xAxisGroupNum);
                    });
                    if (!hasNumberBig) {
                        var length = _this7.state.xAxisArr.filter(function (d1) {
                            return Math.floor(d1 / _this7.props.xAxisGroupNum) == Math.floor(d / _this7.props.xAxisGroupNum);
                        }).length;
                        var _value = Math.floor(d / _this7.props.xAxisGroupNum);
                        numberBigXAxisArr.push({ value: _value, index: i, length: length });
                    }
                });
            }

            var dom = _react2.default.createElement(
                "g",
                { className: _index2.default.xAxis },
                _react2.default.createElement("path", { d: "M10 55 h 80" }),
                this.state.xUnitLength == Infinity ? "" : this.state.xAxisArr.map(function (d, i) {
                    var w = _this7.state.xUnitLength;
                    var x = i * w + 10;
                    var textDom = void 0;
                    //判断是否要对x坐标文字进行分组
                    if (isDate && _this7.state.xAxisArr.length > 1) {
                        var arr = d.split("-");
                        textDom = _react2.default.createElement(
                            "g",
                            null,
                            _react2.default.createElement(
                                "text",
                                { x: "94.5", y: textY3 },
                                "\u5E74"
                            ),
                            _react2.default.createElement(
                                "text",
                                { x: "94.5", y: textY2 },
                                "\u6708"
                            ),
                            _react2.default.createElement(
                                "text",
                                { x: "94.5", y: textY1 },
                                "\u65E5"
                            ),
                            _react2.default.createElement(
                                "text",
                                { x: x + w / 2, y: textY1 },
                                arr[2]
                            ),
                            monthXAxisArr.map(function (d1, j) {
                                var startX = d1.index * w + 10;
                                var endX = startX + d1.length * w;
                                return _react2.default.createElement(
                                    "g",
                                    { key: j },
                                    _react2.default.createElement("path", { d: "M" + startX + " " + (textY2 - 2) + " h" + d1.length * w }),
                                    _react2.default.createElement("path", { d: "M" + startX + " " + (textY2 - 2) + " v1" }),
                                    _react2.default.createElement("path", { d: "M" + endX + " " + (textY2 - 2) + " v1" }),
                                    _react2.default.createElement(
                                        "text",
                                        { x: startX + d1.length * w / 2, y: textY2 },
                                        d1.month
                                    )
                                );
                            }),
                            yearXAxisArr.map(function (d1, j) {
                                var startX = d1.index * w + 10;
                                var endX = startX + d1.length * w;
                                return _react2.default.createElement(
                                    "g",
                                    { key: j },
                                    _react2.default.createElement("path", { d: "M" + startX + " " + (textY3 - 2) + " h" + d1.length * w }),
                                    _react2.default.createElement("path", { d: "M" + startX + " " + (textY3 - 2) + " v1" }),
                                    _react2.default.createElement("path", { d: "M" + endX + " " + (textY3 - 2) + " v1" }),
                                    _react2.default.createElement(
                                        "text",
                                        { x: startX + d1.length * w / 2, y: textY3 },
                                        d1.year
                                    )
                                );
                            })
                        );
                    } else if (_this7.props.xAxisGroupNum && isNumber && _this7.state.xAxisArr.length > 1) {
                        textDom = _react2.default.createElement(
                            "g",
                            null,
                            _react2.default.createElement(
                                "text",
                                { x: "94.5", y: textY2 },
                                "x ",
                                _this7.props.xAxisGroupNum
                            ),
                            numberSmallXAxisArr.map(function (d, i) {
                                var startX = d.index * w + 10;
                                return _react2.default.createElement(
                                    "g",
                                    { key: i },
                                    _react2.default.createElement(
                                        "text",
                                        { x: startX + w / 2, y: textY1 },
                                        d.value
                                    )
                                );
                            }),
                            numberBigXAxisArr.map(function (d, i) {
                                var startX = d.index * w + 10;
                                var endX = startX + d.length * w;
                                return _react2.default.createElement(
                                    "g",
                                    { key: i },
                                    _react2.default.createElement("path", { d: "M" + startX + " " + (textY2 - 2) + " h" + d.length * w }),
                                    _react2.default.createElement("path", { d: "M" + startX + " " + (textY2 - 2) + " v1" }),
                                    _react2.default.createElement("path", { d: "M" + endX + " " + (textY2 - 2) + " v1" }),
                                    _react2.default.createElement(
                                        "text",
                                        { x: startX + d.length * w / 2, y: textY2 },
                                        d.value
                                    )
                                );
                            })
                        );
                    } else {
                        textDom = _react2.default.createElement(
                            "text",
                            { x: x + w / 2, y: textY1 },
                            d
                        );
                    }

                    return _react2.default.createElement(
                        "g",
                        { key: i },
                        _react2.default.createElement("path", { d: "M" + x + " 55 v1" }),
                        textDom
                    );
                })
            );
            return dom;
        }

        /**
         * 绘制y轴
         */

    }, {
        key: "setYAxis",
        value: function setYAxis() {
            var _this8 = this;

            var dom = _react2.default.createElement(
                "g",
                { className: _index2.default.yAxis },
                this.state.yAxisNumArr.map(function (d, i) {
                    var y = 55 - i * _this8.state.yUnitLength;
                    var yTextDelta = 0;
                    return _react2.default.createElement(
                        "text",
                        { key: i, x: 9, y: y + yTextDelta },
                        d
                    );
                }),
                this.state.yAxisText ? _react2.default.createElement(
                    "g",
                    { className: _index2.default.yAxisText },
                    _react2.default.createElement(
                        "text",
                        { x: "3", y: "35", transform: "rotate(-90,3,35)" },
                        this.state.yAxisText
                    )
                ) : ""
            );
            return dom;
        }

        /**
         * 绘制x轴网格线
         */

    }, {
        key: "setXGrid",
        value: function setXGrid() {
            var _this9 = this;

            var dom = _react2.default.createElement(
                "g",
                { className: _index2.default.xGrid },
                this.state.yAxisNumArr.map(function (d, i) {
                    var y = 55 - i * _this9.state.yUnitLength;
                    return _react2.default.createElement("path", { key: i, d: "M10 " + y + " h 80" });
                }),
                _react2.default.createElement("path", { d: "M90 55 v1" })
            );
            return dom;
        }

        /**
         * 绘制曲线上的点
         * @returns {XML}
         */

    }, {
        key: "setDots",
        value: function setDots() {
            var _this10 = this;

            var dom = "";
            if (this.state.xUnitLength != 0 && this.state.type == "curve") {
                dom = _react2.default.createElement(
                    "g",
                    { className: _index2.default.dots },
                    this.state.seriesData.map(function (d, i) {
                        return d.vectors.map(function (d1) {
                            var dots = _this10.getDotsSymbol(i, d.id, d1.x, d1.y, d.color);
                            return dots;
                        });
                    })
                );
            }
            return dom;
        }

        /**
         * 设置所有类型的 icon
         * @returns {XML}
         */

    }, {
        key: "setTypeList",
        value: function setTypeList() {
            var _this11 = this;

            var activeStyle = {};
            var inactiveStyle = { opacity: 0.3 };
            var iconUnderlineStartX = this.state.type == "curve" ? 91 : 95;
            var list = _react2.default.createElement(
                "g",
                { className: _index2.default.typeList },
                _react2.default.createElement("path", { d: "M" + iconUnderlineStartX + " 3.5 l3 0", stroke: "black", strokeWidth: 0.2 }),
                _react2.default.createElement(
                    "g",
                    { className: _index2.default.typeIcon, onClick: function onClick() {
                            _this11.setState({
                                type: "curve"
                            }, function () {
                                _this11.doUpdate();
                            });
                        } },
                    _react2.default.createElement("path", { className: _index2.default.iconBackground, d: "M91 1 h3 v3 h-3 z" }),
                    _react2.default.createElement("path", { fill: "none", d: "M91 2 l0.5 0 l0.5 -1 l0.5 2 l0.5 -1 l1 0",
                        style: this.state.type == "curve" ? activeStyle : inactiveStyle })
                ),
                _react2.default.createElement(
                    "g",
                    { className: _index2.default.typeIcon, onClick: function onClick() {
                            _this11.setState({
                                type: "bar"
                            }, function () {
                                _this11.doUpdate();
                            });
                        } },
                    _react2.default.createElement("path", { className: _index2.default.iconBackground, d: "M95 1 h3 v3 h-3 z" }),
                    _react2.default.createElement("path", { fill: "none", d: "M95.1 2 h0.8 v1 h-0.8 z",
                        style: this.state.type == "bar" ? activeStyle : inactiveStyle }),
                    _react2.default.createElement("path", { fill: "none", d: "M96.1 1.5 h0.8 v1.5 h-0.8 z",
                        style: this.state.type == "bar" ? activeStyle : inactiveStyle }),
                    _react2.default.createElement("path", { fill: "none", d: "M97.1 1 h0.8 v2 h-0.8 z",
                        style: this.state.type == "bar" ? activeStyle : inactiveStyle })
                )
            );
            return list;
        }

        /**
         * 绘制表示数据的图
         * @returns {*}
         */

    }, {
        key: "setData",
        value: function setData() {
            var _this12 = this;

            var g = "";

            var _ret6 = function () {
                switch (_this12.state.type) {
                    case "curve":
                        g = _react2.default.createElement(
                            "g",
                            { className: _index2.default.curve },
                            _this12.state.seriesData.map(function (d, i) {
                                var lastX = void 0,
                                    lastY = void 0;
                                var path = d.vectors.map(function (d1, j) {
                                    var _ref2 = [d1.x, d1.y],
                                        x = _ref2[0],
                                        y = _ref2[1];

                                    var p = "";
                                    if (j == 0) {
                                        p = "M " + x + " " + y;
                                    } else {
                                        var _getBezierCurvesVecto = _this12.getBezierCurvesVector(lastX, lastY, x, y),
                                            x1 = _getBezierCurvesVecto.x1,
                                            y1 = _getBezierCurvesVecto.y1,
                                            x2 = _getBezierCurvesVecto.x2,
                                            y2 = _getBezierCurvesVecto.y2;

                                        p = "C " + x1 + " " + y1 + "," + x2 + " " + y2 + "," + x + " " + y;
                                    }
                                    lastX = x;
                                    lastY = y;
                                    return p;
                                }).join(" ");
                                var color = d.color;
                                var style = _this12.state["curve-" + d.id + "-active"] ? { strokeWidth: 0.4 } : {};
                                return _react2.default.createElement("path", { stroke: color, key: i, d: path, ref: function ref(curve) {
                                        _this12["curve" + d.id] = curve;
                                    }, style: style });
                            })
                        );
                        break;
                    case "bar":
                        var bars = [];
                        var w = _this12.state.xUnitLength;
                        //根据y中的id对分组的数据进行bar的堆叠
                        var baseIdArr = [];
                        _this12.state.seriesData.forEach(function (d) {
                            if (!baseIdArr.includes(d.baseId)) {
                                baseIdArr.push(d.baseId);
                            }
                        });
                        var barWidth = w / ((baseIdArr.length + 2) * 1.5);
                        //react重绘机制导致的问题，如果长度不相等则忽略
                        var isErrorData = _this12.state.seriesData.some(function (d) {
                            return d.vectors.length != _this12.state.xAxisArr.length;
                        });
                        if (isErrorData) {
                            return {
                                v: ""
                            };
                        }

                        _this12.state.xAxisArr.map(function (d, i) {
                            //找出当前x区间内的数据
                            baseIdArr.map(function (d1, j) {
                                var startX = i * w + w / (baseIdArr.length + 2) + 10;
                                var barX = startX + (j + 0.5) * w / (baseIdArr.length + 2);
                                var seriesArr = _this12.state.seriesData.filter(function (d2) {
                                    return d2.baseId == d1;
                                });
                                var stackY = 0,
                                    minusStackY = 0;
                                seriesArr.forEach(function (d2, k) {
                                    var barHeight = d2.vectors[i].sourceY;
                                    if (barHeight > 0) {
                                        var bar = _react2.default.createElement("path", { key: i + "-" + j + "-" + k, stroke: d2.color, strokeWidth: barWidth,
                                            d: "M" + barX + " " + _this12.yTransformToSvg(stackY) + " L" + barX + " " + _this12.yTransformToSvg(stackY + barHeight),
                                            ref: function ref(bar) {
                                                _this12["bar" + d2.id + i] = bar;
                                            } });
                                        stackY += barHeight;
                                        bars.push(bar);
                                    } else if (barHeight < 0) {
                                        var _bar = _react2.default.createElement("path", { key: i + "-" + j + "-" + k, stroke: d2.color, strokeWidth: barWidth,
                                            d: "M" + barX + " " + _this12.yTransformToSvg(minusStackY) + " L" + barX + " " + _this12.yTransformToSvg(minusStackY + barHeight),
                                            ref: function ref(bar) {
                                                _this12["bar" + d2.id + i] = bar;
                                            } });
                                        minusStackY += barHeight;
                                        bars.push(_bar);
                                    }
                                });
                            });
                        });

                        g = _react2.default.createElement(
                            "g",
                            { className: _index2.default.bar },
                            bars
                        );
                        break;
                }
            }();

            if ((typeof _ret6 === "undefined" ? "undefined" : _typeof(_ret6)) === "object") return _ret6.v;
            return g;
        }

        /**
         * 绘制右上角的说明
         */

    }, {
        key: "setDeclare",
        value: function setDeclare() {
            var _this13 = this;

            var dom = _react2.default.createElement(
                "g",
                { className: _index2.default.declare },
                this.state.seriesData.map(function (d, i) {
                    var x = 91;
                    var y = 15 + i * 2;
                    var color = d.color;
                    var symbol = void 0;
                    switch (_this13.state.type) {
                        case "curve":
                            symbol = _react2.default.createElement(
                                "g",
                                { key: i },
                                _react2.default.createElement("path", {
                                    style: _this13.state["dot-" + d.id + "-active"] ? { strokeWidth: 0.6 } : {},
                                    stroke: color, d: "M" + x + " " + y + " h3" }),
                                _this13.getDotsSymbol(i, d.id, 92.5, y, color),
                                _react2.default.createElement(
                                    "text",
                                    { x: "94.5", y: y + 0.5 },
                                    d.name
                                )
                            );
                            break;
                        case "bar":
                            var isValid = true;
                            if (_this13.state.type == "bar" && _this13.state.activeSeries != undefined) {
                                //柱状图
                                var index = _this13.state.xAxisArr.findIndex(function (d) {
                                    return d == _this13.state.activeX;
                                });
                                if (index >= 0) {
                                    isValid = false;
                                }
                            }
                            var offsetX = _this13.state["dot-" + d.id + "-active"] ? 0.2 : 0;
                            var offsetY = _this13.state["dot-" + d.id + "-active"] ? 0.2 : 0;
                            symbol = isValid ? _react2.default.createElement(
                                "g",
                                { key: i },
                                _react2.default.createElement("rect", { fill: color, x: x - offsetX, y: y - offsetY, width: 3 + offsetX * 2,
                                    height: 1 + offsetY * 2 }),
                                _react2.default.createElement(
                                    "text",
                                    { x: "94.5", y: y + 1 },
                                    d.name
                                )
                            ) : "";
                            break;
                    }
                    return symbol;
                }),
                this.setTypeList()
            );
            return dom;
        }

        /**
         * 绘制鼠标悬浮时的提示框
         * @returns {*}
         */

    }, {
        key: "setTips",
        value: function setTips() {
            var dom = this.state.tipsX && this.state.tipsY ? _react2.default.createElement(
                "g",
                { className: _index2.default.tips },
                this.setTipsBorder(),
                this.setTipsText()
            ) : "";
            return dom;
        }

        /**
         * 如果x坐标类型为日期或数字，则自动根据大小对x轴进行排序
         * @param d
         * @returns {Array.<T>|*|{options, browsertest, dist, rhino, rhinolessc}|string}
         */

    }, {
        key: "sortData",
        value: function sortData(d) {
            var _this14 = this;

            var data = d.concat();
            var dateRegex = new RegExp(/^[1-2]\d{3}-((0[1-9])|(1[0-2])|[1-9])-((0[1-9])|([1-2]\d)|(3[0-1])|[1-9])$/);
            var numberRegex = new RegExp(/^\d+$/);
            var isDate = data.every(function (d1) {
                return dateRegex.test(d1[_this14.props.x]);
            });
            var isNumber = data.every(function (d1) {
                return numberRegex.test(d1[_this14.props.x]);
            });

            if (isDate) {
                data.sort(function (a, b) {
                    var arr1 = a[_this14.props.x].split("-");
                    var arr2 = b[_this14.props.x].split("-");
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
                data.sort(function (a, b) {
                    return a[_this14.props.x] - b[_this14.props.x];
                });
            }

            return data;
        }

        /**
         * 获取每个系列
         * @param data
         */

    }, {
        key: "buildSeries",
        value: function buildSeries(data, y) {
            var _this15 = this;

            var xValueArr = [];
            var xAxisArr = data.filter(function (d) {
                if (xValueArr.includes(d[_this15.state.x])) {
                    return false;
                } else {
                    xValueArr.push(d[_this15.state.x]);
                    return true;
                }
            }).map(function (d) {
                return d[_this15.state.x];
            });
            var group = this.props.group ? this.props.group : [];

            //找出data中存在的所有分组
            var groupIdArr = [];
            data.forEach(function (d) {
                var groupId = group.map(function (d1) {
                    return d[d1];
                }).join("-");
                if (!groupIdArr.includes(groupId)) {
                    groupIdArr.push(groupId);
                }
            });

            var groupData = groupIdArr.map(function (d) {
                //遍历data，找到该分组的所有数据
                var thisGroupData = data.filter(function (d1) {
                    var groupId = group.map(function (d2) {
                        return d1[d2];
                    }).join("-");
                    return groupId == d;
                });
                //按0补全分组数据
                xAxisArr.forEach(function (d2) {
                    var findData = thisGroupData.find(function (d3) {
                        return d3[_this15.state.x] == d2;
                    });
                    if (findData == undefined) {
                        (function () {
                            //如果该x坐标内没有对应的数据，全部补全为0
                            var json = {};
                            json[_this15.state.x] = d2;
                            y.forEach(function (d3) {
                                json[d3.id] = 0;
                            });
                            thisGroupData.push(json);
                        })();
                    } else {
                        //如果该x坐标内的数据未包含的y[id]属性或y[id]为null的值，全部设置为0
                        thisGroupData = thisGroupData.map(function (d3) {
                            if (d3[_this15.state.x] == d2) {
                                y.forEach(function (d4) {
                                    if (!d3.hasOwnProperty(d4.id) || d3[d4.id] == null) {
                                        d3[d4.id] = 0;
                                    }
                                });
                            }
                            return d3;
                        });
                    }
                });
                thisGroupData = _this15.sortData(thisGroupData);
                return { id: d, data: thisGroupData };
            });

            //根据分组data得出每个系列的data
            var seriesData = [];
            groupData.forEach(function (d) {
                y.forEach(function (d1) {
                    var id = d1.id + "-" + d.id;
                    var vectors = d.data.map(function (d2, i) {
                        var x = _this15.xTransformToSvg(i);
                        var y = _this15.yTransformToSvg(d2[d1.id]);
                        return { x: x, y: y, sourceY: d2[d1.id] };
                    });

                    //如果所有的y值均为0,则忽略该系列
                    var isAll0 = vectors.every(function (d2) {
                        return d2.sourceY === 0;
                    });
                    if (!isAll0) {
                        var groupId = d.id;
                        groupId = groupId == "-" || groupId == "" ? "" : "-" + groupId;
                        var name = d1.name + groupId;
                        var json = { id: id, name: name, vectors: vectors, groupId: d.id, baseId: d1.id };
                        seriesData.push(json);
                    }
                });
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

    }, {
        key: "getYAxisNumArr",
        value: function getYAxisNumArr(data, type) {
            var _this16 = this;

            //获取data中最大和最小的值
            var max = void 0,
                min = void 0;
            if (type == "bar") {
                (function () {
                    var xValueArr = [];
                    var xAxisArr = data.filter(function (d) {
                        if (xValueArr.includes(d[_this16.state.x])) {
                            return false;
                        } else {
                            xValueArr.push(d[_this16.state.x]);
                            return true;
                        }
                    }).map(function (d) {
                        return d[_this16.state.x];
                    });
                    //bar需要按分组先堆叠，再进行计算
                    _this16.props.y.forEach(function (d) {
                        xAxisArr.forEach(function (d1) {
                            var minValue = 0,
                                maxValue = 0;
                            data.filter(function (d2) {
                                return d2.hasOwnProperty(d.id) && d2[_this16.state.x] == d1;
                            }).forEach(function (d2) {
                                var v = d2[d.id];
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
                        });
                    });
                })();
            } else {
                data.forEach(function (d) {
                    _this16.props.y.forEach(function (d1) {
                        var id = d1.id;
                        var value = d[id];
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

            var yStart = Math.abs(min);
            var yEnd = Math.abs(max);
            var pStart = void 0,
                pEnd = 0;
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
            var p = void 0;
            if (pStart == undefined) {
                p = pEnd;
            } else {
                p = Math.max(pStart, pEnd);
            }
            var yAixsStart = void 0,
                yAixsEnd = void 0;
            var calibration = Math.pow(10, p - 1);
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
            var calibrationStart = void 0,
                calibrationEnd = void 0;
            for (var i = yAixsStart; i <= yAixsEnd; i = i + calibration) {
                if (p <= 0) {
                    var scale = Math.pow(10, -p + 1);
                    if (i * scale + calibration * scale >= min * scale) {
                        calibrationStart = i;
                        break;
                    }
                } else {
                    if (i + calibration >= min) {
                        calibrationStart = i;
                        break;
                    }
                }
            }
            for (var _i = yAixsStart; _i <= yAixsEnd; _i = _i + calibration) {
                if (p <= 0) {
                    var _scale = Math.pow(10, -p + 1);
                    if (_i * _scale + calibration * _scale >= max * _scale) {
                        calibrationEnd = (_i * _scale + calibration * _scale) / _scale;
                        break;
                    }
                } else {
                    if (_i + calibration >= max) {
                        calibrationEnd = _i + calibration;
                        break;
                    }
                }
            }

            var yAxisNumArr = [];
            var n = void 0;
            if (p <= 0) {
                var _scale2 = Math.pow(10, -p + 1);
                n = (calibrationEnd * _scale2 - calibrationStart * _scale2) / (calibration * _scale2);
            } else {
                n = (calibrationEnd - calibrationStart) / calibration;
            }
            var step = calibration;
            var fixedNum = -p + 1;
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

            for (var _i2 = calibrationStart; _i2 <= calibrationEnd; _i2 = _i2 + step) {
                var d = _i2;
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

    }, {
        key: "vectorTransformToSvg",
        value: function vectorTransformToSvg(vector) {
            var x = vector.x,
                y = vector.y;

            x = this.xTransformToSvg(x);
            y = this.yTransformToSvg(y);
            return { x: x, y: y };
        }

        /**
         * 将自然坐标 x 转化为 svg 坐标系的值
         * @param x
         * @returns {number|*}
         */

    }, {
        key: "xTransformToSvg",
        value: function xTransformToSvg(x) {
            var w = this.state.xUnitLength;
            x = x * w + 10 + w / 2;
            return x;
        }

        /**
         * 将自然坐标 y 转化为 svg 坐标系的值
         * @param y
         * @returns {*}
         */

    }, {
        key: "yTransformToSvg",
        value: function yTransformToSvg(y) {
            var min = void 0,
                max = void 0;
            this.state.yAxisNumArr.forEach(function (d) {
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
            var yPercent = (y - min) / (max - min);
            yPercent = Math.max(0, yPercent);
            yPercent = 1 - yPercent;
            var svgY = 15 + yPercent * 40;
            return svgY;
        }

        /**
         * 将自然坐标的高度转化为 svg 坐标系的高度
         * @param h
         */

    }, {
        key: "heightTransformToSvg",
        value: function heightTransformToSvg(h) {
            var min = void 0,
                max = void 0;
            this.state.yAxisNumArr.forEach(function (d) {
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
            var yPercent = h / (max - min);
            var height = yPercent * 40;
            return height;
        }

        /**
         * 将svg坐标 y 转化为自然坐标系的值
         * @param y
         * @returns {number|*}
         */

    }, {
        key: "yTransformToNatural",
        value: function yTransformToNatural(y) {
            var min = void 0,
                max = void 0;
            this.state.yAxisNumArr.forEach(function (d) {
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
            var yPercent = (55 - y) / 55;
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

    }, {
        key: "getBezierCurvesVector",
        value: function getBezierCurvesVector(lastX, lastY, x, y) {
            var angleNum = this.state.angleNum;
            angleNum = angleNum / 180 * Math.PI;
            var endPointLineLength = this.state.endPointLineLength;
            var x1 = void 0,
                y1 = void 0,
                x2 = void 0,
                y2 = void 0;
            var pathLength = Math.sqrt(Math.pow(Math.abs(y - lastY), 2) + Math.pow(x - lastX, 2));
            var length = pathLength * endPointLineLength;
            var atanAngle = Math.atan(Math.abs(y - lastY) / (x - lastX));
            var anglePoint1 = Math.PI - angleNum - atanAngle;
            var anglePoint2 = Math.PI - angleNum - (Math.PI / 2 - atanAngle);
            var anglePoint1X = Math.cos(anglePoint1) * length;
            var anglePoint1Y = Math.sin(anglePoint1) * length;
            var anglePoint2X = Math.sin(anglePoint2) * length;
            var anglePoint2Y = Math.cos(anglePoint2) * length;
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

            var vector = {
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

    }, {
        key: "getDotsSymbol",
        value: function getDotsSymbol(index, id, x, y, color) {
            var dots = void 0,
                r = void 0;
            switch (index % 5) {
                //圆
                case 0:
                    r = 0.3;
                    dots = _react2.default.createElement("circle", { stroke: color, fill: color, cx: x, cy: y, r: r,
                        style: this.state["dot-" + id + "-active"] ? { strokeWidth: 0.6 } : {} });
                    break;
                //正方形
                case 1:
                    r = 0.4;
                    dots = _react2.default.createElement("path", { stroke: color, fill: color, d: "M" + (x - r / 2) + " " + (y - r / 2) + " h" + r + " v" + r + " h-" + r + " z",
                        style: this.state["dot-" + id + "-active"] ? { strokeWidth: 0.6 } : {} });
                    break;
                //正方形逆时针旋转45度
                case 2:
                    r = 0.4;
                    dots = _react2.default.createElement("path", { stroke: color, fill: color, transform: "rotate(-45," + x + "," + y + ")",
                        d: "M" + (x - r / 2) + " " + (y - r / 2) + " h" + r + " v" + r + " h-" + r + " z",
                        style: this.state["dot-" + id + "-active"] ? { strokeWidth: 0.6 } : {} });
                    break;
                //三角形
                case 3:
                    r = 0.4;
                    dots = _react2.default.createElement("path", { stroke: color, fill: color, d: "M" + (x - r / 2) + " " + (y + r / 2) + " h" + r + " L" + x + " " + (y - r / 2) + " z",
                        style: this.state["dot-" + id + "-active"] ? { strokeWidth: 0.6 } : {} });
                    break;
                //反三角形
                case 4:
                    r = 0.4;
                    dots = _react2.default.createElement("path", { stroke: color, fill: color, d: "M" + (x - r / 2) + " " + (y - r / 2) + " h" + r + " L" + x + " " + (y + r / 2) + " z",
                        style: this.state["dot-" + id + "-active"] ? { strokeWidth: 0.6 } : {} });
                    break;

            }
            return dots;
        }

        /**
         * 根据鼠标位置设置激活的系列
         * @param e
         */

    }, {
        key: "setActive",
        value: function setActive(e) {
            //如果没有数据，则不执行操作
            if (this.state.seriesData.length == 0) {
                return;
            }

            var offset = (0, _jquery2.default)(this.svg).offset();
            var x = e.pageX - offset.left;
            var y = e.pageY - offset.top;
            x = x / (0, _jquery2.default)(this.svg).width() * this.state.viewBoxWidth;
            y = y / (0, _jquery2.default)(this.svg).height() * this.state.viewBoxHeight;

            var _getNearestSeries = this.getNearestSeries(x, y),
                series = _getNearestSeries.series,
                tipsX = _getNearestSeries.tipsX,
                tipsY = _getNearestSeries.tipsY,
                activeX = _getNearestSeries.activeX,
                isInAxis = _getNearestSeries.isInAxis;

            var json = { tipsX: tipsX, tipsY: tipsY, activeSeries: series, activeX: activeX, isInAxis: isInAxis };
            if (series) {
                json["dot-" + series + "-active"] = true;
                json["curve-" + series + "-active"] = true;
                this.state.seriesData.filter(function (d) {
                    return d.id != series;
                }).forEach(function (d) {
                    json["dot-" + d.id + "-active"] = false;
                    json["curve-" + d.id + "-active"] = false;
                });
                this.setState(json);
            } else {
                this.state.seriesData.forEach(function (d) {
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

    }, {
        key: "getNearestSeries",
        value: function getNearestSeries(x, y) {
            var _this17 = this;

            var series = void 0,
                isInAxis = false;
            var tipsX = void 0,
                tipsY = void 0,
                index = void 0,
                activeX = void 0;
            var w = this.state.xUnitLength;
            if (x >= 10 && x <= 90 && y >= 15 && y <= 55) {
                isInAxis = true;
                switch (this.state.type) {
                    case "curve":
                        //根据x和斜率寻找最近的y
                        var yMap = [];
                        if (x <= 10 + w / 2) {
                            //线条左边空白区域取第一个元素的值
                            tipsX = 10 + w / 2;
                            index = 0;
                            yMap = this.state.seriesData.map(function (d) {
                                var lineY = d.vectors[0].y;
                                return { id: d.id, y: lineY };
                            });
                        } else if (x >= 90 - w / 2) {
                            //线条右边空白区域取最后一个元素的值
                            tipsX = 10 + w / 2 + (this.state.xAxisArr.length - 1) * w;
                            index = this.state.xAxisArr.length - 1;
                            yMap = this.state.seriesData.map(function (d) {
                                var lineY = d.vectors[d.vectors.length - 1].y;
                                return { id: d.id, y: lineY };
                            });
                        } else {
                            (function () {
                                //线条中间部分根据斜率进行计算
                                var startIndex = void 0,
                                    endIndex = void 0;
                                for (var i = 0; i < _this17.state.xAxisArr.length - 1; i++) {
                                    var startX = 10 + i * w + w / 2;
                                    var endX = 10 + (i + 1) * w + w / 2;
                                    if (x >= startX && x <= endX) {
                                        startIndex = i;
                                        endIndex = i + 1;
                                        break;
                                    }
                                }
                                var x1 = 10 + startIndex * w + w / 2;
                                var x2 = 10 + endIndex * w + w / 2;
                                if (x <= (x1 + x2) / 2) {
                                    tipsX = 10 + w / 2 + startIndex * w;
                                    index = startIndex;
                                } else {
                                    tipsX = 10 + w / 2 + endIndex * w;
                                    index = endIndex;
                                }
                                //根据斜率算出鼠标x点的各系列y数组
                                yMap = _this17.state.seriesData.map(function (d) {
                                    var y1 = d.vectors[startIndex].y;
                                    var y2 = d.vectors[endIndex].y;
                                    var slope = (y2 - y1) / (x2 - x1);
                                    var lineY = (x - x1) * slope + y1;
                                    return { id: d.id, y: lineY };
                                });
                            })();
                        }
                        //对获取到的所有y进行从小到大排序
                        yMap.sort(function (a, b) {
                            return a.y - b.y;
                        });
                        if (y < yMap[0].y) {
                            series = yMap[0].id;
                        } else if (y > yMap[yMap.length - 1].y) {
                            series = yMap[yMap.length - 1].id;
                        } else {
                            for (var i = 0; i < yMap.length - 1; i++) {
                                var startY = yMap[i].y;
                                var endY = yMap[i + 1].y;
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
                        var findSeries = this.state.seriesData.find(function (d) {
                            return d.id == series;
                        });
                        var vectors = findSeries.vectors;
                        var vector = vectors[index];
                        tipsY = vector.y;
                        activeX = this.state.xAxisArr[index];
                        break;
                    case "bar":
                        if (x > 10 && x < 90 && y > 15 && y < 55) {
                            for (var _i3 = 0; _i3 < this.state.xAxisArr.length; _i3++) {
                                var startX = _i3 * w + 10;
                                var endX = (_i3 + 1) * w + 10;
                                if (x > startX && x < endX) {
                                    series = "";
                                    activeX = this.state.xAxisArr[_i3];
                                }
                            }
                        }
                        break;
                }
            }
            return { series: series, tipsX: tipsX, tipsY: tipsY, activeX: activeX, isInAxis: isInAxis };
        }

        /**
         * 设置随机颜色
         * @param seriesData
         * @returns {*}
         */

    }, {
        key: "setColor",
        value: function setColor(seriesData) {
            var data = seriesData == undefined ? this.state.seriesData : seriesData;
            var max = 360;
            var step = Math.floor(max / data.length);
            data = data.map(function (d, i) {
                //设定颜色的波动范围为25%-75%个step之间
                var h = step * i + step / 4;
                var r = Math.floor(Math.random() * step / 2);
                h = h + r;
                var s = "50%";
                var l = "50%";
                d.color = "hsla(" + h + "," + s + "," + l + ",1)";
                return d;
            });
            return data;
        }

        /**
         * 设置鼠标悬浮时提示的文字
         * @returns {*}
         */

    }, {
        key: "setTipsText",
        value: function setTipsText() {
            var _this18 = this;

            var startX = this.state.tipsX;
            var startY = this.state.tipsY - this.state.tipsMarginBottom - this.state.tipsRaisedY - this.state.tipsPaddingBottom;
            var text = "",
                color = void 0;
            if (this.state.type != "bar") {
                (function () {
                    var findSeries = _this18.state.seriesData.find(function (d) {
                        return d.id == _this18.state.activeSeries;
                    });
                    color = findSeries.color;
                    var xText = _this18.state.activeX;
                    var xIndex = _this18.state.xAxisArr.findIndex(function (d) {
                        return d == xText;
                    });
                    var yText = findSeries.vectors[xIndex].sourceY;
                    var activeText = _this18.state.seriesData.find(function (d) {
                        return d.id == _this18.state.activeSeries;
                    }).name;
                    text = _react2.default.createElement(
                        "text",
                        { color: color, x: startX, y: startY, ref: function ref(d) {
                                _this18.tipsText = d;
                            } },
                        activeText,
                        " : ",
                        yText + "" + (_this18.props.tipsSuffix ? _this18.props.tipsSuffix : "")
                    );
                })();
            }
            return text;
        }

        /**
         * 设置鼠标悬浮时提示的边框
         * @returns {*}
         */

    }, {
        key: "setTipsBorder",
        value: function setTipsBorder() {
            var _this19 = this;

            var path = "";
            if (this.state.type != "bar") {
                var arcRx = 0.5,
                    arcRy = 0.5;
                var startX = this.state.tipsX;
                var startY = this.state.tipsY - this.state.tipsMarginBottom;
                var color = this.state.seriesData.find(function (d) {
                    return d.id == _this19.state.activeSeries;
                }).color;
                path = this.state.tipsWidth ? _react2.default.createElement("path", { stroke: color,
                    d: "M" + startX + " " + startY + " l" + -this.state.tipsRaisedX + " " + -this.state.tipsRaisedY + "\n                  l" + -(this.state.tipsWidth / 2 - this.state.tipsRaisedX + this.state.tipsPaddingLeft) + " 0\n                  a" + arcRx + " " + arcRy + " 0 0 1 " + -arcRx + " " + -arcRy + "\n                  l0 " + -(this.state.tipsHeight + this.state.tipsPaddingBottom + this.state.tipsPaddingTop - arcRy) + "\n                  l" + (this.state.tipsWidth + this.state.tipsPaddingLeft + this.state.tipsPaddingRight + arcRx * 2) + " 0\n                  l0 " + (this.state.tipsHeight + this.state.tipsPaddingBottom + this.state.tipsPaddingTop - arcRy) + "\n                  a" + arcRx + " " + arcRy + " 0 0 1 " + -arcRx + " " + arcRy + "\n                  l" + -(this.state.tipsWidth / 2 - this.state.tipsRaisedX + this.state.tipsPaddingRight) + " 0 z" }) : "";
            }
            return path;
        }

        /**
         * 鼠标离开svg元素时的判断
         * @param e
         */

    }, {
        key: "mouseLeave",
        value: function mouseLeave(e) {
            var isInAxis = false;
            var offset = (0, _jquery2.default)(this.svg).offset();
            var x = e.pageX - offset.left;
            var y = e.pageY - offset.top;
            x = x / (0, _jquery2.default)(this.svg).width() * this.state.viewBoxWidth;
            y = y / (0, _jquery2.default)(this.svg).height() * this.state.viewBoxHeight;
            if (x >= 10 && x <= 90 && y >= 15 && y <= 55) {
                isInAxis = true;
            }
            this.setState({
                isInAxis: isInAxis
            });
        }
    }]);

    return chart;
}(_react2.default.Component);

module.exports = chart;
