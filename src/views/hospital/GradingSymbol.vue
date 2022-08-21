<template>
  <div id="MapView"></div>
  <div id="layerchange"><el-button type="切换">Info</el-button></div>
</template>

<script>
import { loadModules } from "esri-loader";
import { onMounted } from "vue";
export default {
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
          "esri/widgets/ScaleBar",
          "esri/widgets/LayerList",
          "esri/widgets/Legend",
          "esri/widgets/Expand",
          "esri/widgets/Compass",
          "esri/geometry/Extent",
          "esri/layers/MapImageLayer",
          "esri/layers/FeatureLayer",
          "esri/widgets/LayerList/LayerListViewModel",
        ],
        options
      ).then(
        ([
          esriConfig,
          Map,
          MapView,
          Home,
          ScaleBar,
          LayerList,
          Legend,
          Expand,
          Compass,
          Extent,
          MapImageLayer,
          FeatureLayer,
          LayerListViewModel,
        ]) => {
          esriConfig.apiKey =
            "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
          const map = new Map({
            basemap: "topo-vector",
          });
          const view = new MapView({
            container: "MapView",
            map: map,
            center: [104.08, 30.68],
            zoom: 12,
          });

          var hospitalLayer1 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_hosGradingSymbol/FeatureServer/1",
            blendMode: "darken",
            title: "分级色彩",
            visible: false,
          });
          map.add(hospitalLayer1);
          var hospitalLayer2 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_hosGradingSymbol/FeatureServer/2",
            title: "分级符号",
            visible: false,
          });
          map.add(hospitalLayer2);
          const hospitalscale = new MapImageLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/C991_BigHos1111/MapServer",
            title: "医院规模",
            visible: true,
          });
          map.add(hospitalscale);
          const homeBtn = new Home({
            view: view,
          });
          const layerList = new LayerList({
            view: view,
          });
          let changeLayer = document.getElementById("layerchange");
          changeLayer.addEventListener("click", async () => {
            if(hospitalscale.visible ==true){
              hospitalLayer1.visible = true
              hospitalLayer2.visible = true
              hospitalscale.visible = false
              return
            }
            if(hospitalLayer1.visible == true){
              hospitalLayer1.visible = false
              hospitalLayer2.visible = false
              hospitalscale.visible = true
              return
            }
          });
          const legend = new Legend({
            view: view,
          });
          const layerListExpand = new Expand({
            view: view,
            content: layerList,
            expanded: false,
            expandTooltip: "Expand LayerList",
          });
          const legendExpand = new Expand({
            view: view,
            content: legend,
            expandTooltip: "Expand Legend",
            expanded: true,
          });
          const compass = new Compass({
            view: view,
            visible: false,
          });
          view.ui.add(homeBtn, "top-left");
          view.ui.add(layerListExpand, "top-right");
          view.ui.add(legendExpand, "bottom-left");
          view.ui.add(compass, "top-left");
          view.ui.add([
            {
              component: "layerchange",
              position: "bottom-right",
              index: 1,
            },
          ]);
          /* hospitalscale.when(() => {
            const initialExtent = Extent.fromJSON(
              hospitalscale.sourceJSON.initialExtent
            );
            view.goTo(initialExtent);
          }); */
          // load the Compass only when the view is rotated
          view.watch("rotation", function (rotation) {
            if (rotation && !compass.visible) {
              compass.visible = true;
            }
          });
        }
      );
    };
    onMounted(() => {
      createView();
    });
    return {
      createView,
    };
  },
};
</script>

<style  scoped>
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
