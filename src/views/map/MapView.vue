<template>
  <div id="MapView"></div>
</template>

<script>
import { loadModules } from "esri-loader";
export default {
  name: "MapView",
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
          "esri/widgets/Directions",
          "esri/layers/RouteLayer",
          "esri/rest/support/PolylineBarrier",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            Directions,
            RouteLayer,
            PolylineBarrier
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            // create a new RouteLayer, required for Directions widgetconst polylineBarriers = [
            const polylineBarriers = [
              new PolylineBarrier({
                geometry: {
                  paths: [
                    [
                      [104.08, 30.68],
                      [104.08, 30.88],
                    ],
                  ],
                },
                name: "Major highway closure",
              }),
            ];
            const routeLayer = new RouteLayer({
              url: "http://43.142.31.47:6080/arcgis/rest/services/networkAnalysis/NAServer/route",
              polylineBarriers,
            });
            // new RouteLayer must be added to the map
            const map = new Map({
              basemap: "topo-vector",
              layers: [routeLayer],
            });
            const view = new MapView({
              zoom: 14,
              center: [104.08, 30.68],
              container: "viewDiv",
              map: map,
            });
            // new RouteLayer must be added to Directions widget
            let directionsWidget = new Directions({
              layer: routeLayer,
              view: view,
            });
            // Add the Directions widget to the top right corner of the view
            view.ui.add(directionsWidget, {
              position: "top-right",
            });
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
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>