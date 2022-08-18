<template>
  <div class="searchBar"></div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号" width="180" />
      <el-table-column prop="Rname" label="角色名称" width="180" />
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

  <el-drawer v-model="isDrawerOpen" :title="isAddRole ? '添加管理员' : '修改管理员'" direction="rtl" :before-close="DrawerClose">
    <div class="drawer">
      <div class="LoginDiv">
        <div class="LoginItem">
          <span class="Itemtext">角色名称：</span>
          <div class="form">
            <el-input v-model="formData.roleName" placeholder="Please input" />
          </div>
        </div>
        <div class="LoginItem">
          <span class="Itemtext">描述：</span>
          <div class="form">
            <el-input v-model="formData.roleDetails" placeholder="Please input" clearable />
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
import { reactive, toRefs } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
export default {
  name: "Role",
  components: {
    Delete,
    Edit,
  },
  setup() {
    let data = reactive({
      tableData: [],
      isDrawerOpen: false,
      formData: {
        roleName: "",
        roleDetails: "",
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
      };
    };
    //编辑管理员数据, 控制抽屉显示的内容
    let handleEdit = (row) => {
      data.formData = {
        roleName: row.Rname,
        roleDetails: row.Rdetails,
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
.el-button.el-button--danger.is-circle{
  margin: auto;
}
</style>