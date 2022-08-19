<template>
  <div id="MapView"></div>
</template>

<script>
import { loadModules } from "esri-loader";
import Nprogress from "nprogress";
import { onMounted } from "vue";
export default {
  setup() {
    let createView = () => {
      let options = {
        url: "https://js.arcgis.com/4.24/",
        css: "https://js.arcgis.com/4.24/esri/themes/light/main.css",
      };

      loadModules(
        [
          "esri/config",
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/FeatureLayer",
          "esri/widgets/Legend",
          "esri/renderers/HeatmapRenderer",
        ],
        options
      ).then(
        ([esriConfig, Map, MapView, FeatureLayer, Legend, HeatmapRenderer]) => {
          esriConfig.apiKey =
            "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
          const defaultSymbol = {
            type: "simple-fill",
            outline: {
              color: [128, 128, 128],
              width: "0.5px",
            },
          };
          /* const renderer = {
            type: "heatmap",
            colorStops: [
              { ratio: 0, color: "rgba(255, 255, 255, 0)" },
              { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
              { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
              { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
              { ratio: 1, color: "rgba(255, 0, 0, 1)" },
            ],
            minDensity: 0,
            maxDensity: 500,
            radius: 10,
          }; */

          const map = new Map({
            basemap: "topo-vector",
          });

          const view = new MapView({
            container: "MapView",
            map: map,
            center: [104.08, 30.68],
            zoom: 12,
          });
          const supermarketLayer = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/POI/MapServer/0",
            title: "物资点热力图",
          });
          map.add(supermarketLayer);
          supermarketLayer.renderer = {
            type: "heatmap",
            field: "OBJECTID",
            colorStops: [
              { ratio: 0, color: "rgba(255, 255, 255, 0)" },
              { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
              { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
              { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
              { ratio: 1, color: "rgba(255, 0, 0, 1)" },
            ],
            minDensity: 20,
            maxDensity: 500,
            radius: 10,
          };
          console.log(supermarketLayer);
          view.ui.add(
            new Legend({
              view: view,
            }),
            "top-right"
          );
        }
      );
    };
    onMounted(() => {
      createView();
    });
    return { createView };
  },
};
</script>

<style  scoped>
html,
body,
#MapView {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>