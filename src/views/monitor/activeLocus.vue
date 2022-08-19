<template>
  <div id="Container"></div>
  <div id="timeSlider"></div>
</template>

<script>
import { loadModules } from "esri-loader";
export default {
  name: "Monitor",
  methods: {
    createView() {
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
            //添加图层

            var OptimizedHotSpot = new FeatureLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/timeAnalysis/FeatureServer/1",
            });
            map.add(OptimizedHotSpot);
/*             var timeAnalysis = new FeatureLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/timeAnalysis/FeatureServer/0",
            });
            map.add(timeAnalysis); */
            var HeatmaptimeAnalysis = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/HeatMapTime/MapServer/0",
            });
            map.add(HeatmaptimeAnalysis);
            view.whenLayerView(HeatmaptimeAnalysis).then((lv) => {
              // around up the full time extent to full hour
              timeSlider.fullTimeExtent =
                HeatmaptimeAnalysis.timeInfo.fullTimeExtent.expandTo("hours");
              timeSlider.stops = {
                interval: HeatmaptimeAnalysis.timeInfo.interval,
              };
            });
            //时间轴微件
            const timeSlider = new TimeSlider({
              container: "timeSlider",
              view: view,
              timeVisible: true,
              loop: true,
            });
            /* timeAnalysis.renderer = {
              type: "heatmap",
              field: "date",
              colorStops: [
                { ratio: 0, color: "rgba(255, 255, 255, 0)" },
                { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
                { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
                { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
                { ratio: 1, color: "rgba(255, 0, 0, 1)" },
              ],
              minDensity: 0,
              maxDensity: 500,
              radius: 50,
            }; */
            view.ui.remove("attribution");
          }
        )
        .catch((e) => {
          console.log("出现错误" + e.message);
        });
    },
  },
  mounted: function () {
    this.createView();
  },
  beforeDestory() {
    if (this.view) {
      this.view.container = null;
    }
  },
};
</script>

<style scoped>
#Container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#timeSlider {
  position: absolute;
  left: 20%;
  right: 5%;
  bottom: 20px;
}
</style>
