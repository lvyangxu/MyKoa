"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

require("font-awesome-webpack");

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var nav = function (_React$Component) {
    _inherits(nav, _React$Component);

    function nav(props) {
        _classCallCheck(this, nav);

        var _this = _possibleConstructorReturn(this, (nav.__proto__ || Object.getPrototypeOf(nav)).call(this, props));

        _this.state = {
            data: [],
            activeDom: "",
            activeId: ""
        };
        var bindArr = [];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(nav, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            //设置菜单和内容的宽度和高度自适应
            (0, _jquery2.default)(document).ready(function () {
                _this2.setSize();
            });

            window.addEventListener("resize", function (e) {
                _this2.setSize();
            });

            var data = this.props.data;
            var activeId = data[0].id;
            var activeDom = data[0].dom;

            var json = {
                data: data,
                activeId: activeId,
                activeDom: activeDom
            };

            //根据锚点设置默认选中的菜单
            var hash = window.location.hash.replace(/#/g, "");
            if (hash != "") {
                var active = data.find(function (d) {
                    return d.id == hash;
                });
                if (active != undefined) {
                    json.activeId = hash;
                    json["group-show-" + active.group] = true;
                }
            }

            this.setState(json);
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {}
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-nav", ref: function ref(d) {
                        _this3.base = d;
                    } },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.menu, ref: function ref(d) {
                            _this3.menu = d;
                        } },
                    this.setMenu()
                ),
                _react2.default.createElement(
                    "div",
                    { style: this.props.sectionStyle == undefined ? {} : this.props.sectionStyle, className: _index2.default.content,
                        ref: function ref(d) {
                            _this3.content = d;
                        } },
                    this.setContent()
                )
            );
        }
    }, {
        key: "setSize",
        value: function setSize() {
            var marginTop = (0, _jquery2.default)(this.base).offset().top;
            var height = (0, _jquery2.default)(window).height() - marginTop;
            var width = (0, _jquery2.default)(window).outerWidth(true) - 200;
            (0, _jquery2.default)(this.menu).css({ height: height });
            (0, _jquery2.default)(this.content).css({
                height: height,
                width: width
            });
        }
    }, {
        key: "setMenu",
        value: function setMenu() {
            var _this4 = this;

            var groups = [];
            this.state.data.forEach(function (d) {
                if (!groups.includes(d.group)) {
                    groups.push(d.group);
                }
            });

            var liArr = [];
            this.state.data.forEach(function (d) {
                if (d.hasOwnProperty("group")) {
                    //如果含有group,判断是否添加过该group
                    var hasInclude = liArr.find(function (d1) {
                        return d1.group == d.group;
                    });

                    if (hasInclude != undefined) {
                        (function () {
                            //如果添加过该group,则将新的数据合并到该一级菜单下
                            var li = _react2.default.createElement(
                                "div",
                                { onClick: function onClick() {
                                        _this4.setState({
                                            activeId: d.id
                                        });
                                    }, key: d.id, className: _this4.state.activeId == d.id ? _index2.default.active + " " + _index2.default.li + " " + _index2.default.li1 : _index2.default.li + " " + _index2.default.li1 },
                                d.name
                            );
                            liArr = liArr.map(function (d1) {
                                if (d1.group == d.group) {
                                    var arr = d1.dom.concat();
                                    arr.push(li);
                                    d1.dom = arr;
                                    return d1;
                                } else {
                                    return d1;
                                }
                            });
                        })();
                    } else {
                        //如果没有添加过group,则新添加一个一级菜单
                        var li = _react2.default.createElement(
                            "div",
                            { onClick: function onClick() {
                                    _this4.setState({
                                        activeId: d.id
                                    });
                                }, key: d.id, className: _this4.state.activeId == d.id ? _index2.default.active + " " + _index2.default.li + " " + _index2.default.li1 : _index2.default.li + " " + _index2.default.li1 },
                            d.name
                        );
                        liArr.push({ group: d.group, dom: [li] });
                    }
                } else {
                    //如果不含有group属性，则为第一级菜单
                    var _li = _react2.default.createElement(
                        "div",
                        { className: _this4.state.activeId == d.id ? _index2.default.active + " " + _index2.default.li : _index2.default.li,
                            onClick: function onClick() {
                                _this4.setState({
                                    activeId: d.id
                                });
                            } },
                        d.name
                    );
                    liArr.push({ dom: _li });
                }
            });

            var menu = liArr.map(function (d, i) {
                var showName = "group-show-" + d.group;
                if (d.hasOwnProperty("group")) {
                    return _react2.default.createElement(
                        "div",
                        { key: i },
                        _react2.default.createElement(
                            "div",
                            { className: _index2.default.li, onClick: function onClick() {
                                    var json = {};
                                    json[showName] = !_this4.state[showName];
                                    _this4.setState(json);
                                } },
                            _react2.default.createElement("i", {
                                className: _this4.state[showName] ? "fa fa-caret-down" : "fa fa-caret-right" }),
                            d.group
                        ),
                        _react2.default.createElement(
                            "div",
                            { style: _this4.state[showName] ? {} : { display: "none" } },
                            d.dom
                        )
                    );
                } else {
                    return _react2.default.createElement(
                        "div",
                        { key: i },
                        d.dom
                    );
                }
            });
            return menu;
        }
    }, {
        key: "setContent",
        value: function setContent() {
            var _this5 = this;

            var active = this.state.data.find(function (d) {
                return d.id == _this5.state.activeId;
            });
            if (active != undefined) {
                window.location.hash = active.id;
            }

            return this.state.data.map(function (d, i) {
                return _react2.default.createElement(
                    "div",
                    { key: i, style: d.id == _this5.state.activeId ? {} : { display: "none" } },
                    d.dom
                );
            });
        }
    }]);

    return nav;
}(_react2.default.Component);

module.exports = nav;
