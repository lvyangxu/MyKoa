import React, {PropTypes, Component} from "react"
import {connect} from "react-redux"

import classnames from "classnames"
import css from "../../index.css"


class MyComponent extends Component {
    static propTypes = {}


    render() {
        let currentImage = this.props.games.filter(d => {
            return d.name === this.props.currentGame
        }).map(d => {
            return d.imageName
        })
        let gameNames = this.props.games.map(d => {
            return d.name
        })

        return (
            <div className={css.game}>
                <div className={css.icon}><img src={`images/${currentImage}`}/></div>
                <div className={css.select}>
                    <select value={this.props.currentGame} onChange={e => {
                        this.props.changeGame(e.target.value)
                    }}>
                        {
                            gameNames.map((d, i) => {
                                return <option key={i} value={d}>{d}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        )
    }
}

let mapStateToProps = state => {
    let props = Object.assign({}, state, {})
    return props
}

let mapDispatchToProps = dispatch => ({
    //改变当前的游戏
    changeGame: currentGame => {
        dispatch({type: "CHANGE_GAME", currentGame: currentGame})
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)