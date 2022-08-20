<template>
  <div id="MapView"></div>
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
        ]) => {
          esriConfig.apiKey =
            "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";

          const layer = new MapImageLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/C991_hosGradingSymbol/MapServer",
            blendMode: "average",
            title:"医疗资源",
          });

          const map = new Map({
            basemap: "topo-vector",
            layers: [layer],
          });
          const view = new MapView({
            container: "MapView",
            map: map,
            center: [104.08, 30.68],
            zoom: 16,
          });
          const homeBtn = new Home({
            view: view,
          });
          const scaleBar = new ScaleBar({
            view: view,
            unit: "dual",
          });
          const layerList = new LayerList({
            view: view,
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
          view.ui.add(scaleBar, "bottom-right");
          view.ui.add(layerListExpand, "top-right");
          view.ui.add(legendExpand, "bottom-left");
          view.ui.add(compass, "top-left");
          layer.when(() => {
            const initialExtent = Extent.fromJSON(
              layer.sourceJSON.initialExtent
            );
            view.goTo(initialExtent);
          });
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
