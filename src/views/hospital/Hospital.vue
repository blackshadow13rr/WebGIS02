<template>
  <div id="MapView"></div>
  <el-card class="box-card" id="searchDiv">
    <el-tabs :tab-position="left" class="demo-tabs">
      <el-tab-pane label="综合查询"
        ><el-form :model="form" label-width="80px" ref="formRef">
          <el-form-item label="医院名">
            <el-input v-model="name" />
          </el-form-item>
          <el-form-item label="医院等级">
            <el-select v-model="level" placeholder="选择医院等级">
              <el-option label="三级甲等" value="三级甲等" />
              <el-option label="三级乙等" value="三级乙等" />
              <el-option label="三级医院" value="三级医院" />
              <el-option label="二级甲等" value="二级甲等" />
              <el-option label="二级乙等" value="二级乙等" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区">
            <el-select v-model="area" placeholder="选择医院所属区域">
              <el-option label="成华区" value="成华区" />
              <el-option label="金牛区" value="金牛区" />
              <el-option label="锦江区" value="锦江区" />
              <el-option label="郫都区" value="郫都区" />
              <el-option label="青羊区" value="青羊区" />
              <el-option label="武侯区" value="武侯区" />
            </el-select>
          </el-form-item>
          <el-form-item label="医院类型">
            <el-checkbox-group v-model="type">
              <el-checkbox label="接收新冠患者" name="type" />
              <el-checkbox label="接收疑似病例" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="患者类型">
            <el-radio-group v-model="patientType">
              <el-radio label="新冠患者" />
              <el-radio label="非新冠患者" />
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              color="#5F9EA0"
              id="queryBtn"
              >查找</el-button
            >
            <el-button @click="reset(formRef)">重置</el-button>
          </el-form-item>
        </el-form></el-tab-pane
      >
      <el-tab-pane label="核酸检测点查询">
        <el-form label-width="90px">
          <div id="sketchbox"></div>
          <el-form-item label="半径:">
            <div id="sliderbox"></div>
          </el-form-item>
        </el-form>
        <el-button type="primary" id="createbuffer" color="#5F9EA0"
          >创建</el-button
        >
        <el-button id="clearGeometry">清空</el-button>
      </el-tab-pane>
      <el-tab-pane label="部门查询"
        ><el-form :model="form" label-width="80px" ref="formRef">
          <el-form-item label="医院名">
            <el-input v-model="departmentname" />
          </el-form-item>
          <el-form-item label="医院部门">
            <el-select v-model="department" placeholder="选择医院部门">
              <el-option label="急诊" value="急诊" />
              <el-option label="发热门诊" value="发热门诊" />
              <el-option label="核酸检测" value="核酸检测" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区">
            <el-select v-model="departmentarea" placeholder="选择医院所属区域">
              <el-option label="成华区" value="成华区" />
              <el-option label="金牛区" value="金牛区" />
              <el-option label="锦江区" value="锦江区" />
              <el-option label="郫都区" value="郫都区" />
              <el-option label="青羊区" value="青羊区" />
              <el-option label="武侯区" value="武侯区" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              color="#5F9EA0"
              id="queryBtn2"
              >查找</el-button
            >
            <el-button @click="reset(formRef)">重置</el-button>
          </el-form-item>
        </el-form></el-tab-pane
      >
    </el-tabs>
  </el-card>
  <el-card class="box-card" id="resultDiv">
    <div class="count">
      查找到:
      <div class="count" id="count">0</div>
      家医院
    </div>
    <el-table :data="hoslist" style="width: 100%" max-height="250">
      <el-table-column prop="Address" label="地址" width="180" />
      <el-table-column prop="Name" label="医院名" width="180" />
      <el-table-column prop="Phone_Number" label="电话" /> </el-table
  ></el-card>
</template>

