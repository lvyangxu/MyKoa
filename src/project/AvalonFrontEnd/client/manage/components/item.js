import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Table from "../../../../../modules/karl-react-table/index"

export default class MyComponent extends Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        curd: PropTypes.string.isRequired
    }

    render() {

        return (
            <div>
                <div>2222</div>
                <Table id="item" project="AvalonFrontEnd" serviceName="rewardCode"/>
            </div>
        )
    }
}