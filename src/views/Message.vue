<template>
  <div class="Container">
    <div class="box">
      <el-card class="box-card" style="background-color: #67c23a">
        <div class="headline">1654</div>
        <div class="icon">
          <el-icon size="80px"><Avatar /></el-icon>
        </div>
        <div class="text item">检测人数：</div>
        <div class="bottom" style="background-color: #529b2e"></div>
      </el-card>
      <el-card class="box-card" style="background-color: #409eff">
        <div class="headline">3</div>
        <div class="icon">
          <el-icon size="80px"><Histogram /></el-icon>
        </div>
        <div class="text item">上报人数：</div>
        <div class="bottom"></div>
      </el-card>
      <el-card class="box-card" style="background-color: #e6a23c">
        <div class="headline">5</div>
        <div class="icon">
          <el-icon size="80px"><PieChart /></el-icon>
        </div>
        <div class="text item">新增风险地区：</div>
        <div class="bottom" style="background-color: #b88230"></div>
      </el-card>
      <el-card class="box-card" style="background-color: #f56c6c">
        <div class="headline">10</div>
        <div class="icon">
          <el-icon size="80px"><Odometer /></el-icon>
        </div>
        <div class="text item">新增患者：</div>
        <div class="bottom" style="background-color: #c45656"></div>
      </el-card>
    </div>
    <div class="box">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="Rid" label="id" />
        <el-table-column prop="Rdate" label="时间" />
        <el-table-column prop="Raddress" label="位置" />
        <el-table-column prop="Rtype" label="类型" />
        <el-table-column prop="Rimage" label="图片"
          ><template #default="scope"
            ><img :src="scope.row.Rimage" style="width: 200px;height: 150px" /></template
        ></el-table-column>
        <el-table-column prop="Rdetail" label="详情" />
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  Avatar,
  Histogram,
  Odometer,
  PieChart,
  CirclePlusFilled,
} from "@element-plus/icons-vue";
import { reportquery } from "@/../api/admin";
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
export default {
  name: "Message",
  components: {
    Avatar,
    Histogram,
    Odometer,
    PieChart,
    CirclePlusFilled,
  },
  setup() {
    let Data = reactive({
      tableData: [],
      /* Rid:"",
      Raddress: "",
      Rdate: "",
      Rtype: "",
      Rdetail: "",
      Rimage: "", */
    });
    let getdata = async () => {
      let set = await reportquery();
      console.log(set);
      Data.tableData = await reportquery();
    };
    onMounted(() => {
      getdata();
    });
    return { getdata, ...toRefs(Data) };
  },
};
</script>

<style lang="scss" scoped>
.Container {
  width: 100%;
  background-color: #e4e7ed;
  .box {
    display: flex;
    padding: 40px 20px;
    justify-content: space-around;
    .box-card {
      position: relative;
      color: aliceblue;
      background-color: #409eff;
      height: 200px;
      width: 350px;
      .icon {
        display: inline-block;
        position: absolute;
        right: 30px;
        top: 30px;
      }
      .bottom {
        text-align: center;
        line-height: 20px;
        position: absolute;
        bottom: 0;
        height: 20px;
        width: 90%;
        background-color: #337ecc;
      }
    }
  }
}

.card-header {
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 18px;
}
.headline {
  font-size: 60px;
}
.item {
  margin: 23px 0;
}
</style>