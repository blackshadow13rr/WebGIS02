<template>
  <div class="Container">
    <div class="header">
      <header>
        <el-icon color="white" size="30px"><UserFilled /></el-icon>
        <span class="login">
          <em class="bold">已有账号？</em>
          <el-button type="primary" size="mini" @click="login">登录</el-button>
        </span>
      </header>
    </div>
    <div class="section">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="loginUser" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginPwd"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="ConfirmPwd"
            type="password"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="身份选择">
          <el-radio-group v-model="role">
            <el-radio label="用户" />
            <el-radio label="管理员" />
            <el-radio label="志愿者" />
          </el-radio-group>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" style="width: 60%" @click="register"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { UserFilled } from "@element-plus/icons-vue";
import { $EleMsgNotifyError, $EleMsgNotifySuccess } from "../../utils/alert";
import { Register } from "../../api/admin";
export default {
  name: "Registor",
  components: {
    UserFilled,
  },
  setup() {
    let router = useRouter();
    let RegData = reactive({
      loginUser: "",
      loginPwd: "",
      ConfirmPwd: "",
      role: "",
    });
    let login = () => {
      router.push("/login");
    };
    let register = async () => {
      let username = RegData.loginUser;
      let password = RegData.loginPwd;
      let conPwd = RegData.ConfirmPwd;
      let role = RegData.role;
      if (!username) {
        $EleMsgNotifyError("请输入用户名！");
      } else if (!password) {
        $EleMsgNotifyError("请输入密码！");
      } else if (password !== conPwd) {
        $EleMsgNotifyError("密码不一致！");
      } else if (!role) {
        $EleMsgNotifyError("请选择身份");
      } else {
        let status = await Register(RegData);
        if (status) {
          $EleMsgNotifySuccess("注册成功，即将返回登录页...");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          $EleMsgNotifyError("注册失败");
        }
      }
    };
    return {
      ...toRefs(RegData),
      login,
      register,
    };
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.Container {
  .el-input {
    height: 47px;
    width: 60%;
    input {
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      height: 47px;
      /* &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      } */
    }
  }

  .el-form-item {
    padding: 10px;
    label {
      font-style: normal;
      font-size: 16px;
      color: #fff;
    }
  }
  .button {
    padding-left: 130px;
  }
  .el-radio {
    padding: 0 10px;
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.Container {
  height: 100vh;
  width: 100vw;
  background-color: $bg;
  overflow: hidden;
  .header {
    border-bottom: 2px solid rgb(235, 232, 232);
    width: 100vw;
    color: #666;
    padding: 10px 0;
    align-items: center;
    display: flex;
    justify-content: center;
    header {
      margin: 0px auto;
      padding: 10px 10px;
      width: 95vw;

      .login {
        float: right;
      }

      .bold {
        font-style: normal;
        color: $light_gray;
      }
    }
  }

  > .section {
    margin: 0 auto 30px;
    padding-top: 50px;
    width: 980px;
    min-height: 300px;
    padding-left: 100px;
    box-sizing: border-box;

    .status {
      font-size: 12px;
      margin-left: 20px;
      color: #e6a23c;
    }

    .error {
      color: red;
    }
  }

  .tips {
    float: right;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
</style>