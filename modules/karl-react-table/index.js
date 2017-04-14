"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _app = require("./containers/app");

var _app2 = _interopRequireDefault(_app);

var _reducer = require("./reducers/reducer");

var _reducer2 = _interopRequireDefault(_reducer);

require("font-awesome-webpack");

var _reduxThunk = require("redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};

/**
 * react表格
 * 示例：
 * <Table id="aa" project="vgas"/>
 */

var MyComponent = function (_Component) {
    _inherits(MyComponent, _Component);

    function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).apply(this, arguments));
    }

    _createClass(MyComponent, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var _props = this.props,
                id = _props.id,
                project = _props.project,
                serviceName = _props.serviceName,
                _props$curd = _props.curd,
                curd = _props$curd === undefined ? "r" : _props$curd,
                _props$rowFilterValue = _props.rowFilterValue,
                rowFilterValue = _props$rowFilterValue === undefined ? "" : _props$rowFilterValue,
                _props$rowPerPage = _props.rowPerPage,
                rowPerPage = _props$rowPerPage === undefined ? 10 : _props$rowPerPage,
                _props$createText = _props.createText,
                createText = _props$createText === undefined ? "新增" : _props$createText,
                createUrl = _props.createUrl,
                _props$is100TableWidt = _props.is100TableWidth,
                is100TableWidth = _props$is100TableWidt === undefined ? true : _props$is100TableWidt;
            //数据顺序为 sourceData > componentFilterData > inputFilterData > sortedData > displayData

            var preloadedState = {
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
                is100TableWidth: is100TableWidth
            };
            store = (0, _redux.createStore)(_reducer2.default, preloadedState, (0, _redux.applyMiddleware)(_reduxThunk2.default));
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(_app2.default, null)
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

MyComponent.propTypes = {
    id: _react.PropTypes.string.isRequired,
    project: _react.PropTypes.string.isRequired,
    serviceName: _react.PropTypes.string.isRequired
};


module.exports = MyComponent;
