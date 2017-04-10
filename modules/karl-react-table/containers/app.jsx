import React, {Component} from "react"
import {connect} from "react-redux"
import HeadClientRow from "../components/headClientRow"
import css from "../index.css"
import {
    TOGGLE_PANEL,
    HIDE_PANEL,
    STOP_PROPAGATION,
    CHOOSE_ITEM,
    CHANGE_INPUT,
    DO_PAGE_LEFT,
    DO_PAGE_RIGHT,
    DO_PAGE_START,
    DO_PAGE_END
} from "../actions/action"

class MyComponent extends Component {

    componentDidMount() {
        window.addEventListener("click", this.props.hidePanel, false)
        if (this.props.initCallback !== undefined) {
            this.props.initCallback(this.props.value)
        }
    }

    render() {
        return (
            <div className={css.base}>

                <HeadClientRow columns={this.props.columns} curd={this.props.curd}/>
            </div>
        )
    }
}


let mapStateToProps = state => {
    return {
        columns: state.columns,
        curd: state.curd,
    }
}

const mapDispatchToProps = dispatch => ({
    togglePanel: () => {
        dispatch({type: TOGGLE_PANEL})
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)