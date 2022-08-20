<template>
  <div class="table">
    <el-table :data="tableData" style="width: 900px">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="RUuser" label="角色名称" width="150" />
      <el-table-column prop="RphoneNum" label="电话号码" width="200" />
      <el-table-column prop="Raddress" label="常用地址" width="300" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="warning" circle @click="handleEdit(scope.row)">
            <el-icon>
              <edit />
            </el-icon>
          </el-button>

          <el-button type="danger" circle @click="handleDelete(scope.row)">
            <el-icon>
              <delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="" style="width: 100%" @click="handleAdd">添加管理员</el-button>
  </div>
  <div id="chartsContainer"></div>

  <el-drawer v-model="isDrawerOpen" :title="isAddRole ? '添加人员信息' : '修改人员信息'" direction="rtl"
    :before-close="DrawerClose">
    <div class="drawer">
      <div class="LoginDiv">
        <div class="LoginItem">
          <span class="Itemtext">角色名称：</span>
          <div class="form">
            <el-input v-model="formData.roleName" placeholder="请输入" />
          </div>
        </div>
        <div class="LoginItem">
          <span class="Itemtext">描述：</span>
          <div class="form">
            <el-input v-model="formData.roleDetails" placeholder="请输入" clearable />
          </div>
        </div>
        <div class="LoginItem">
          <span class="Itemtext">电话号码：</span>
          <div class="form">
            <el-input v-model="formData.rolePhoneNum" placeholder="请输入" clearable />
          </div>
        </div>
        <div class="LoginItem">
          <span class="Itemtext">地址：</span>
          <div class="form">
            <el-input v-model="formData.roleAddress" placeholder="请输入" clearable />
          </div>
        </div>
        <div class="LoginItem">
          <div class="SubBtn">
            <el-button type="primary" color="#9df5e8f0" @click="RoleSubmit" class="AddBtn">确定</el-button>
            <el-button @click="DrawerClose">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  GetList,
  AddRoleApi,
  UpdateRoleApi,
  DeleteRoleApi,
} from "../../../api/role";
import { onMounted, reactive, toRefs } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { loadModules } from "esri-loader";
import * as echarts from "echarts/lib/echarts";
export default {
  name: "Role",
  components: {
    Delete,
    Edit,
  },
  setup() {
    var option = {
      series: [
        {
          // title: {
          //   text: "注册人员分布图",
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: ['成华区',
              '青羊区',
              '双流区',
              '金牛区',
              '锦江区',
              '武侯区',
              '龙泉驿区',
              '新都区',
              '郫都区',
              '温江区',]
          },
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [
            { name: '成华区', value: 165 },
            { name: '青羊区', value: 45 },
            { name: '双流区', value: 57 },
            { name: '金牛区', value: 88 },
            { name: '锦江区', value: 48 },
            { name: '武侯区', value: 62 },
            { name: '龙泉驿区', value: 32 },
            { name: '新都区', value: 37 },
            { name: '郫都区', value: 22 },
            { name: '温江区', value: 31 }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    let data = reactive({
      tableData: [],
      isDrawerOpen: false,
      formData: {
        roleName: "",
        roleDetails: "",
        rolePhoneNum: "",
        roleAddress: ""
      },
      isAddRole: true,
    });
    //渲染页面表格
    let LoadList = async () => {
      let dt = await GetList();
      data.tableData = dt;
    };
    LoadList();
    //处理点击添加时的显示抽屉事件
    let handleAdd = () => {
      data.isAddRole = true;
      data.isDrawerOpen = true;
    };
    //提交表单编辑后的数据
    let RoleSubmit = () => {
      let resultStatus = false;
      //判断进行提交的类型
      if (data.isAddRole) {
        resultStatus = AddRoleApi(data.formData);
        if (resultStatus) {
          //刷新表格
          LoadList();
        }
        return;
      } else {
        resultStatus = UpdateRoleApi(data.formData);
        if (resultStatus) {
          //刷新表格
          LoadList();
        }
        return;
      }
    };
    //关闭抽屉的事件
    let DrawerClose = () => {
      data.isDrawerOpen = false;
      //清空表单数据
      data.formData = {
        roleName: "",
        roleDetails: "",
        rolePhoneNum: "",
        roleAddress: ""
      };
    };
    //编辑管理员数据, 控制抽屉显示的内容
    let handleEdit = (row) => {
      data.formData = {
        roleName: row.Rname,
        roleDetails: row.Rdetails,
        rolePhoneNum: row.RphoneNum,
        roleAddress: row.Raddress,
      };
      data.isAddRole = false;
      data.isDrawerOpen = true;
    };
    let handleDelete = async (row) => {
      //发出弹窗提醒用户是否要更改
      data.formData = {
        roleName: row.Rname,
      };
      let status = await DeleteRoleApi(data.formData);
      if (status) {
        //刷新表格
        LoadList();
      }
    };
    onMounted(() => {
      var echart = echarts.init(document.getElementById("chartsContainer"));
      echart.setOption(option);
    })

    return {
      ...toRefs(data),
      LoadList,
      DrawerClose,
      handleAdd,
      handleEdit,
      handleDelete,
      RoleSubmit,
    };
  },
};
</script>

<style lang="scss" scope>
.LoginItem {
  .Itemtext {
    width: 80px;
    height: 20px;
    text-align: left;
    line-height: 30px;
  }

  display: flex;
  padding: 10px;

  .form {
    flex: 1;
  }
}

.el-button.el-button--danger.is-circle {
  margin: auto;
}

.el-table {
  overflow: scroll;
  margin-top: 30px;
}
.table{
  margin: 50px;
}
#chartsContainer {
  margin: 50px;
  width: 650px;
  height: 650px
}
</style>