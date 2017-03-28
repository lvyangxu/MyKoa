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
            所有查询条件均不选或不输入时，默认匹配该条件的所有数据。所有数据时间所属时区均为UTC-8:00(美国太平洋时间,西八区)
        </div>
    </div>
    , document.getElementById("top"));