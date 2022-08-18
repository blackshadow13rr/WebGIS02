<template>
  <el-card class="box-card">
    <el-form :model="form" label-width="120px">
      <el-form-item label="缓冲区半径">
        <el-select v-model="long" placeholder="please select your zone">
          <el-option label="300m" value="300" />
          <el-option label="400m" value="400" />
          <el-option label="500m" value="500" />
          <el-option label="600m" value="600" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="paint"
          ><el-icon><Edit /></el-icon
        ></el-button>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { reactive, toRefs, onBeforeMount, inject } from "vue";
import { useStore } from "vuex";
import { Edit } from "@element-plus/icons-vue";
export default {
  components: { Edit },
  setup() {
    let $store = useStore()
    let form = reactive({
      long: "",
    });
    var polySym = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [140, 140, 222, 0.5],
      outline: {
        color: [0, 0, 0, 0.5],
        width: 2,
      },
    };
    function createBuffer(geometry) {
      // var buffer=geometryEngine.geodesicBuffer(geometry,150,"kilometers",false);
      var buffer = geometryEngine.buffer(geometry, form.long, "meters", false);
      view.graphics.add(
        new Graphic({
          geometry: buffer,
          symbol: polySym,
        })
      );
    }
    let onSubmit = () => {
      console.log($store.state.view);
    };
    let clear = () => {
      view.graphics.removeAll();
    };
    let paint = () => {
      view.on("click", (event) => {
        view.hitTest(event).then(function (response) {
          const graphic = getGraphic(response);
          if (graphic) {
            createBuffer(graphic.geometry);
          }
        });
      });
    };
    return {
      ...toRefs(form),
      onSubmit,
      clear,
      paint,
    };
  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 12px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 380px;
}
</style>