<template>
  <div class="ContainDiv">
    <div class="LoginDiv">
      <div class="LoginTitle">
        <h3>登录</h3>
      </div>
      <div class="LoginItem">
        <span class="Itemtext">用户名：</span>
        <div class="form">
          <el-input v-model="loginUser" placeholder="Please input" clearable />
        </div>
      </div>
      <div class="LoginItem">
        <span class="Itemtext">密码：</span>
        <div class="form">
          <el-input
            v-model="loginPwd"
            type="password"
            placeholder="Please input password"
            show-password
          />
        </div>
      </div>
      <div class="LoginItem">
        <span class="Itemtext">记住我</span>
        <el-switch v-model="rememberMe" class="ml-2" active-color="#9df5e8f0" />
      </div>
      <div class="SubBtn">
        <el-button
          class="login_btn"
          type="primary"
          color="#9df5e8f0"
          @click="AdminLogin"
          >登入</el-button
        >
        <el-button @click="Goback" class="back_btn">取消</el-button>
      </div>
      <div class="register">
        <el-link type="primary" @click="register">注册</el-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount } from "vue";
import { Login, AutoLogin } from "../../api/admin";
//导入路由器对象
import { useRouter } from "vue-router";
import { getCookie } from "../../utils/request";
import { $EleMsgNotifyError } from "../../utils/alert";
export default {
  name: "Login",
  setup() {
    //获取当前项目中的路由器对象
    let $router = useRouter();

    //生命周期  在页面挂载之前  用来实现自动登录
    onBeforeMount(async () => {
      if (await AutoLogin()) {
        $router.push("/Home");
      }
    });

    //定义登录数据
    let loginData = reactive({
      loginUser: "",
      loginPwd: "",
      rememberMe: false,
    });
    /**定义事件处理函数AdminLogin
     * 来异步调用登录函数
     * 并通过返回的实现跳转页面
     */
    let AdminLogin = async () => {
      if (!loginData.loginUser) {
        $EleMsgNotifyError("请输入用户名！");
      } else if (!loginData.loginPwd) {
        $EleMsgNotifyError("请输入密码！");
      } else {
        //调用登录Api(api/admin.js) 返回是否已登录
        let isLogined = await Login(loginData);
        if (isLogined) {
          //登录成功，跳转到Home页
          $router.push("/Home/Monitor");
        }
      }
    };
    let Goback = () => {
      $router.push("/");
    };
    let register = () => {
      $router.push("/register");
    };
    return {
      //将数据转换为ref对象
      ...toRefs(loginData),
      AdminLogin,
      Goback,
      register,
    };
  },
};
</script>

<style lang="scss" scoped>
.ContainDiv {
  width: 100vw;
  height: 100vh;
  background-image: url("/image/Login-bg.jpg");
  display: flex;
  justify-content: center;
  align-items: center;
}

.LoginDiv {
  width: 400px;
  height: 300px;
  border: 3px solid darkgrey;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  justify-content: center;
  .LoginTitle {
    height: 30px;
    margin-bottom: 20px;
    text-align: center;
  }

  .LoginItem {
    .Itemtext {
      width: 100px;
      height: 20px;
      text-align: left;
      line-height: 30px;
    }
    display: flex;
    padding: 5px;

    .form {
      flex: 1;
    }
  }
  .SubBtn {
    padding: 5px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .register {
    padding-top: 50px;
    float: right;
  }
}
</style>