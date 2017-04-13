import React, {PropTypes, Component} from "react"
import css from "../index.css"


export default class MyComponent extends Component {
    static propTypes = {
        games: PropTypes.array.isRequired,
        gameNames: PropTypes.array.isRequired,
        currentGame: PropTypes.string.isRequired,
        gameChangeCallback: PropTypes.func.isRequired
    }


    render() {
        let currentImage = this.props.games.filter(d => {
            return d.name === this.props.currentGame
        }).map(d => {
            return d.imageName
        })

        return (
            <div className={css.game}>
                <div className={css.icon}><img src={`images/${currentImage}`}/></div>
                <div className={css.select}>
                    <select value={this.props.currentGame} onChange={e => {
                        this.props.gameChangeCallback(e.target.value)
                    }}>
                        {
                            this.props.gameNames.map((d, i) => {
                                return <option key={i} value={d}>{d}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        )
    }
}