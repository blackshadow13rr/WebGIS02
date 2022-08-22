<template>
  <div id="Container"></div>
  <el-card id="resultBox"
    ><div id="chart1" style="width: 600px; height: 400px"></div>
    <div id="chart2" style="width: 650px; height: 400px"></div
  ></el-card>
  <el-card id="buffermenu">
    <el-form label-width="90px">
      <div id="sketchbox"></div>
      <el-form-item label="缓冲区半径:">
        <div id="sliderbox"></div>
      </el-form-item>
    </el-form>
    <el-button type="primary" id="createbuffer" color="#5F9EA0">创建</el-button>
    <el-button id="clearGeometry">清空</el-button>
  </el-card>
</template>

<script>
import { loadModules } from "esri-loader";
//echarts
import * as echarts from "echarts";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
export default {
  name: "Monitor",
  setup() {
    let piechartdata = reactive({
      chenghua: 0,
      gaoxin: 0,
      jiniu: 0,
      jinjiang: 0,
      longquanyiqu: 0,
      pidu: 0,
      qingbaijiang: 0,
      qingyang: 0,
      shuangliu: 0,
      tianfuxinqu: 0,
      wenjiang: 0,
      wuhou: 0,
      xindu: 0,
      seven13: 0,
      seven14: 0,
      seven15: 0,
      seven16: 0,
      seven17: 0,
      seven18: 0,
      seven19: 0,
      seven20: 0,
      seven21: 0,
      seven22: 0,
      seven23: 0,
      seven24: 0,
      seven25: 0,
      seven26: 0,
      seven27: 0,
      seven28: 0,
    });
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
          "esri/widgets/TimeSlider",
          "esri/geometry/Point",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Slider",
          "esri/geometry/geometryEngine",
          "esri/Graphic",
          "esri/renderers/FlowRenderer",
          "esri/widgets/Expand",
          "esri/layers/MapImageLayer",
          "esri/widgets/Sketch",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/geometry/SpatialReference",
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
            TimeSlider,
            Point,
            GraphicsLayer,
            Slider,
            geometryEngine,
            Graphic,
            FlowRenderer,
            Expand,
            MapImageLayer,
            Sketch,
            WebTileLayer,
            TileInfo,
            SpatialReference,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            const map = new Map({
              basemap: "topo-vector",
            });
            var view = new MapView({
              container: "Container",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
            });
            var sketchLayer = new GraphicsLayer();
            var bufferLayer = new GraphicsLayer();
            let sketchGeometry = null;
            let bufferGeometry = null;
            let highlightHandle = null;
            //全图按钮
            var homeBtn = new Home({
              view: view,
            });
            view.ui.add(homeBtn, "top-left");
            //收缩
            const resultexpand = new Expand({
              view: view,
              expandIconClass: "esri-icon-layer-list",
              content: resultBox,
            });
            var RiskPointLayer = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/trackpoint/MapServer/0",
            });
            map.add(RiskPointLayer, 0);
            /* var hospitalLayer = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/Point/Hospital/MapServer/0",
            });
            map.add(hospitalLayer, 0); */
            view.map.addMany([bufferLayer, sketchLayer]);
            view.ui.add({
              component: "buffermenu",
              position: "bottom-left",
              index: 0,
            });
            //图表
            var option;
            var option2;
            var myChart = echarts.init(document.getElementById("chart1"));
            var myChart2 = echarts.init(document.getElementById("chart2"));
            let autochange = () => {
              var option = {
                title: {
                  text: "活动轨迹位置分布",
                  left: "center",
                },
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  orient: "vertical",
                  left: "left",
                },
                series: [
                  {
                    name: "Access From",
                    type: "pie",
                    radius: "50%",
                    data: [
                      { value: piechartdata.chenghua, name: "成华区" },
                      { value: piechartdata.gaoxin, name: "高新区" },
                      { value: piechartdata.jiniu, name: "金牛区" },
                      { value: piechartdata.jinjiang, name: "锦江区" },
                      { value: piechartdata.longquanyiqu, name: "龙泉驿区" },
                      { value: piechartdata.pidu, name: "郫都区" },
                      { value: piechartdata.qingbaijiang, name: "青白江区" },
                      { value: piechartdata.qingyang, name: "青羊区" },
                      { value: piechartdata.shuangliu, name: "双流区" },
                      { value: piechartdata.tianfuxinqu, name: "天府新区" },
                      { value: piechartdata.wenjiang, name: "温江区" },
                      { value: piechartdata.wuhou, name: "武侯区" },
                      { value: piechartdata.xindu, name: "新都区" },
                    ],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                      },
                    },
                  },
                ],
              };
              option2 = {
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "cross",
                    crossStyle: {
                      color: "#999",
                    },
                  },
                },
                toolbox: {
                  feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ["line", "bar"] },
                    restore: { show: true },
                    saveAsImage: { show: true },
                  },
                },
                legend: {
                  data: ["Evaporation", "Precipitation", "Temperature"],
                },
                xAxis: [
                  {
                    type: "category",
                    data: [
                      "7/14",
                      "7/15",
                      "7/16",
                      "7/17",
                      "7/18",
                      "7/19",
                      "7/20",
                      "7/21",
                      "7/22",
                      "7/23",
                      "7/24",
                      "7/25",
                      "7/26",
                      "7/27",
                      "7/28",
                    ],
                    axisPointer: {
                      type: "shadow",
                    },
                  },
                ],
                yAxis: [
                  {
                    type: "value",
                    name: "出现次数",
                    min: 0,
                    max: 110,
                    interval: 10,
                    axisLabel: {
                      formatter: "{value} 次",
                    },
                  },
                  {
                    type: "value",
                    name: "Temperature",
                    min: 0,
                    max: 70,
                    interval: 5,
                    axisLabel: {
                      formatter: "{value} 次",
                    },
                  },
                ],
                series: [
                  {
                    name: "出现次数",
                    type: "bar",
                    tooltip: {
                      valueFormatter: function (value) {
                        return value + " 次";
                      },
                    },
                    data: [
                      piechartdata.seven13,
                      piechartdata.seven14,
                      piechartdata.seven15,
                      piechartdata.seven16,
                      piechartdata.seven17,
                      piechartdata.seven18,
                      piechartdata.seven19,
                      piechartdata.seven20,
                      piechartdata.seven21,
                      piechartdata.seven22,
                      piechartdata.seven23,
                      piechartdata.seven24,
                      piechartdata.seven25,
                      piechartdata.seven26,
                      piechartdata.seven27,
                      piechartdata.seven28,
                    ],
                  },
                  {
                    name: "Temperature",
                    type: "line",
                    yAxisIndex: 1,
                    tooltip: {
                      valueFormatter: function (value) {
                        return value + " 次";
                      },
                    },
                    data: [
                      piechartdata.seven13,
                      piechartdata.seven14,
                      piechartdata.seven15,
                      piechartdata.seven16,
                      piechartdata.seven17,
                      piechartdata.seven18,
                      piechartdata.seven19,
                      piechartdata.seven20,
                      piechartdata.seven21,
                      piechartdata.seven22,
                      piechartdata.seven23,
                      piechartdata.seven24,
                      piechartdata.seven25,
                      piechartdata.seven26,
                      piechartdata.seven27,
                      piechartdata.seven28,
                    ],
                  },
                ],
              };
              /* myChart.setOption(option); */
              myChart2.setOption(option2);
              myChart.setOption(option);
            };

            //滑动条
            const slider = new Slider({
              container: "sliderbox",
              min: 1000,
              max: 10000,
              values: [1000],
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
            const createbufferBtn = document.getElementById("createbuffer");
            createbufferBtn.addEventListener("click", () => {
              bufferLayer.removeAll();
              sketchGeometry = sketchLayer.graphics.items[0].geometry;
              sketchGeometry.spatialReference = view.spatialReference;
              createBuffer(sketchGeometry);
              bufferGeometry = bufferLayer.graphics.items[0].geometry;
              runQuery();
            });
            //清空按钮
            function clear() {
              sketchGeometry = null;
              bufferLayer.removeAll();
              sketchLayer.removeAll();
              if (highlightHandle) {
                highlightHandle.remove();
                highlightHandle = null;
              }
              queryStatistics();
            }
            const clearGeometryBtn = document.getElementById("clearGeometry");
            clearGeometryBtn.addEventListener("click", () => {
              clear();
            });
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
            //查询
            function runQuery() {
              const query = RiskPointLayer.createQuery();
              query.geometry = bufferGeometry;
              query.distance = slider.values;
              query.outFields = ["*"];
              query.returnGeometry = true;
              let allStats;
              RiskPointLayer.queryFeatures(query).then(function (response) {
                allStats = response.features;
                queryStatistics();
                const dataset = [];
                if (allStats) {
                  allStats.forEach((result, index) => {
                    const attributes = result.attributes;
                    dataset.push(attributes);
                  });
                } else {
                  console.log("find nothing");
                }
              });
              view.whenLayerView(RiskPointLayer).then(function (layerView) {
                RiskPointLayer.queryObjectIds(query).then((ids) => {
                  if (highlightHandle) {
                    highlightHandle.remove();
                    highlightHandle = null;
                  }
                  highlightHandle = layerView.highlight(ids);
                });
              });
              resultexpand.expand();
            }
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
              /* clear(); */
              if (event.state === "complete") {
                clear();
                sketchGeometry = event.graphic.geometry;
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
            });
            sketch.on("update", (event) => {
              if (event.state === "complete") {
                clear();
                sketchGeometry = event.graphics[0].geometry;
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
            });
            function queryStatistics() {
              let statDefinitions = [
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '成华区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "chenghua_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '高新区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "gaoxin_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '金牛区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "jiniu_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '锦江区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "jinjiang_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '龙泉驿区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "longquanyiqu_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '郫都区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "pidu_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '青白江区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "qingbaijiang_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '青羊区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "qingyang_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '双流区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "shuangliu_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '天府新区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "tianfuxinqu_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '温江区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "wenjiang_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '武侯区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "wuhou_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN DISTNAME = '新都区' THEN 1 ELSE 0 END",
                  outStatisticFieldName: "xindu_sum",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/13') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven13",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/14') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven14",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/15') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven15",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/16') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven16",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/17') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven17",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/18') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven18",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/19') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven19",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/20') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven20",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/21') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven21",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/22') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven22",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/23') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven23",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/24') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven24",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/25') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven25",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/26') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven26",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/27') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven27",
                  statisticType: "sum",
                },
                {
                  onStatisticField:
                    "CASE WHEN (date = date'2022/7/28') THEN 1 ELSE 0 END",
                  outStatisticFieldName: "seven28",
                  statisticType: "sum",
                },
              ];
              const query = RiskPointLayer.createQuery();
              query.geometry = bufferGeometry;
              /* query.where = "date = date '2022/7/13'"; */
              query.outStatistics = statDefinitions;
              RiskPointLayer.queryFeatures(query).then((result) => {
                const allStats = result.features[0].attributes;
                console.log(allStats);
                piechartdata = {
                  chenghua: allStats.chenghua_sum,
                  gaoxin: allStats.gaoxin_sum,
                  jiniu: allStats.jiniu_sum,
                  jinjiang: allStats.jinjiang_sum,
                  longquanyiqu: allStats.longquanyiqu_sum,
                  pidu: allStats.pidu_sum,
                  qingbaijiang: allStats.qingbaijiang_sum,
                  qingyang: allStats.qingyang_sum,
                  shuangliu: allStats.shuangliu_sum,
                  tianfuxinqu: allStats.tianfuxinqu_sum,
                  wenjiang: allStats.wenjiang_sum,
                  wuhou: allStats.wuhou_sum,
                  xindu: allStats.xindu_sum,
                  seven13: allStats.seven13,
                  seven14: allStats.seven14,
                  seven15: allStats.seven15,
                  seven16: allStats.seven16,
                  seven17: allStats.seven17,
                  seven18: allStats.seven18,
                  seven19: allStats.seven19,
                  seven20: allStats.seven20,
                  seven21: allStats.seven21,
                  seven22: allStats.seven22,
                  seven23: allStats.seven23,
                  seven24: allStats.seven24,
                  seven25: allStats.seven25,
                  seven26: allStats.seven26,
                  seven27: allStats.seven27,
                  seven28: allStats.seven28,
                };
                autochange();
                console.log(option);
              }, console.error);
            }
            queryStatistics();
            view.ui.remove("attribution");
            view.ui.add([
              {
                component: resultexpand,
                position: "top-right",
                index: 1,
              },
            ]);
          }
        )
        .catch((e) => {
          console.log("出现错误" + e.message);
        });
    };
    onMounted(() => {
      createView();
    });
    return { createView };
  },
  methods: {},
};
</script>

<style scoped>
#Container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
#chart {
  height: 400px;
  width: 450px;
}
#buffermenu {
  width: 450px;
}
</style>
