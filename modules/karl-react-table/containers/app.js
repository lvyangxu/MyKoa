"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _headClientRow = require("../components/headClientRow");

var _headClientRow2 = _interopRequireDefault(_headClientRow);

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
        value: function componentDidMount() {
            window.addEventListener("click", this.props.hidePanel, false);
            if (this.props.initCallback !== undefined) {
                this.props.initCallback(this.props.value);
            }
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: _index2.default.base },
                _react2.default.createElement(_headClientRow2.default, { columns: this.props.columns, curd: this.props.curd })
            );
        }
    }]);

    return MyComponent;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state) {
    return {
        columns: state.columns,
        curd: state.curd
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        togglePanel: function togglePanel() {
            dispatch({ type: _action.TOGGLE_PANEL });
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyComponent);
