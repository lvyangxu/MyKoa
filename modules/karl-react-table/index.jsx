import React, {PropTypes, Component} from "react"
import {createStore, applyMiddleware} from "redux"
import {Provider} from "react-redux"
import App from "./containers/app"
import reducer from "./reducers/reducer"
import "font-awesome-webpack"
import thunkMiddleware from 'redux-thunk'

let store = {}

/**
 * react表格
 * 示例：
 * <Table id="aa" project="vgas"/>
 */
class MyComponent extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        serviceName: PropTypes.string.isRequired,
    }

    componentWillMount() {
        let {id, project, serviceName, curd = "r", rowFilterValue = "", rowPerPage = 10, createText = "新增", createUrl, is100TableWidth = true} = this.props;
        //数据顺序为 sourceData > componentFilterData > inputFilterData > sortedData > displayData
        let preloadedState = {
            id: id,
            project: project,
            serviceName: serviceName,
            curd: curd,
            rowFilterValue: rowFilterValue,
            isMinColumn: false,
            sortDesc: true, sortColumnId: "",
            sourceData: [], componentFilterData: [], inputFilterData: [], sortedData: [], displayData: [],
            pageIndex: 1, rowPerPage: rowPerPage,
            serverFilter: [],
            isLoading: false,
            createText: createText,
            createUrl: createUrl,
            is100TableWidth: is100TableWidth,
        }
        store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware))
    }

    render() {
        return <Provider store={store}>
            <App/>
        </Provider>
    }
}

module.exports = MyComponent