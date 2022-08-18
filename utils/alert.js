//工具类
//代替浏览器alert函数发出通知
//实现了状态成功通知EleMsgNotifySuccess 与状态错误通知EleMsgNotifyError
import { ElMessage, ElMessageBox } from "element-plus"

export let $EleMsgNotifySuccess = (message) => {
    ElMessage({
        showClose: true,
        message,
        duration: 2000,
        type: "success"
    })
}

export let $EleMsgNotifyError = (message) => {
    ElMessage({
        showClose: true,
        message,
        duration: 2000,
        type: "error"
    })
}

export let $confirm = (message, title) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            message,
            title,
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                resolve(true)
            })
            .catch(() => {
            })
    })
}