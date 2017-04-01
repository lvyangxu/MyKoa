import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Nav from "karl-component-nav";
// import Table from "../table/index.jsx";
import css from "./index.css";

ReactDom.render(
    <Nav sectionStyle={{padding: "50px"}} data={[
        {
            id: "online", name: "每日信息", group: "服务器信息",
            dom: <div>

            </div>
        },

    ]}/>
    , document.getElementById("content"));

ReactDom.render(
    <div className={css.top}>
        <div className={css.tips}>

        </div>
    </div>
    , document.getElementById("top"));