<template>
  <el-card class="box-card">
    <el-button @click="getOrder">刷新订单</el-button>
    <el-table :data="tableData" style="width: 100%" @row-click="getOstate">
      <el-table-column prop="Oid" label="订单编号" width="180" />
      <el-table-column prop="Oaddress" label="订单地址" width="250" />
      <el-table-column
        prop="Ostate"
        label="状态"
        width="100"
        :filters="[
          { text: '待处理', value: '待处理' },
          { text: '进行中', value: '进行中' },
          { text: '待分配', value: '待分配' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
      </el-table-column>
      <el-table-column label="位置">
        <template #default="scope">
          <el-button type="success" @click="getinfo(scope.row)">
            <el-icon>
              <AddLocation />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { GetOrderPoint, GetOrderList } from "@/../api/admin";
import { reactive, toRefs } from "vue";
import { Edit, AddLocation } from "@element-plus/icons-vue";
export default {
  name: "Supply",
  components: {
    AddLocation,
  },
  setup() {
    const filterTag = (value, row) => {
      return row.Ostate === value;
    };
    let data = reactive({
      tableData: [],
      Ostate: "",
    });
    /* let tableData = []; */
    let getinfo = (row) =>{
      console.log(row)
    }
    let getOrder = async () => {
      let Order = await GetOrderList();
      data.tableData = Order;
    };
    let addPoint = async () => {
      data.Ostate = "进行中";
      console.log(data.Ostate);
      let Point = await GetOrderPoint(data);
      console.log(Point);
    };
    addPoint();
    return { ...toRefs(data), getOrder, filterTag,getinfo };
  },
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 600px;
}
</style>