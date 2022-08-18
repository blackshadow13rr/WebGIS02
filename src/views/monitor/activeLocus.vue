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
        .then(([esriConfig, Map, MapView, Home, FeatureLayer, TimeSlider]) => {
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
          var timeAnalysis = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/timeAnalysis/FeatureServer/0",
          });
          map.add(timeAnalysis);
          view.whenLayerView(timeAnalysis).then((lv) => {
            // around up the full time extent to full hour
            timeSlider.fullTimeExtent =
              timeAnalysis.timeInfo.fullTimeExtent.expandTo("hours");
            timeSlider.stops = {
              interval: timeAnalysis.timeInfo.interval,
            };
          });
          //时间轴微件
          const timeSlider = new TimeSlider({
            container: "timeSlider",
            view: view,
            timeVisible: true,
            loop: true,
          });

          view.ui.remove("attribution");
        })
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
