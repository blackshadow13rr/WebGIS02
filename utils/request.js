//工具类
//处理请求
import axios from "axios"
import Nprogress from "nprogress"
import "nprogress/nprogress.css"
import { BASE_URL } from "../config/conster"
import router from "@/router"

var instance = axios.create({
    //请求地址前缀
    baseURL: BASE_URL,
    timeout: 60000,
    //headers: {"": ""}
})

//添加请求拦截器
instance.interceptors.request.use(
    function(config) {
        Nprogress.start();
        config.headers["Page-Title"] = encodeURIComponent(router);
        config.headers["Content-Type"] = "application/json;charset=UTF-8"
        return config;
    },
    function(error) {
        Nprogress.done();
        return Promise.reject(error)
    }
);
//响应拦截器
instance.interceptors.response.use(
    function(response) {
        Nprogress.done();
        return response;
    },
    function(error) {
        Nprogress.done();
        return Promise.reject(error);
    }
)

//由这里统一发起请求
//GET请求需要将params做封装
export let $get = async(url, params) => {
    let { data } = await instance.get(url, { params: params });
    return data;
}

export let $post = async(url, params) => {
    let { data } = await instance.post(url, params);
    return data;
}

export let $setToken = () => {
    //将token保存到请求头中
    instance.defaults.headers.common["token"] = getCookie("token")
}

//设置浏览器Cookie
export let setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); //按天数计算cookie将存在的日期
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires; //设置了cookie名、cookie值、过期时间
}

//读取Cookie
export let getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}

//删除Cookie
export let clearAllCookies = function() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}