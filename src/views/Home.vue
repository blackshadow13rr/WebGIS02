<template>
  <div class="ContainerDiv">
    <div
      class="ContainerLeft"
      :style="{
        width: isLeftMenuCollapse ? '65px' : '200px',
        background: currentColor,
      }"
    >
      <div class="LeftTop">
        <div class="LogoTitle">
          {{ !isLeftMenuCollapse ? "微应急系统" : "" }}
        </div>
        <div
          class="FoldIcon"
          @click="isLeftMenuCollapse = !isLeftMenuCollapse"
          :style="{ background: currentColor }"
        >
          <el-icon v-show="!isLeftMenuCollapse">
            <caret-left />
          </el-icon>
          <el-icon v-show="isLeftMenuCollapse">
            <caret-right />
          </el-icon>
        </div>
      </div>
      <el-menu
        active-text-color="#5F9EA0"
        :background-color="currentColor"
        class="el-menu-vertical-demo"
        default-active="1"
        text-color="#fff"
        :collapse="isLeftMenuCollapse"
        router
      >
        <el-sub-menu index="monitor">
          <template #title>
            <el-icon>
              <monitor />
            </el-icon>
            <span>疫情</span>
          </template>
          <el-menu-item index="/Home/Monitor">疫情监控</el-menu-item>
          <el-menu-item index="/Home/activeLocus">活动轨迹</el-menu-item>
          <el-menu-item index="/Home/tempPCRSpot">临时核酸点</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="map">
          <template #title>
            <el-icon>
              <map-location />
            </el-icon>
            <span>地图</span>
          </template>
          <el-menu-item index="/Home/3D">三维展示</el-menu-item>
          <el-menu-item index="/Home/DensityAnalysis">核密度分析</el-menu-item>
          <el-menu-item index="/Home/HeatMap">热力图展示</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="supply">
          <template #title>
            <el-icon>
              <shopping-cart-full />
            </el-icon>
            <span>物资</span>
          </template>
          <el-menu-item index="/Home/Order">
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/Home/Supply">
            <span>物资调度</span>
          </el-menu-item>
          <el-sub-menu index="1-4">
            <template #title>物资地图</template>
            <el-menu-item index="/Home/serviceArea">服务区</el-menu-item>
            <el-menu-item index="/Home/Thiessen">泰森多边形</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-sub-menu index="hospital">
          <template #title>
            <el-icon>
              <FirstAidKit />
            </el-icon>
            <span>医院</span>
          </template>
          <el-menu-item index="/Home/Hospital">
            <span>医院查询</span>
          </el-menu-item>
          <el-menu-item index="/Home/Hospital">
            <span>人员调度</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="">
          <template #title>
            <el-icon>
              <operation />
            </el-icon>
            <span>管理</span>
          </template>
          <el-menu-item index="/Home/Role">角色管理</el-menu-item>
          <el-menu-item index="/Home/Comments">评价系统</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="ContainerRight">
      <div class="ContainerTop" :style="{ background: currentColor }">
        <div class="TopNavigation">
          <el-menu
            :default-active="activeIndex1"
            class="el-menu-demo"
            mode="horizontal"
            :background-color="currentColor"
            text-color="#fff"
            active-text-color="#5F9EA0"
          >
            <el-menu-item index="1" @click="goHome">首页</el-menu-item>
            <el-sub-menu index="2">
              <template #title>功能区</template>
              <el-menu-item index="2-1"></el-menu-item>
              <el-menu-item index="2-2">item two</el-menu-item>
              <el-menu-item index="2-3">item three</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/Message" @click="gotoMessage"
              >信息管理</el-menu-item
            >
            <!-- <el-badge class="mark" :value="12" /> -->
            <el-sub-menu index="4">
              <template #title>主题</template>
              <el-menu-item
                v-for="(item, index) in GetColor"
                @click="ChangeColor(index)"
                :index="'4-' + index"
                :key="index"
                >{{ item }}</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="6">
              <template #title>账户管理</template>
              <el-menu-item index="6-1">个人中心</el-menu-item>
              <el-menu-item index="6-2">修改密码</el-menu-item>
              <el-menu-item index="6-3" @click="ExitLogin"
                >退出登录</el-menu-item
              >
            </el-sub-menu>
          </el-menu>
        </div>
      </div>
      <div class="ContainerContent">
        <router-view></router-view>
      </div>
      <div class="ContainerBottom"></div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onBeforeMount } from "vue";
import { setCookie, getCookie, clearAllCookies } from "../../utils/request";
//全局状态管理对象
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  UserFilled,
  MapLocation,
  Monitor,
  ShoppingCartFull,
  Tickets,
  Operation,
  CaretLeft,
  CaretRight,
  FirstAidKit,
} from "@element-plus/icons-vue";

export default {
  name: "Home",
  components: {
    UserFilled,
    MapLocation,
    Monitor,
    ShoppingCartFull,
    Tickets,
    Operation,
    CaretLeft,
    CaretRight,
    FirstAidKit,
  },
  setup() {
    let $store = useStore();
    let router = useRouter();
    if (getCookie("ThemeColorCode")) {
      //获取打开页面时浏览器中的主题色信息
      let colorInCookie = {
        name: getCookie("ThemeColorName"),
        colorCode: getCookie("ThemeColorCode"),
      };
      $store.dispatch("updateCurrentColor", colorInCookie);
    }
    let pageInfo = reactive({
      isLeftMenuCollapse: false,
      activeIndex1: "1",
    });
    onBeforeMount(() => {
      let token = getCookie("token");
      if (!token) {
        //router.push("/login");
      }
    });
    let GetColor = computed(() => {
      //获取颜色数组
      return $store.getters["getColors"];
    });
    let currentColor = computed(() => {
      //获取当前主题色
      return $store.state.theme.currentColor.colorCode;
    });
    let ChangeColor = (index) => {
      //切换
      let color = $store.state.theme.colors[index];
      //将主题色缓存到浏览器Cookie中，这样刷新之后就会保持之前的状态，1表示过期时间为1天
      setCookie("ThemeColorCode", color.colorCode, 1);
      setCookie("ThemeColorName", color.name, 1);
      $store.dispatch("updateCurrentColor", color);
    };
    let ExitLogin = () => {
      clearAllCookies();
      //跳转到登录页
      router.push("/login");
    };
    let gotoMessage = () => {
      router.push("/Message");
    };
    let goHome = () => {
      router.push("/Home");
    };
    return {
      ...toRefs(pageInfo),
      currentColor,
      GetColor,
      ChangeColor,
      ExitLogin,
      gotoMessage,
      goHome,
    };
  },
};
</script>

<style scoped lang="scss">
.ContainerDiv {
  width: 100vw;
  height: 100vh;
  display: flex;

  .ContainerLeft {
    width: 200px;
    height: 100vh;
    transition: all 0.6s;

    .LogoTitle {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font: bold;
      font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
      flex-shrink: 0;
    }

    .FoldIcon {
      height: 20px;
      display: flex;
      justify-content: right;
      padding-right: 20px;
      color: white;
    }
  }

  .ContainerRight {
    flex: 1;
    display: flex;
    flex-direction: column;

    .ContainerTop {
      height: 60px;
      display: flex;
      flex-direction: row-reverse;

      .TopNavigation {
        width: 600px;
      }
    }

    .ContainerBottom {
      flex: 1;
    }

    .ContainerContent {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
