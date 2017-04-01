"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * react全屏滚动组件,组件第一级子元素每一页的dom
 * dots：为false或"false"时不显示，默认显示
 * index：初始位置，默认为0
 * animateWillMount：动画执行前的回调
 * animateDidMount：动画执行后的回调
 * 示例：
 * <Scroll>
 *     <div>1</div>
 *     <div>2</div>
 *     <div>3</div>
 * </Scroll>
 */
var scroll = function (_React$Component) {
    _inherits(scroll, _React$Component);

    function scroll(props) {
        _classCallCheck(this, scroll);

        var _this = _possibleConstructorReturn(this, (scroll.__proto__ || Object.getPrototypeOf(scroll)).call(this, props));

        _this.state = {
            content: [],
            index: _this.props.index ? _this.props.index : 0,
            isScrolling: false
        };
        var bindArr = ["delegateScroll", "delegateTouch", "animateTo", "startMove", "doMove", "endMove"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(scroll, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            this.delegateTouch();
            this.delegateScroll();
            var content = this.props.children;
            this.setState({
                content: content,
                dots: !(this.props.dots == false || this.props.dots == "false")
            });
            (0, _jquery2.default)(window).resize(function () {
                _this2.setState({
                    height: (0, _jquery2.default)(window).height()
                });
            });
        }
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            this.setState({
                height: (0, _jquery2.default)(window).height()
            });
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var state = {};
            if (nextProps.children != this.props.children) {
                state.content = nextProps.children;
            }
            if (Object.keys(state).length != 0) {
                this.setState(state);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: _index2.default.base + " react-scroll" },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.container, ref: function ref(d) {
                            _this3.container = d;
                        } },
                    this.state.content.map(function (d, i) {
                        var style = {
                            height: _this3.state.height
                        };
                        return _react2.default.createElement(
                            "div",
                            { className: _index2.default.item, key: i, style: style, ref: function ref(d1) {
                                    _this3["item" + i] = d1;
                                } },
                            d
                        );
                    })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.dots, style: this.state.dots ? {} : { display: "none" } },
                    this.state.content.map(function (d, i) {
                        return _react2.default.createElement("div", { key: i,
                            className: _this3.state.index == i ? _index2.default.dot + " " + _index2.default.active : _index2.default.dot,
                            onClick: function onClick() {
                                _this3.animateTo(i);
                            } });
                    })
                )
            );
        }

        /**
         * 滚动到某一页
         * @param i
         */

    }, {
        key: "animateTo",
        value: function animateTo(i) {
            var _this4 = this;

            if (this.props.animateWillMount) {
                this.props.animateWillMount(i);
            }
            this.setState({
                isScrolling: true,
                index: i
            }, function () {
                (0, _jquery2.default)(_this4.container).animate({
                    "margin-top": -(0, _jquery2.default)(window).height() * _this4.state.index
                }, 800, "linear", function () {
                    if (_this4.props.animateDidMount) {
                        _this4.props.animateDidMount(i);
                    }
                    _this4.setState({ isScrolling: false });
                });
            });
        }
    }, {
        key: "startMove",
        value: function startMove(y) {
            this.setState({
                start: y
            });
        }
    }, {
        key: "doMove",
        value: function doMove(y) {
            this.setState({
                end: y
            });
        }
    }, {
        key: "endMove",
        value: function endMove() {
            var delta = this.state.end - this.state.start;
            if (Math.abs(delta) < 30) {
                return;
            }
            this.doScroll(delta);
        }

        /**
         * 监听触摸事件
         */

    }, {
        key: "delegateTouch",
        value: function delegateTouch() {
            var _this5 = this;

            this.container.addEventListener('touchstart', function (e) {
                e.preventDefault();
                if (_this5.state.isScrolling) {
                    return;
                }
                _this5.startMove(e.touches[0].pageY);
            }, false);
            this.container.addEventListener('touchmove', function (e) {
                e.preventDefault();
                if (_this5.state.isScrolling) {
                    return;
                }
                _this5.doMove(e.touches[0].pageY);
            }, false);
            this.container.addEventListener('touchend', function (e) {
                e.preventDefault();
                if (_this5.state.isScrolling) {
                    return;
                }
                _this5.endMove();
            });
        }

        /**
         * 执行滚动
         * @param delta
         */

    }, {
        key: "doScroll",
        value: function doScroll(delta) {
            var index = this.state.index;
            if (delta > 0) {
                //朝前滚动
                if (index == 0) {
                    return;
                }
                index--;
            } else {
                //朝后滚动
                if (index == this.state.content.length - 1) {
                    return;
                }
                index++;
            }
            this.animateTo(index);
        }

        /**
         * 监听鼠标滚动事件
         */

    }, {
        key: "delegateScroll",
        value: function delegateScroll() {
            var _this6 = this;

            (0, _jquery2.default)(document).delegate("", "mousewheel DOMMouseScroll", function (event) {
                event.preventDefault();
                if (_this6.state.isScrolling) {
                    return;
                }
                var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                _this6.doScroll(delta);
            });
        }
    }]);

    return scroll;
}(_react2.default.Component);

module.exports = scroll;
