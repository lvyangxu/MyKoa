import React from "react";
import css from "./index.css";
import $ from "jquery";

/**
 * react轮播组件,组件第一级子元素为进行轮播的dom
 * dots：为false或"false"时不显示，默认显示
 * arrows：为false或"false"时不显示，默认显示(未开发)
 * auto：为false或"false"时不自动播放，默认自动播放，间隔为5秒
 *
 * 示例：
 * <Carousel>
 *     <img src="1.png"/>
 *     <img src="2.png"/>
 *     <img src="3.png"/>
 * </Carousel>
 */
class carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            index: 1,
            isMouseDown: false
        };
        let bindArr = ["delegateMouse", "delegateTouch", "animateTo", "cssTo", "startMove", "doMove", "endMove", "autoPlay"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        this.delegateMouse();
        this.delegateTouch();
        let content = this.props.children.concat();
        let firstElement = content[0];
        let lastElement = content[content.length - 1];
        content = [lastElement].concat(content, firstElement);
        this.setState({
            content: content,
            dots: !(this.props.dots == false || this.props.dots == "false"),
            arrows: !(this.props.arrows == false || this.props.arrows == "false"),
            auto: !(this.props.auto == false || this.props.auto == "false"),
        });

        if (!(this.props.auto == false || this.props.auto == "false")) {
            this.autoPlay();
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <div className={css.base + " react-carousel"}>
                <div style={{
                    width: 100 * this.state.content.length + "%",
                    marginLeft: "-100%"
                }} className={css.container} ref={(d) => {
                    this.container = d;
                }}>
                    {
                        this.state.content.map((d, i) => {
                            let style = {width: 100 / (this.state.content.length) + "%"};
                            return <div key={i} style={style} className={css.item}>
                                <div className={css.inner}>{d}</div>
                            </div>
                        })
                    }
                </div>
                <div className={css.dots} style={this.state.dots ? {} : {display: "none"}}>
                    {
                        this.state.content.filter((d, i) => {
                            if (i == 0 || i == this.state.content.length - 1) {
                                return false;
                            } else {
                                return true;
                            }
                        }).map((d, i) => {
                            return <div key={i}
                                        className={(this.state.index - 1 == i) ? (css.dot + " " + css.active) : css.dot}
                                        onClick={() => {
                                            this.animateTo(i + 1);
                                        }}></div>
                        })
                    }
                </div>
            </div>
        );
    }

    autoPlay() {
        setTimeout(() => {
            if (this.state.manual) {
                return;
            }
            if (!this.state.isHover) {
                if (this.state.index == this.state.content.length - 2) {
                    this.cssTo(0);
                    this.animateTo(1);
                } else {
                    this.animateTo(this.state.index + 1);
                }
            }
            this.autoPlay();
        }, 5000)
    }

    animateTo(i) {
        $(this.container).animate({marginLeft: -i * 100 + "%"});
        this.setState({
            index: i,
            isMouseDown: false
        });
    }

    cssTo(i, offset) {
        offset = (offset == undefined) ? 0 : offset;
        $(this.container).css({marginLeft: -i * 100 + offset + "%"});
        this.setState({
            index: i
        });
    }

    startMove(x) {
        this.setState({
            startX: x,
            isMouseDown: true,
            manual: true
        });
    }

    doMove(x) {
        if (this.state.startX && this.state.isMouseDown) {
            this.setState({
                endX: x
            });

            let deltaX = x - this.state.startX;
            if ($(this.container).is(":animated")) {
                $(this.container).stop();
            }
            let endMarginLeft;
            let deltaXPercent = deltaX * this.state.content.length / $(this.container).width();
            endMarginLeft = (-this.state.index + deltaXPercent) * 100 + "%";
            $(this.container).css({marginLeft: endMarginLeft});
        }
    }

    endMove() {
        let deltaX = this.state.endX - this.state.startX;
        this.setState({
            startX: undefined,
            endX: undefined
        });

        if (Math.abs(deltaX) < 30) {
            this.animateTo(this.state.index);
            return;
        }
        let endIndex;
        let endMin = 0;
        let endMax = (this.state.content.length - 1);

        if (deltaX >= 30) {
            //drag right
            endIndex = this.state.index - 1;
            endIndex = Math.max(endIndex, endMin);
            if (endIndex == 0) {
                endIndex = this.state.content.length - 1;
                let offset = $(this.container).css("marginLeft");
                offset = Number.parseFloat(offset) * this.state.content.length / $(this.container).width();
                offset = offset + 1;
                offset = offset * 100;
                this.cssTo(endIndex, offset);
                endIndex--;
            }

        } else if (deltaX <= -30) {
            //drag left
            endIndex = this.state.index + 1;
            endIndex = Math.min(endIndex, endMax);
            if (endIndex == this.state.content.length - 1) {
                endIndex = 0;
                let offset = $(this.container).css("marginLeft");
                offset = Number.parseFloat(offset) * this.state.content.length / $(this.container).width();
                offset = offset + this.state.content.length - 2;
                offset = offset * 100;
                this.cssTo(endIndex, offset);
                endIndex++;
            }

        }
        endIndex = (endIndex == undefined) ? this.state.index : endIndex;
        this.animateTo(endIndex);

    }

    delegateTouch() {
        this.container.addEventListener('touchstart', e => {
            e.preventDefault();
            this.startMove(e.touches[0].pageX);
        }, false);
        this.container.addEventListener('touchmove', e => {
            e.preventDefault();
            this.doMove(e.touches[0].pageX);
        }, false);
        this.container.addEventListener('touchend', e => {
            e.preventDefault();
            this.endMove();
        });
    }

    delegateMouse() {
        this.container.addEventListener('mouseover', e => {
            e.preventDefault();
            this.setState({
                isHover: true
            });
        }, false);
        this.container.addEventListener('mousedown', e => {
            e.preventDefault();
            this.startMove(e.pageX);
        }, false);
        this.container.addEventListener('mousemove', e => {
            e.preventDefault();
            this.doMove(e.pageX);
        }, false);
        this.container.addEventListener('mouseleave', e => {
            e.preventDefault();
            this.setState({
                isHover: false
            });
            this.endMove();
        }, false);
        this.container.addEventListener('mouseup', e => {
            e.preventDefault();
            this.endMove();
        }, false);
    }


}

module.exports = carousel;

