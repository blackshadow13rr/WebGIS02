<template>
  <div class="comment-container">
    <div class="comment-head">
      <div class="comment-headline">
        <el-icon>
          <ChatDotSquare />
        </el-icon>
        <span>评论</span>
      </div>
    </div>
    <div class="comment-warp">
      <div class="comment-contents">
        <div class="comment-title">
          <span>{{ commentItems.length }} 条评论</span>
          <el-icon class="refreshBtn">
            <RefreshRight />
          </el-icon>
        </div>
        <div
          class="comment-item"
          v-for="(item, index) in commentItems"
          :key="index"
        >
          <div class="userIcon">
            <el-icon>
              <UserFilled />
            </el-icon>
          </div>
          <div class="comment-main">
            <div class="userName">{{ item.userName }}</div>
            <div class="comment-text">
              <span>{{ item.content }}</span>
            </div>
          </div>
        </div>
        <div class="pagination-block">
          <el-pagination layout="prev, pager, next" :total="50" />
        </div>
      </div>
      <div class="wordCloud">
        <div id="echartsWC"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-wordcloud";
import { reactive, toRefs, computed, onMounted } from "vue";
import {
  ChatDotSquare,
  RefreshRight,
  UserFilled,
} from "@element-plus/icons-vue";
import { wordData } from "./data.js";
export default {
  name: "comments",
  components: {
    ChatDotSquare,
    RefreshRight,
    UserFilled,
  },
  setup() {
    let commentItems = reactive([
      {
        userName: "梁非凡",
        content:
          "基层人员真的辛苦，昨天晚上九点半了，我爸妈他们还收到了上门送的蔬菜，米油，当时还下着雨",
      },
      {
        userName: "刘醒",
        content: "昨晚收到了配送的物资，还是挺开心的。",
      },
      {
        userName: "卫紫君",
        content:
          "希望治疗新冠的特效药能快些上市，使新冠病毒从传染病变为普通疾病，封控能早日成为历史🙏🙏非常理解游客们受困的心情，家庭、事业、学业都面临停摆的风险。也希望政府能动员酒店、餐饮行业共同承担社会责任。感谢驰援的医护工作者和志愿者们。",
      }
    ]);
    let initChart = () => {
      var chart = echarts.init(document.getElementById("echartsWC"));
      const option = {
        backgroundColor: "#fff",
        tooltip: {
          show: true,
        },
        series: [
          {
            type: "wordCloud",
            gridSize: 10,
            sizeRange: [10, 60],
            rotationRange: [0, 30],
            textStyle: {
              color: function () {
                return `rgb(${Math.ceil(Math.random() * 166)}
                ,${Math.ceil(Math.random() * 166)}
                ,${Math.ceil(Math.random() * 166)})`;
              },
            },
            left: "center",
            top: "center",
            right: null,
            bottom: null,
            width: "200%",
            height: "200%",
            data: wordData,
          },
        ],
      };
      chart.setOption(option);
    };
    onMounted(() => {
      initChart();
    });
    return {
      commentItems,
      initChart,
    };
  },
};
</script>

<style  scoped>
.comment-container {
  width: 100%;
  height: 100%;
}

.comment-head {
  width: 100%;
  height: 80px;
  background-color: #fff;
  border-bottom: 20px solid #ccc;
}

.comment-headline {
  height: 100%;
  padding: 0 0 0 30px;
  line-height: 80px;
  font-size: large;
  font-weight: 700;
  color: #666;
}

.comment-warp {
  display: flex;
}

.wordCloud {
  float: right;
}

#echartsWC {
  width: 800px;
  height: 800px;
}

.comment-title {
  padding: 30px;
  font-size: large;
  font-weight: 700;
  color: #666;
}

.refreshBtn {
  float: right;
}

.comment-contents {
  width: 50%;
  margin-left: 100px;
}

.comment-item {
  height: 180px;
  margin: 30px;
  display: flex;
  border: 4px solid darkslategray;
}

.comment-main {
  width: 80%;
  float: right;
}

.userIcon {
  width: 40px;
  height: 40px;
  border-radius: 4%;
  margin: 10px 0 0 10px;
}

.userName {
  height: 30px;
  line-height: 30px;
  font-size: medium;
  font-weight: 700;
  color: #666;
  margin-top: 10px;
}

.comment-text {
  margin-top: 10px;
}

.pagination-block {
  margin-top: 20px;
}
.el-icon {
  margin: 10px;
  color: #666;
}
</style>
