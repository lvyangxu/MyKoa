"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _button = require("../components/button");

var _button2 = _interopRequireDefault(_button);

var _panel = require("../components/panel");

var _panel2 = _interopRequireDefault(_panel);

var _filter = require("../components/filter");

var _filter2 = _interopRequireDefault(_filter);

var _option = require("../components/option");

var _option2 = _interopRequireDefault(_option);

var _page = require("../components/page");

var _page2 = _interopRequireDefault(_page);

var _index = require("../index.css");

var _index2 = _interopRequireDefault(_index);

var _action = require("../actions/action");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyComponent = function (_Component) {
    _inherits(MyComponent, _Component);

    function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).apply(this, arguments));
    }

    _createClass(MyComponent, [{
        key: "componentDidMount",
        value: function componentDidMount() {}
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement("div", { className: _index2.default.base, data: this.props.data });
        }
    }]);

    return MyComponent;
}(_react.Component);

var getFilterData = function getFilterData(data, filterValue) {
    var filterData = data.filter(function (d) {
        return d.toString().includes(filterValue);
    });
    return filterData;
};

var getPageEndIndex = function getPageEndIndex(filterData) {
    var pageEndIndex = Math.floor(filterData.length / 10);
    return pageEndIndex;
};

var getPageData = function getPageData(filterData, pageIndex) {
    var start = pageIndex * 10;
    var end = pageIndex * 10 + 10;
    end = end > filterData.length ? filterData.length : end;
    var pageData = filterData.slice(start, end);
    return pageData;
};

var getMarkedHtml = function getMarkedHtml(optionValue, filterValue) {
    var markedHtml = void 0;
    optionValue = optionValue.toString();
    if (filterValue === "") {
        markedHtml = optionValue;
    } else {
        var regex = new RegExp(filterValue, "g");
        markedHtml = optionValue.replace(regex, "<strong>" + filterValue + "</strong>");
    }
    return { __html: markedHtml };
};

var getButtonValue = function getButtonValue(prefix, value, suffix) {
    prefix = prefix === undefined ? "" : prefix + " ";
    suffix = suffix === undefined ? "" : " " + suffix;
    return prefix + value + suffix;
};

var mapStateToProps = function mapStateToProps(state) {
    var filterData = getFilterData(state.data, state.filterValue);
    var pageEndIndex = getPageEndIndex(filterData);
    var pageData = getPageData(filterData, state.pageIndex);
    pageData = pageData.map(function (d) {
        var html = getMarkedHtml(d, state.filterValue);
        return { value: d, html: html };
    });
    var buttonValue = getButtonValue(state.prefix, state.value, state.suffix);
    return {
        isPanelShow: state.isPanelShow,
        value: state.value,
        buttonValue: buttonValue,
        prefix: state.prefix,
        suffix: state.suffix,
        data: state.data,
        filterValue: state.filterValue,
        filterData: filterData,
        pageIndex: state.pageIndex,
        pageEndIndex: pageEndIndex,
        pageData: pageData,
        initCallback: state.initCallback,
        callback: state.callback
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        togglePanel: function togglePanel() {
            dispatch({ type: _action.TOGGLE_PANEL });
        },
        hidePanel: function hidePanel() {
            dispatch({ type: _action.HIDE_PANEL });
        },
        stopPropagation: function stopPropagation(e) {
            dispatch({ type: _action.STOP_PROPAGATION, e: e });
        },
        onFilterChange: function onFilterChange(e) {
            dispatch({ type: _action.CHANGE_INPUT, e: e });
        },
        chooseItem: function chooseItem(d) {
            dispatch({ type: _action.CHOOSE_ITEM, value: d });
            dispatch({ type: _action.HIDE_PANEL });
        },
        doPageStart: function doPageStart() {
            dispatch({ type: _action.DO_PAGE_START });
        },
        doPageLeft: function doPageLeft(pageIndex) {
            dispatch({ type: _action.DO_PAGE_LEFT, pageIndex: pageIndex });
        },
        doPageRight: function doPageRight(pageIndex, pageEndIndex) {
            dispatch({ type: _action.DO_PAGE_RIGHT, pageIndex: pageIndex, pageEndIndex: pageEndIndex });
        },
        doPageEnd: function doPageEnd(pageEndIndex) {
            dispatch({ type: _action.DO_PAGE_END, pageEndIndex: pageEndIndex });
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
