require("babel-polyfill");
let React = require("react");
let ReactDom = require("react-dom");

let Datepicker = require("../modules/karl-component-datepicker/index");
let Nav = require("../modules/karl-react-nav/index");

ReactDom.render(
    <div>
        {/*<Nav data={[*/}
            {/*{id: "safas", name: "1gfsf", group: "1r2r", dom: <div>1</div>},*/}
            {/*{id: "safas2", name: "1gfsf", group: "1r2r", dom: <div>1</div>},*/}
            {/*{id: "safas2", name: "1gfsf", dom: <div>1</div>},*/}
        {/*]}/>*/}
        <Datepicker type="second"/>
        <Datepicker type="minute" initValue="2016-01-01 22:11:58"/>
    </div>
    , document.getElementById("test"));
