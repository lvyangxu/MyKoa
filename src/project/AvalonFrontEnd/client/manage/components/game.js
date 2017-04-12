import React, {PropTypes, Component} from "react"
import css from "../index.css"


export default class MyComponent extends Component {
    static propTypes = {
        games: PropTypes.array.isRequired,
    }

    componentDidMount() {
        console.log("game did mount")
    }

    render() {
        let currentImage = this.props.games.filter(d => {
            return d.checked
        }).map(d => {
            return d.imageName
        })

        return (
            <div className={css.game}>
                <div className={css.icon}><img src={`images/${currentImage}`}/></div>
            </div>
        )
    }
}