import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Radio from "karl-react-radio"
import Datepicker from "karl-component-datepicker"
import {postWithJWT} from "karl-http"

export default class MyComponent extends Component {
    static propTypes = {
        itemBundleList: PropTypes.array.isRequired,
        channelList: PropTypes.array.isRequired,
        submitCallback: PropTypes.func.isRequired,
        itemBundleCreateStartTimeChangeCallback: PropTypes.func.isRequired,
        itemBundleCreateEndTimeChangeCallback: PropTypes.func.isRequired,
        itemBundleCreateStartTime: PropTypes.string.isRequired,
        itemBundleCreateEndTime: PropTypes.string.isRequired,
    }

    render() {
        let {itemBundleCreateStartTime: startTime, itemBundleCreateEndTime: endTime} = this.props
        let display = {day: 0, hour: 0, minute: 0}
        if (startTime !== "" && endTime !== "") {
            let deltaTime = Date.parse(endTime) - Date.parse(startTime)
            let allMinute = Math.floor(deltaTime / 1000 / 60)
            display.minute = allMinute % 60
            let allHour = Math.floor(allMinute / 60)
            display.hour = allHour % 24
            display.day = Math.floor(allHour / 24)
        }

        return (
            <div className={css.codeBundleCreate}>
                <h2>创建兑换码</h2>
                <div className={css.row}>
                    <h3 className={css.title}>兑换码名称</h3>
                    <div><input className={css.input}/></div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>关联礼包</h3>
                    <div><Radio data={this.props.itemBundleList}/></div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>渠道</h3>
                    <div><Radio data={this.props.channelList}/></div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>有效期</h3>
                    <div className={css.validTime}>
                        <div className={css.startTime}>
                            <div className={css.label}>开始时间</div>
                            <Datepicker type="minute" initValue={startTime}
                                        initCallback={d => {
                                            if (startTime !== d) {
                                                this.props.itemBundleCreateStartTimeChangeCallback(d)
                                            }
                                        }}
                                        callback={d => {
                                            if (startTime !== d) {
                                                this.props.itemBundleCreateStartTimeChangeCallback(d)
                                            }
                                        }}
                            />
                        </div>
                        <div className={css.endTime}>
                            <div className={css.label}>结束时间</div>
                            <Datepicker type="minute" add={30 * 24 * 60} initValue={endTime}
                                        initCallback={d => {
                                            if (endTime !== d) {
                                                this.props.itemBundleCreateEndTimeChangeCallback(d)
                                            }
                                        }}
                                        callback={d => {
                                            if (endTime !== d) {
                                                this.props.itemBundleCreateEndTimeChangeCallback(d)
                                            }
                                        }}
                            />
                        </div>
                        <div className={css.totalTime}>总计: {display.day}天{display.hour}小时{display.minute}分</div>
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>规则</h3>
                    <div className={css.rules}>
                        <div className={css.ruleRow}>
                            本批生成数量
                            <input className={css.input} type="number" min="1" max="500000"/>
                        </div>
                        <div className={css.ruleRow}>
                            单条使用次数
                            <input className={css.input} type="number" min="1" max="500000"/>
                        </div>
                        <div className={classnames(css.ruleRow, css.activeType)}>
                            <div className={css.left}>账号激活</div>
                            <div className={css.right}>
                                <div><input name="type" type="radio"/>单个账号激活本批次一个码</div>
                                <div><input name="type" type="radio"/>单个账号激活本批次多个码</div>
                                <div><input name="type" type="radio"/>通用码</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={css.row}>
                    <h3 className={css.title}>备注</h3>
                    <div className={css.ruleRow}>
                        选中通用码后，不可再设置生成数量与使用次数，并不再生成普通兑换码，本批次兑换码只会生成一条通用码。
                    </div>
                    <div className={css.ruleRow}>
                        每个玩家账号只可使用该通用码1次。
                    </div>
                    <div className={css.ruleRow}>
                        通用码可在所有渠道使用。
                    </div>
                </div>
                <div className={css.row}>
                    <button className={classnames(css.button, css.submit)}>保存</button>
                    <button className={css.button}>取消</button>
                </div>
            </div>
        )
    }
}