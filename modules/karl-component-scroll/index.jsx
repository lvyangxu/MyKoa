import React from "react";
import css from "./index.css";
import $ from "jquery";

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
class scroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            index: this.props.index ? this.props.index : 0,
            isScrolling: false
        };
        let bindArr = ["delegateScroll", "delegateTouch", "animateTo", "startMove", "doMove", "endMove"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        this.delegateTouch();
        this.delegateScroll();
        let content = this.props.children;
        this.setState({
            content: content,
            dots: !(this.props.dots == false || this.props.dots == "false"),
        });
        $(window).resize(()=> {
            this.setState({
                height: $(window).height()
            });
        });
    }

    componentWillMount() {
        this.setState({
            height: $(window).height()
        });
    }

    componentWillReceiveProps(nextProps) {
        let state = {};
        if (nextProps.children != this.props.children) {
            state.content = nextProps.children;
        }
        if (Object.keys(state).length != 0) {
            this.setState(state);
        }
    }

    render() {
        return <div className={css.base + " react-scroll"}>
            <div className={css.container} ref={d => {
                this.container = d;
            }}>
                {
                    this.state.content.map((d, i) => {
                        let style = {
                            height: this.state.height
                        };
                        return <div className={css.item} key={i} style={style} ref={d1=> {
                            this["item" + i] = d1;
                        }}>{d}</div>;
                    })
                }
            </div>
            <div className={css.dots} style={this.state.dots ? {} : {display: "none"}}>
                {
                    this.state.content.map((d, i) => {
                        return <div key={i}
                                    className={this.state.index == i ? (css.dot + " " + css.active) : css.dot}
                                    onClick={() => {
                                        this.animateTo(i);
                                    }}></div>
                    })
                }
            </div>
        </div>;
    }

    /**
     * 滚动到某一页
     * @param i
     */
    animateTo(i) {
        if (this.props.animateWillMount) {
            this.props.animateWillMount(i);
        }
        this.setState({
            isScrolling: true,
            index: i
        }, ()=> {
            $(this.container).animate({
                "margin-top": -$(window).height() * this.state.index
            }, 800, "linear", ()=> {
                if (this.props.animateDidMount) {
                    this.props.animateDidMount(i);
                }
                this.setState({isScrolling: false});
            });
        });

    }

    startMove(y) {
        this.setState({
            start: y
        });
    }

    doMove(y) {
        this.setState({
            end: y
        });
    }

    endMove() {
        let delta = this.state.end - this.state.start;
        if (Math.abs(delta) < 30) {
            return;
        }
        this.doScroll(delta);
    }

    /**
     * 监听触摸事件
     */
    delegateTouch() {
        this.container.addEventListener('touchstart', e => {
            e.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            this.startMove(e.touches[0].pageY);
        }, false);
        this.container.addEventListener('touchmove', e => {
            e.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            this.doMove(e.touches[0].pageY);
        }, false);
        this.container.addEventListener('touchend', e => {
            e.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            this.endMove();
        });
    }

    /**
     * 执行滚动
     * @param delta
     */
    doScroll(delta) {
        let index = this.state.index;
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
    delegateScroll() {
        $(document).delegate("", "mousewheel DOMMouseScroll", event=> {
            event.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            this.doScroll(delta);
        });
    }

}

module.exports = scroll;

