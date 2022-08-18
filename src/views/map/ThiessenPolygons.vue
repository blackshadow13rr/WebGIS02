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
        ],
        options
      ).then(([esriConfig, Map, MapView, FeatureLayer, Legend]) => {
        esriConfig.apiKey =
          "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
        const defaultSymbol = {
          type: "simple-fill",
          outline: {
            color: [128, 128, 128],
            width: "0.5px",
          },
        };

        const renderer = {
          type: "simple",
          symbol: defaultSymbol,
          label: "泰森多边形",
          visualVariables: [
            {
              type: "color",
              field: "Count_",
              stops: [
                {
                  value: 0,
                  color: "rgba(219, 233, 246, 0.2)",
                  label: "0",
                },
                {
                  value: 33,
                  color: "rgba(39, 119, 184, 0.7)",
                  label: "33",
                },
                {
                  value: 67,
                  color: "rgba(8, 48, 107, 0.8)",
                  label: "67",
                },
              ],
            },
          ],
        };

        const Thiessen = new FeatureLayer({
          url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_ThiessenPolygon/FeatureServer/0",
          renderer: renderer,
          title: "物资点覆盖小区数量",
          popupTemplate: {
            title: "{DISTNAME}——{Name}",
            content: "服务数量：  {Count_}",
          },
        });

        const map = new Map({
          basemap: "topo-vector",
          layers: [Thiessen],
        });

        const view = new MapView({
          container: "MapView",
          map: map,
          center: [104.08, 30.68],
          zoom: 12,
        });

        view.ui.add(
          new Legend({
            view: view,
          }),
          "top-right"
        );
      });
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
