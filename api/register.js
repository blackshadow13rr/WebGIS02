import { $get, $post, $setToken, setCookie, getCookie } from "../utils/request"
import { $EleMsgNotifySuccess, $EleMsgNotifyError } from "../utils/alert";

//用户注册
export let register = async(RegData) => {

}
let express = require('express');
let router = express.Router();
//————————————连接数据库——————————
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "43.142.31.47",
    user: "school",
    password: "NWPYskmPbD5yzH7K",
    database: "school",
    conncetionTimeout: "60000"
});

db.connect((err) => {
    if (err) {
        console.log(err)
    }
});

var instance = axios.create({
    //请求地址前缀
    baseURL: BASE_URL,
    timeout: 60000,
    //headers: {"": ""}
})
export let $get = async(url, params) => {
    let { data } = await instance.get(url, { params: params });
    return data;
}

export let $post = async(url, params) => {
    let { data } = await instance.post(url, params);
    return data;
}
router.post("/api/register", (req, res) => {
    let RegData = {
        username: req.body.loginUser,
        password: req.body.loginPwd,
        role: req.body.role,
    }
    let sqlParams = [RegData.username, RegData.role, RegData.password];
    db.query("SELECT * FROM userlist WHERE Uuser = '" + RegData.username + "'", function(err, res, fields) {
        let uName = res[0]
        if (uName == undefined) {
            //    不存在时插入数据
            db.query('insert into userlist (Uuser,Urole,Upwd) values(?, ?, ?)', sqlParams, function(err, data) {
                if (err) {
                    res.json({ statusCode: 0, msg: '注册失败，请重试' })
                    return
                } else {
                    res.json({ statusCode: 200, msg: '注册成功' })
                    return
                }
            })
        } else {
            res.json({ statusCode: 4, msg: '用户名已存在' })
        }
    })
});
module.exports = router;