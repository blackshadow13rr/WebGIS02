//定义操作用户的api

//导入请求函数
import { $get, $post, $setToken, setCookie, getCookie } from "../utils/request"
import { $EleMsgNotifySuccess, $EleMsgNotifyError } from "../utils/alert";
import md5 from "js-md5"

//登录方法
export let Login = async(loginData) => {
    if (!loginData.loginPwd || !loginData.loginUser) {
        return false;
    }
    //结构出是否记住的信息
    let { rememberMe } = loginData;
    let password = md5(loginData.loginPwd);
    let userName = loginData.loginUser;
    let requestParam = {
        password: password,
        userName: userName,
    };
    let { status, message, token } = await $get("Admin/Login", requestParam);
    let isLogined = status === "2" ? true : false;
    if (status === "2") {
        //设置了名为token的存在时间为1天的浏览器Cookie
        setCookie("token", token, 1);
        //将token信息设置为请求头内容
        $setToken();
        $EleMsgNotifySuccess(message);
        if (rememberMe) {
            setCookie("loginUser", userName, 1);
            setCookie("loginPwd", password, 1)
        }
    } else {
        $EleMsgNotifyError(message);
    }
    return isLogined;
}


//自动完成登录
export let AutoLogin = async() => {
    let loginUser = getCookie("loginUser");
    let loginPwd = getCookie("loginPwd");
    if (loginUser && loginPwd) {
        let loginData = {
            loginUser: loginUser,
            loginPwd: loginPwd,
        }
        let { status, message, token } = await $get("Admin/Login", loginData);

        if (status === "2") {
            //设置了名为token的存在时间为1天的浏览器Cookie
            setCookie("token", token, 1);
            //将token信息设置为请求头内容
            $setToken();
            return true;
        } else { return false; }
    } else { return false; }
};


export let ListCourse = async(params) => {
    let results = await $get("Course/List", params);
    return results;
}

export let Register = async(RegData) => {
    let password = md5(RegData.loginPwd);
    let username = RegData.loginUser;
    let role = RegData.role;
    let requestParam = {
        loginPwd: password,
        loginUser: username,
        role: role,
    };
    let { statusCode, msg } = await $post("/Admin/Register", requestParam);
    let status = 0;
    if (statusCode === 0) {
        $EleMsgNotifyError(msg);
    } else if (statusCode === 4) {
        $EleMsgNotifyError(msg);
    } else if (statusCode === 200) {
        status = 1
    }
    return status;
}

export let GetOrderList = async() => {
    let results = await $get("/Map/GetOrderList");
    return results;
}

export let GetOrderPoint = async(data) => {
    let state = data.Ostate
    let Order = {
        Ostate: state
    }
    let results = await $get("/Map/GetOrderPoint", Order);
    return results;
}
export let GetOrderPointById = async(data) => {
    let Id = data.Oid
    let Order = {
        Oid: Id
    }
    let results = await $get("/Map/GetOrderPointById", Order);
    return results;
}
export let SetOrder = async(orderdata) => {
    let Id = orderdata.Oid
    let destination = orderdata.Odestination
    let Dlon = orderdata.ODlon
    let Dlat = orderdata.ODlat
    let Order = {
        Oid: Id,
        Odestination: destination,
        ODlon: Dlon,
        ODlat: Dlat,
    }
    let results = await $post("/Map/SetOrder", Order);
    return results;
}
export let GetHosList = async() => {
    let results = await $get("/Map/GetHosList");
    return results;
}
export let GetHosPointById = async(data) => {
    let Id = data.Oid
    let Order = {
        Oid: Id
    }
    let results = await $get("/Map/GetHosPointById", Order);
    return results;
}
export let SetHosOrder = async(orderdata) => {
    let Id = orderdata.Oid
    let destination = orderdata.Odestination
    let Dlon = orderdata.ODlon
    let Dlat = orderdata.ODlat
    let Order = {
        Oid: Id,
        Odestination: destination,
        ODlon: Dlon,
        ODlat: Dlat,
    }
    let results = await $post("/Map/SetHosOrder", Order);
    return results;
}
export let Getvolunteer = async() => {
    let results = await $get("/Map/Getvolunteer");
    return results;
}