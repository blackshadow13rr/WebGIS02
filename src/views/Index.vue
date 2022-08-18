<template>
  <div class="Container">
    <div class="main-text">
      <div class="intro">
        <h1 class="title">微应急系统</h1>
      </div>
      <div class="intro">
        <el-icon color="white">
          <user />
        </el-icon>
      </div>
      <div class="intro">
        <el-button type="primary" class="LoginBot" size="large" @click="login"
          >登陆</el-button
        >
      </div>
    </div>
    <div class="backgroundvideo">
      <video
        src="../../video/bgv.mp4"
        :style="fixStyle"
        autoplay
        loop
        muted
        class="fillWidth"
        v-on:canplay="canplay"
      ></video>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { User } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
export default {
  name: "Index",
  components: {
    User,
  },
  data() {
    return {
      vedioCanPlay: false,
      fixStyle: "",
    };
  },
  methods: {
    canplay() {
      this.vedioCanPlay = true;
    },
  },
  setup() {
    let router = useRouter();
    let login = () => {
      router.push("/Login");
    };
    let config = reactive({
      autoInsertSpace: true,
    });
    return {
      login,
      config,
    };
  },
};
</script>

<style scoped lang="scss">
.Container {
  width: 100vw;
  height: 100vh;
  //background: linear-gradient(to top, #dedede80, #5f9ea0);
  //display: block;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  text-align: center;
  .main-text {
    padding-top: 320px;
    position: absolute;
    z-index: 1;
  }
  .LoginBot {
    height: 60px;
    width: 195px;
    font-size: 20px;
    text-align: center;
  }
  .title {
    font-size: 84px;
    color: white;
  }
  .backgroundvideo {
    z-index: 0;
    position: absolute;
  }
  .fillwidth {
    width: 100%;
    height: 100%;
  }
}
</style>