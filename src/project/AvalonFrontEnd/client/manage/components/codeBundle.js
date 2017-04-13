import React, {PropTypes, Component} from "react"
import classnames from "classnames"
import css from "../index.css"
import Table from "../../../../../modules/karl-react-table/index"

export default class MyComponent extends Component {
    static propTypes = {}

    render() {

        return (
            <div>
                <Table id="codeBundle" project="AuthorizeServer" serviceName="rewardCode"/>
            </div>
        )
    }
}