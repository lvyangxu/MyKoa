"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

require("font-awesome-webpack");

var _karlDate = require("karl-date");

var _karlDate2 = _interopRequireDefault(_karlDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * react日期组件
 * type：日期类型，day/month/second，默认为day
 * add：默认值的偏移量，默认为0
 * callback：日期改变时执行的回调
 * initCallback：初始化后执行的回调
 *
 * 示例：
 * <Datepicker add="2" type="month" callback={d=>{
 *         console.log('date is '+d);
 *     }}/>
 */
var datepicker = function (_React$Component) {
    _inherits(datepicker, _React$Component);

    function datepicker(props) {
        _classCallCheck(this, datepicker);

        var _this = _possibleConstructorReturn(this, (datepicker.__proto__ || Object.getPrototypeOf(datepicker)).call(this, props));

        var type = _this.props.type ? _this.props.type : "day";
        var add = _this.props.add ? _this.props.add : 0;
        add = Number.parseInt(add);
        var currentPanel = void 0;
        switch (type) {
            case "day":
            case "second":
                currentPanel = "day";
                break;
            case "month":
                currentPanel = "month";
                break;
        }

        var _date$add = _karlDate2.default.add(new Date()),
            year1 = _date$add.year,
            month1 = _date$add.month,
            day1 = _date$add.day,
            hour1 = _date$add.hour,
            minute1 = _date$add.minute,
            second1 = _date$add.second;

        switch (type) {
            case "day":
                day1 = day1 + add;
                break;
            case "month":
                month1 = month1 + add;
                break;
            case "second":
                second1 = second1 + add;
                break;
        }

        var _date$add2 = _karlDate2.default.add({
            year: year1,
            month: month1,
            day: day1,
            hour: hour1,
            minute: minute1,
            second: second1
        }),
            year = _date$add2.year,
            month = _date$add2.month,
            day = _date$add2.day,
            hour = _date$add2.hour,
            minute = _date$add2.minute,
            second = _date$add2.second;

        var value = _this.buildValue({
            type: type,
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
        });
        _this.state = {
            panelShow: false,
            type: type,
            currentPanel: currentPanel,
            startYear: year - 100,
            endYear: year + 100,
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second,
            panelYear: year,
            panelMonth: month,
            panelDay: day,
            panelHour: hour,
            panelMinute: minute,
            panelSecond: second,
            value: value
        };

        var bindArr = ["panelToggle"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });

        return _this;
    }

    _createClass(datepicker, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            window.addEventListener("click", function () {
                if (_this2.state.panelShow) {
                    _this2.setState({ panelShow: false });
                }
            }, false);
            if (this.props.initCallback) {
                this.props.initCallback(this.state.value);
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {}
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var ymdValue = this.state.value.match(/\d{4}-\d{2}-\d{2}/)[0];
            var hmsValue = this.state.value.match(/\d{2}:\d{2}:\d{2}/);
            var arr = [];
            if (hmsValue != null) {
                hmsValue = hmsValue[0];
                arr = hmsValue.split(":");
            }

            var valueDom = this.state.type == "second" ? _react2.default.createElement(
                "div",
                { className: _index2.default.value },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.left },
                    ymdValue
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.right, onClick: function onClick(e) {
                            e.stopPropagation();
                        } },
                    _react2.default.createElement("input", { type: "number", min: "0", max: "23", value: arr[0], onWheel: function onWheel(e) {
                            _this3.doWheel(e, "hour");
                        }, onClick: function onClick(e) {
                            e.stopPropagation();
                        }, onChange: function onChange(e) {
                            var regex = /^(([0-1]?\d)|(2[0-3])|(0?((1\d)|(2[0-3]))))$/;
                            var value = e.target.value;
                            if (value.length == 3) {
                                value = Number.parseInt(value);
                            }
                            if (regex.test(value)) {
                                _this3.setValue("hour", {
                                    hour: value
                                });
                            }
                        } }),
                    ":",
                    _react2.default.createElement("input", { type: "number", min: "0", max: "59", value: arr[1], onWheel: function onWheel(e) {
                            _this3.doWheel(e, "minute");
                        }, onClick: function onClick(e) {
                            e.stopPropagation();
                        }, onChange: function onChange(e) {
                            var regex = /^(0?\d|(0?[0-5]\d))$/;
                            var value = e.target.value;
                            if (value.length == 3) {
                                value = Number.parseInt(value);
                            }
                            if (regex.test(value)) {
                                _this3.setValue("minute", {
                                    minute: value
                                });
                            }
                        } }),
                    ":",
                    _react2.default.createElement("input", { type: "number", min: "0", max: "59", value: arr[2], onWheel: function onWheel(e) {
                            _this3.doWheel(e, "second");
                        }, onClick: function onClick(e) {
                            e.stopPropagation();
                        }, onChange: function onChange(e) {
                            var regex = /^(0?\d|(0?[0-5]\d))$/;
                            var value = e.target.value;
                            if (value.length == 3) {
                                value = Number.parseInt(value);
                            }
                            if (regex.test(value)) {
                                _this3.setValue("second", {
                                    second: value
                                });
                            }
                        } })
                )
            ) : _react2.default.createElement(
                "div",
                { className: _index2.default.value },
                ymdValue
            );
            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-datepicker" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.input, onClick: this.panelToggle },
                    valueDom,
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.icon },
                        _react2.default.createElement("i", { className: "fa fa-calendar" })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.panel,
                        onClick: function onClick(e) {
                            e.stopPropagation();
                        },
                        style: this.state.panelShow ? {} : { display: "none" } },
                    this.setPanel()
                )
            );
        }

        /**
         * 控制面板的显示和隐藏
         * @param e
         */

    }, {
        key: "panelToggle",
        value: function panelToggle(e) {
            e.stopPropagation();
            this.setState({
                panelShow: !this.state.panelShow
            });
        }

        /**
         * 根据日期类型绘制ui
         * @returns {*}
         */

    }, {
        key: "setPanel",
        value: function setPanel() {

            var content = void 0;
            switch (this.state.currentPanel) {
                case "day":
                    content = this.drawDayPanel();
                    break;
                default:
                    content = this.drawPanel(this.state.currentPanel);
                    break;
            }
            return content;
        }

        /**
         * 绘制除日面板以外的所有面板
         * @param type
         * @returns {XML}
         */

    }, {
        key: "drawPanel",
        value: function drawPanel(type) {
            var _this4 = this;

            var arr = [];
            var gradtion = ["year", "month", "day", "hour", "minute", "second"];
            var index = gradtion.findIndex(function (d) {
                return d == type;
            });
            var start = void 0,
                end = void 0,
                step = void 0,
                title = void 0;
            switch (type) {
                case "year":
                    var modNum = this.state.year % 12;
                    start = this.state.year - 12 + modNum + 1;
                    end = this.state.year + modNum;
                    step = 4;
                    title = start + "-" + end;
                    break;
                case "month":
                    start = 1;
                    end = 12;
                    step = 4;
                    title = this.state.year + "\u5E74";
                    break;
            }

            for (var i = start; i <= end; i = i + step) {
                var row = [];
                for (var j = 0; j <= step - 1; j++) {
                    row.push(i + j);
                }
                arr.push(row);
            }

            var content = _react2.default.createElement(
                "div",
                { className: _index2.default.content },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.contentHead },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.left, onClick: function onClick() {
                                _this4.doLeft();
                            } },
                        _react2.default.createElement("i", { className: "fa fa-angle-double-left" })
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.middle, onClick: function onClick() {
                                //返回上一级面板，如果已到最高层，则返回第2层
                                var currentPanel = void 0;
                                if (index == 0) {
                                    currentPanel = gradtion[1];
                                } else {
                                    currentPanel = gradtion[index - 1];
                                }
                                _this4.setState({
                                    currentPanel: currentPanel
                                });
                            } },
                        title
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.right, onClick: function onClick() {
                                _this4.doRight();
                            } },
                        _react2.default.createElement("i", { className: "fa fa-angle-double-right" })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.contentBody },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.page },
                        arr.map(function (d, i) {
                            return _react2.default.createElement(
                                "div",
                                { key: i, className: _index2.default.row },
                                d.map(function (d1, j) {
                                    var isEqual = false;
                                    switch (type) {
                                        case "year":
                                            isEqual = _this4.state.year == d1;
                                            break;
                                        case "month":
                                            isEqual = _this4.state.year == _this4.state.panelYear && _this4.state.month == d1;
                                            break;
                                        case "day":
                                            isEqual = _this4.state.year == _this4.state.panelYear && _this4.state.month == _this4.state.panelMonth && _this4.state.day == d1;
                                            break;
                                    }

                                    var className = isEqual ? _index2.default.cell + " " + _index2.default[type] + " " + _index2.default.active : _index2.default.cell + " " + _index2.default[type];
                                    return _react2.default.createElement(
                                        "div",
                                        { key: j, className: className, onClick: function onClick() {
                                                var oldJson = {};
                                                gradtion.forEach(function (d2) {
                                                    if (d2 == type) {
                                                        oldJson[d2] = d1;
                                                    } else {
                                                        oldJson[d2] = _this4.state[d2];
                                                    }
                                                });
                                                var json = _karlDate2.default.add(oldJson);
                                                _this4.setValue(type, json);
                                            } },
                                        d1
                                    );
                                })
                            );
                        })
                    )
                )
            );
            return content;
        }

        /**
         * 绘制日面板
         * @returns {XML}
         */

    }, {
        key: "drawDayPanel",
        value: function drawDayPanel() {
            var _this5 = this;

            var arr = [];
            var gradtion = ["year", "month", "day"];
            var _ref = [this.state.year, this.state.month],
                year = _ref[0],
                month = _ref[1];

            var titleArr = ["一", "二", "三", "四", "五", "六", "日"];
            var daysOfMonth = _karlDate2.default.getDaysOfMonth(year, month);
            var daysOfLastMonth = _karlDate2.default.getDaysOfLastMonth(year, month);
            var daysOfWeek = new Date(year, month - 1, 1).getDay();
            daysOfWeek = daysOfWeek == 0 ? 7 : daysOfWeek;
            var prefixDays = daysOfWeek - 1;

            for (var i = 1; i <= 42; i = i + 7) {
                var row = [];
                //计算该位置的天数
                for (var j = i; j <= i + 6; j++) {
                    if (j <= prefixDays) {
                        var text = daysOfLastMonth - prefixDays + j;
                        row.push({ text: text, add: -1 });
                    } else if (j > daysOfMonth + prefixDays) {
                        var _text = j - daysOfMonth - prefixDays;
                        row.push({ text: _text, add: 1 });
                    } else {
                        var _text2 = j - prefixDays;
                        row.push({ text: _text2, add: 0 });
                    }
                }
                arr.push(row);
            }

            var content = _react2.default.createElement(
                "div",
                { className: _index2.default.content },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.contentHead },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.left, onClick: function onClick() {
                                _this5.doLeft();
                            } },
                        _react2.default.createElement("i", { className: "fa fa-angle-double-left" })
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.middle, onClick: function onClick() {
                                //返回上一级面板，如果已到最高层，则返回第2层
                                var index = gradtion.findIndex(function (d) {
                                    return d == "day";
                                });
                                if (index == 0) {
                                    index = 1;
                                } else {
                                    index--;
                                }
                                _this5.setState({
                                    currentPanel: gradtion[index]
                                });
                            } },
                        this.state.year + "\u5E74" + this.state.month + "\u6708"
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.right, onClick: function onClick() {
                                _this5.doRight();
                            } },
                        _react2.default.createElement("i", { className: "fa fa-angle-double-right" })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.contentBody },
                    _react2.default.createElement(
                        "div",
                        { className: _index2.default.page },
                        _react2.default.createElement(
                            "div",
                            { className: _index2.default.row },
                            titleArr.map(function (d, i) {
                                return _react2.default.createElement(
                                    "div",
                                    { key: i, className: _index2.default.cell + " " + _index2.default.day + " " + _index2.default.title },
                                    d
                                );
                            })
                        ),
                        arr.map(function (d, i) {
                            return _react2.default.createElement(
                                "div",
                                { key: i, className: _index2.default.row },
                                d.map(function (d1, j) {
                                    var isActive = _this5.state.panelYear == _this5.state.year;
                                    isActive = isActive && _this5.state.panelMonth == _this5.state.month;
                                    isActive = isActive && _this5.state.panelDay == d1.text;
                                    isActive = isActive && d1.add == 0;
                                    var className = isActive ? _index2.default.cell + " " + _index2.default.day + " " + _index2.default.active : _index2.default.cell + " " + _index2.default.day;
                                    if (d1.add != 0) {
                                        className = className + " " + _index2.default.dark;
                                    }
                                    return _react2.default.createElement(
                                        "div",
                                        { key: j, className: className, onClick: function onClick() {
                                                var json = _karlDate2.default.add({
                                                    year: _this5.state.year,
                                                    month: _this5.state.month,
                                                    day: d1.text,
                                                    hour: _this5.state.hour,
                                                    minute: _this5.state.minute,
                                                    second: _this5.state.second
                                                }, { month: d1.add });
                                                _this5.setValue("day", json);
                                            } },
                                        d1.text
                                    );
                                })
                            );
                        })
                    )
                )
            );
            return content;
        }
    }, {
        key: "setValue",
        value: function setValue(type, json) {
            var _this6 = this;

            var value = this.buildValue(json);

            var _map = ["year", "month", "day", "hour", "minute", "second"].map(function (d) {
                if (json.hasOwnProperty(d)) {
                    return json[d];
                } else {
                    return _this6.state[d];
                }
            }),
                _map2 = _slicedToArray(_map, 6),
                year = _map2[0],
                month = _map2[1],
                day = _map2[2],
                hour = _map2[3],
                minute = _map2[4],
                second = _map2[5];

            var newState = {
                year: year,
                month: month,
                day: day,
                hour: hour,
                minute: minute,
                second: second,
                panelYear: year,
                panelMonth: month,
                panelDay: day,
                panelHour: hour,
                panelMinute: minute,
                panelSecond: second,
                value: value
            };
            var gradtion = ["year", "month", "day"];
            var endPanel = void 0;
            switch (this.state.type) {
                case "month":
                    endPanel = "month";
                    break;
                case "day":
                case "second":
                    endPanel = "day";
                    break;
            }
            var isLastPanel = false;
            if (this.state.currentPanel == endPanel) {
                //到达最后一级面板时关闭
                isLastPanel = true;
                newState.panelShow = false;
            } else {
                //跳转到下一级面板
                var index = gradtion.findIndex(function (d) {
                    return d == type;
                });
                index++;
                newState.currentPanel = gradtion[index];
            }
            this.setState(newState, function () {
                if (isLastPanel && _this6.props.callback) {
                    _this6.props.callback(value);
                }
            });
        }

        /**
         * 根据年月日时分秒和日期类型构建显示的text value
         * @param json
         * @returns {*}
         */

    }, {
        key: "buildValue",
        value: function buildValue(json) {
            var _this7 = this;

            var type = json.hasOwnProperty("type") ? json.type : this.state.type;

            var _map3 = ["year", "month", "day", "hour", "minute", "second"].map(function (d) {
                var v = void 0;
                if (json.hasOwnProperty(d)) {
                    v = json[d];
                } else {
                    v = _this7.state[d];
                }
                v = Number.parseInt(v);
                v = v < 10 ? "0" + v : v;
                return v;
            }),
                _map4 = _slicedToArray(_map3, 6),
                year = _map4[0],
                month = _map4[1],
                day = _map4[2],
                hour = _map4[3],
                minute = _map4[4],
                second = _map4[5];

            var value = void 0;
            switch (type) {
                case "day":
                    value = year + "-" + month + "-" + day;
                    break;
                case "month":
                    value = year + "-" + month;
                    break;
                case "second":
                    value = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                    break;
            }
            return value;
        }

        /**
         * 日期左按钮
         */

    }, {
        key: "doLeft",
        value: function doLeft() {
            var _this8 = this;

            switch (this.state.currentPanel) {
                case "year":
                    this.setState({
                        year: this.state.year - 12
                    });
                    break;
                default:
                    var json = {};
                    var gradtion = ["year", "month", "day"];
                    var index = gradtion.findIndex(function (d) {
                        return d == _this8.state.currentPanel;
                    });
                    var changePanel = gradtion[index - 1];
                    json[changePanel] = this.state[changePanel] - 1;
                    this.setState(json, function () {
                        var date = new Date(_this8.state.year, _this8.state.month - 1, _this8.state.day, _this8.state.hour, _this8.state.minute, _this8.state.second);
                        _this8.setState({
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes(),
                            second: date.getSeconds()
                        });
                    });
                    break;
            }
        }

        /**
         * 日期右按钮
         */

    }, {
        key: "doRight",
        value: function doRight() {
            var _this9 = this;

            switch (this.state.currentPanel) {
                case "year":
                    this.setState({
                        year: this.state.year + 12
                    });
                    break;
                default:
                    var json = {};
                    var gradtion = ["year", "month", "day"];
                    var index = gradtion.findIndex(function (d) {
                        return d == _this9.state.currentPanel;
                    });
                    var changePanel = gradtion[index - 1];
                    json[changePanel] = this.state[changePanel] + 1;
                    this.setState(json, function () {
                        var date = new Date(_this9.state.year, _this9.state.month - 1, _this9.state.day, _this9.state.hour, _this9.state.minute, _this9.state.second);
                        _this9.setState({
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes(),
                            second: date.getSeconds()
                        });
                    });
                    break;
            }
        }

        /**
         * 时分秒的鼠标滚动处理
         * @param e
         * @param type
         */

    }, {
        key: "doWheel",
        value: function doWheel(e, type) {
            e.preventDefault();
            var json = {};
            var max = type == "hour" ? 23 : 59;
            if (e.deltaY > 0) {
                //向下
                var value = this.state[type];
                if (value > 0) {
                    value--;
                    json[type] = value;
                    this.setValue(type, json);
                }
            } else {
                //向上
                var _value = this.state[type];
                if (_value < max) {
                    _value++;
                    json[type] = _value;
                    this.setValue(type, json);
                }
            }
        }
    }]);

    return datepicker;
}(_react2.default.Component);

module.exports = datepicker;
