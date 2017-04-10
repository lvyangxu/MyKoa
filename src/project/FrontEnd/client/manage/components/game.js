import React, {PropTypes, Component} from "react"
import css from "../index.css"
import Radio from "karl-react-radio"

export default class MyComponent extends Component {
    static propTypes = {
        games: PropTypes.array.isRequired,
        changeGame: PropTypes.func.isRequired
    }

    render() {
        let currentImage = this.props.games.filter(d => {
            return d.checked
        }).map(d => {
            return d.imageName
        })
        let gameNames = this.props.games.map(d => {
            return d.name
        })
        return (
            <div className={css.game}>
                <img className={css.icon} src={`images/${currentImage}`}/>
                <Radio data={gameNames} callback={this.props.changeGame}/>
            </div>
        )
    }
}