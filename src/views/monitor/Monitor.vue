<template>
  <div id="Container"></div>
  <el-card id="resultBox"
    ><div id="chart1" style="width: 480px; height: 400px"></div>
    <div id="chart2" style="width: 650px; height: 400px"></div
  ></el-card>
</template>

<script>
import { loadModules } from "esri-loader";
//echarts
import * as echarts from "echarts";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
export default {
  name: "Monitor",
  setup() {
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
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";

            var map = new Map({
              basemap: "osm",
            });
            var view = new MapView({
              container: "Container",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
            });

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
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/timeAnalysis/FeatureServer/0",
            });
            map.add(RiskPointLayer, 0);
            var hospitalLayer = new FeatureLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991Facilities/FeatureServer/3",
            });
            map.add(hospitalLayer, 0);
            //查询
            function queryStatistics() {
              let statDefinitions = [
                /* {
                  onStatisticField: "district",
                  outStatisticFieldName: "district_sum",
                  statisticType: "sum",
                }, */
                {
                  onStatisticField:
                    "district",
                  outStatisticFieldName: "district_sum",
                  statisticType: "sum",
                },
              ];
              const query = hospitalLayer.createQuery();
              /* query.geometry = sketchGeometry;
              query.distance = bufferSize; */
              query.where = "district = '成华区'";
              /* query.outStatistics = statDefinitions; */

              hospitalLayer.queryFeatures(query).then((result) => {
                const allStats = result.features[0].attributes;
                console.log(allStats);
                /* updateChart(materialChart, [
                  allStats.material_concrete,
                  allStats.material_brick,
                  allStats.material_wood,
                  allStats.material_steel,
                  allStats.material_other,
                ]);
                updateChart(yearChart, [
                  allStats.year_1850,
                  allStats.year_1900,
                  allStats.year_1925,
                  allStats.year_1950,
                  allStats.year_1975,
                  allStats.year_2000,
                ]); */
              }, console.error);
            }
            queryStatistics();
            //图表
            var myChart = echarts.init(document.getElementById("chart1"));
            var myChart2 = echarts.init(document.getElementById("chart2"));
            var option = {
              title: {
                text: "Referer of a Website",
                subtext: "Fake Data",
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
                    { value: 1048, name: "Search Engine" },
                    { value: 735, name: "Direct" },
                    { value: 580, name: "Email" },
                    { value: 484, name: "Union Ads" },
                    { value: 300, name: "Video Ads" },
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
            var option2 = {
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
                  data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  axisPointer: {
                    type: "shadow",
                  },
                },
              ],
              yAxis: [
                {
                  type: "value",
                  name: "Precipitation",
                  min: 0,
                  max: 250,
                  interval: 50,
                  axisLabel: {
                    formatter: "{value} ml",
                  },
                },
                {
                  type: "value",
                  name: "Temperature",
                  min: 0,
                  max: 25,
                  interval: 5,
                  axisLabel: {
                    formatter: "{value} °C",
                  },
                },
              ],
              series: [
                {
                  name: "Evaporation",
                  type: "bar",
                  tooltip: {
                    valueFormatter: function (value) {
                      return value + " ml";
                    },
                  },
                  data: [
                    2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0,
                    6.4, 3.3,
                  ],
                },
                {
                  name: "Precipitation",
                  type: "bar",
                  tooltip: {
                    valueFormatter: function (value) {
                      return value + " ml";
                    },
                  },
                  data: [
                    2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8,
                    6.0, 2.3,
                  ],
                },
                {
                  name: "Temperature",
                  type: "line",
                  yAxisIndex: 1,
                  tooltip: {
                    valueFormatter: function (value) {
                      return value + " °C";
                    },
                  },
                  data: [
                    2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0,
                    6.2,
                  ],
                },
              ],
            };
            myChart.setOption(option);
            myChart2.setOption(option2);
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
</style>
