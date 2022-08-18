import { $get, $post } from "../utils/request"
import { $EleMsgNotifySuccess, $EleMsgNotifyError, $confirm } from "../utils/alert";

//查询全部管理员信息
export let GetList = async() => {
    let data = await $get("Role/List");
    return data;
}

//添加管理员信息，返回是否成功
export let AddRoleApi = async(params) => {
    if (checkForm(params)) {
        return false;
    } else {
        let { status, message } = await $post("Role/Add", params);
        if (status) {
            $EleMsgNotifySuccess(message)
        } else {
            $EleMsgNotifyError(message)
        }
        return status;
    }
}

//编辑管理员信息
export let UpdateRoleApi = async(params) => {
    if (checkForm(params)) {
        return false;
    } else {
        let { status, message } = await $post("Role/Update", params);
        if (status) {
            $EleMsgNotifySuccess(message)
        } else {
            $EleMsgNotifyError(message)
        }
        return status;

    }
}

//删除管理员
export let DeleteRoleApi = async(params) => {
    await $confirm("是否要删除？", "提示")
    let { status, message } = await $post("Role/Delete", params);
    if (status) {
        $EleMsgNotifySuccess(message)
    } else {
        $EleMsgNotifyError(message)
    }
    return status;
}

//验证输入数据
let checkForm = (params) => {
    if (params.roleName === "") {
        $EleMsgNotifyError("请输入角色名称！")
        return true;
    } else {
        return false;
    }
}