<script>
import { loadModules } from "esri-loader";
import Nprogress from "nprogress";
import { onMounted, onBeforeMount, reactive, toRefs, isRuntimeOnly } from "vue";
export default {
  name: "Hospital",
  setup() {
    let form = reactive({
      name: "",
      level: "",
      type: [],
      patientType: "",
      desc: "",
      hoslist: [],
      area: "",
      departmentname: "",
      department: "",
      departmentarea: "",
    });
    let reset = () => {
      form.name = "";
      form.level = "";
      form.type = [];
      form.patientType = "";
      form.area = "";
      form.hoslist = [];
      document.getElementById("count").innerHTML = 0;
    };
    let createView = () => {
      var options = {
        url: "https://js.arcgis.com/4.24/",
        css: "https://js.arcgis.com/4.24/esri/themes/light/main.css",
      };

      loadModules(
        [
          "esri/config",
          "esri/Map",
          "esri/views/MapView",
          "esri/widgets/Home",
          "esri/layers/FeatureLayer",
          "esri/widgets/Search",
          "esri/geometry/Point",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/Graphic",
          "esri/widgets/Expand",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch",
          "esri/widgets/Slider",
          "esri/geometry/geometryEngine",
          // "esri/Basemap",
          // "esri/layers/TileLayer",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            Home,
            FeatureLayer,
            Search,
            Point,
            SimpleMarkerSymbol,
            Graphic,
            Expand,
            GraphicsLayer,
            Sketch,
            Slider,
            geometryEngine,
            // Basemap,
            // TileLayer,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            var map = new Map({
              basemap: "osm",
            });
            var view = new MapView({
              container: "MapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
            });
            //添加绘制图层
            var sketchLayer = new GraphicsLayer();
            var bufferLayer = new GraphicsLayer();
            var orderLayer = new GraphicsLayer();
            view.map.addMany([bufferLayer, sketchLayer, orderLayer]);
            //全图按钮
            var homeBtn = new Home({
              view: view,
            });
            view.ui.add(homeBtn, "top-left");
            //收缩
            const searchexpand = new Expand({
              view: view,
              expandIconClass: "esri-icon-layer-list",
              content: searchDiv,
            });
            //弹出窗口
            var popup = view.popup;
            popup.actions = [];
            popup.dockEnable = true;
            popup.dockOptions = {
              breakpoints: false,
              buttonEnabled: false,
            };
            popup.defaultPopupTemplateEnabled = true;
            const template = {
              title: "{Name}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "Name",
                      label: "医院名",
                    },
                    {
                      fieldName: "Address",
                      label: "地址",
                    },
                    {
                      fieldName: "lon",
                      label: "经度",
                    },
                    {
                      fieldName: "lat",
                      label: "纬度",
                    },
                  ],
                },
              ],
            };

            //分别添加图层
            var EmergencyTreatment = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/Point/Point/MapServer/1",
              /* popupTemplate: template, */
            });
            map.add(EmergencyTreatment);
            var hospitalLayer = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/Point/Hospital/MapServer/0",
              /* popupTemplate: template, */
            });
            map.add(hospitalLayer);
            var FeverClinic = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/Point/Point/MapServer/0",
            });
            map.add(FeverClinic);
            var nucleicacidTest = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/Point/Point/MapServer/2",
            });
            map.add(nucleicacidTest);
            //添加动态特效
            let highlight;
            let lastUid;

            //清空按钮
            function clear() {
              sketchGeometry = null;
              bufferLayer.removeAll();
              sketchLayer.removeAll();
              if (highlightHandle) {
                highlightHandle.remove();
                highlightHandle = null;
              }
              document.getElementById("count").innerHTML = 0;
              form.hoslist = [];
            }
            const clearGeometryBtn = document.getElementById("clearGeometry");
            clearGeometryBtn.addEventListener("click", () => {
              clear();
            });
            //创建按钮
            const createbufferBtn = document.getElementById("createbuffer");
            //创建缓冲区
            var polySym = {
              type: "simple-fill",
              color: [140, 140, 222, 0.5],
              outline: {
                color: [0, 0, 0, 0.5],
                width: 2,
              },
            };
            function createBuffer(geometry) {
              var buffer = geometryEngine.buffer(
                geometry,
                slider.values,
                "meters",
                false
              );
              bufferLayer.add(
                new Graphic({
                  geometry: buffer,
                  symbol: polySym,
                })
              );
            }

            //滑动条
            const slider = new Slider({
              container: "sliderbox",
              min: 300,
              max: 1000,
              values: [300],
              snapOnClickEnabled: false,
              visibleElements: {
                labels: true,
                rangeLabels: true,
              },
              labelFormatFunction: (values, type) => {
                return `${values.toString()}m`;
              },
              precision: 0,
            });
            let sketchGeometry = null;
            let bufferGeometry = null;
            //滑动条控制半径变化
            slider.on(["thumb-change", "thumb-drag"], function () {
              if (bufferLayer.graphics.items[0]) {
                bufferLayer.removeAll();
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
              if (sketchLayer.graphics.items[0]) {
              }
            });
            //查询功能
            let highlightHandle = null;
            let allStats = null;
            function runQuery() {
              Nprogress.start();
              const query = nucleicacidTest.createQuery();
              query.geometry = bufferGeometry;
              query.distance = slider.values;
              query.outFields = ["Name", "PopupInfo"];
              query.returnGeometry = true;
              nucleicacidTest.queryFeatures(query).then(function (response) {
                allStats = response.features;
                const dataset = [];
                if (allStats) {
                  Nprogress.done();
                  document.getElementById("count").innerHTML = allStats.length;
                  allStats.forEach((result, index) => {
                    const attributes = result.attributes;
                    dataset.push(attributes);
                  });
                  form.hoslist = dataset;
                } else {
                  console.log("find nothing");
                }
              });
              view.whenLayerView(nucleicacidTest).then(function (layerView) {
                nucleicacidTest.queryObjectIds(query).then((ids) => {
                  if (highlightHandle) {
                    highlightHandle.remove();
                    highlightHandle = null;
                  }
                  highlightHandle = layerView.highlight(ids);
                });
              });
            }
            //草图绘制
            let sketch = new Sketch({
              layer: sketchLayer,
              visibleElements: {
                selectionTools: {
                  "lasso-selection": false,
                  "rectangle-selection": false,
                },
                undoRedoMenu: false,
              },
              view: view,
              container: "sketchbox",
            });
            sketch.on("create", (event) => {
              clear();
              if (event.state === "complete") {
                sketchGeometry = event.graphic.geometry;
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
            });
            sketch.on("update", (event) => {
              clear();
              if (event.state === "complete") {
                sketchGeometry = event.graphics[0].geometry;
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
            });
            //查找按钮
            let queryBtn = document.getElementById("queryBtn");
            queryBtn.addEventListener("click", () => {
              //查询功能
              let allStats = null;
              let sqlParam = "";
              let reception = "";
              let suspectedcases = "";
              let query = hospitalLayer.createQuery();
              if (form.name !== "") {
                sqlParam = "Name like '%" + form.name + "%'";
              }
              if (form.level !== "") {
                if (sqlParam !== "") {
                  sqlParam = sqlParam + " and Level = '" + form.level + "'";
                } else {
                  sqlParam = "Level = '" + form.level + "'";
                }
              }
              if (form.type !== []) {
                if (form.type === ["接收新冠患者", "接收疑似病例"]) {
                  reception = "是";
                  suspectedcases = "是";
                } else if (form.type === ["接收疑似病例"]) {
                  reception = "否";
                  suspectedcases = "是";
                } else if (form.type === ["接收新冠患者"]) {
                  reception = "是";
                  suspectedcases = "否";
                } else {
                  reception = "否";
                  suspectedcases = "否";
                }
                if (sqlParam !== "") {
                  sqlParam =
                    sqlParam +
                    " and Reception = '" +
                    reception +
                    "' and SuspectedCases = '" +
                    suspectedcases +
                    "'";
                } else {
                  sqlParam =
                    "Reception = '" +
                    reception +
                    "' and SuspectedCases = '" +
                    suspectedcases +
                    "'";
                }
              }
              if (form.area !== "") {
                if (sqlParam !== "") {
                  sqlParam = sqlParam + " and District = '" + form.area + "'";
                } else {
                  sqlParam = "District = '" + form.area + "'";
                }
              }
              query.where = sqlParam;
              query.outFields = ["Name", "Address", "District", "field_1_2"];
              hospitalLayer.queryFeatures(query).then(function (response) {
                allStats = response.features;
                const dataset = [];
                if (allStats) {
                  Nprogress.done();
                  document.getElementById("count").innerHTML = allStats.length;
                  allStats.forEach((result, index) => {
                    const attributes = result.attributes;
                    dataset.push(attributes);
                  });
                  form.hoslist = dataset;
                } else {
                  console.log("find nothing");
                }
              });
            });
            let queryBtn2 = document.getElementById("queryBtn2");
            queryBtn.addEventListener("click", () => {
              let allStats = null;
              let sqlParam = "";
              let reception = "";
              let suspectedcases = "";
              let query = hospitalLayer.createQuery();
              query.where = sqlParam;
              query.outFields = ["Name", "Address", "District", "field_1_2"];
            });
            view.ui.remove("attribution");
            view.ui.add([
              {
                component: searchexpand,
                position: "top-left",
                index: 2,
              },
              {
                component: resultDiv,
                position: "top-right",
                index: 2,
              },
            ]);
            //缓冲区
          }
        )
        .catch((e) => {
          console.log("出现错误" + e.message);
        });
    };
    let onSubmit = () => {
      console.log(form.type);
    };
    onMounted(() => {
      createView();
    });
    return { ...toRefs(form), createView, onSubmit, reset };
  },
};
</script>

<style scoped>
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
.count {
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
}
</style>