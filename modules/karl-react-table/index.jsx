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
 * id：表格id
 * project：使用jwt的工程名称
 * service：url请求相关的后台服务名称
 * 示例：
 * <Table id="aa" project="vgas" service=""/>
 */
class MyComponent extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        service: PropTypes.string.isRequired,
    }

    componentWillMount() {
        let {
            id, project, service, curd = "r", rowFilterValue = "", rowPerPage = 10, createText = "新增", createUrl, is100TableWidth = true,
            showTips
        } = this.props;
        //数据顺序为 sourceData > componentFilterData > inputFilterData > sortedData > displayData
        let preloadedState = {
            id: id,
            project: project,
            service: service,
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
            showTips: showTips,
            checkedArr: [],
            isAllChecked: false,
        }
        store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware))
    }

    render() {
        return <Provider store={store}>
            <App requestParams={this.props.requestParams}/>
        </Provider>
    }
}

module.exports = MyComponent