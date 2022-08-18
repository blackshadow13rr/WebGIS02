<template>
  <div id="MapView"></div>
</template>

<script>
import { loadModules } from "esri-loader";
import { GetLocation } from "../../../api/barriers";
import Nprogress from "nprogress";
import { onMounted } from "vue";
export default {
  name: "viewDiv",
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
          "esri/widgets/Directions",
          "esri/widgets/Directions/DirectionsViewModel",
          "esri/layers/RouteLayer",
          "esri/rest/support/PolylineBarrier",
          "esri/rest/support/Stop",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            Directions,
            DirectionsViewModel,
            RouteLayer,
            PolylineBarrier,
            Stop,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";

            const polylineBarriers = [
              new PolylineBarrier({
                geometry: {
                  paths: [
                    [
                      [104.08, 30.68],
                      [104.08, 30.78],
                    ],
                  ],
                },
                name: "Major highway closure",
              }),
            ];

            function polygonBarrierGraphic(lon, lat) {
              return new Circle({
                center: [lon, lat],
                geodesic: true,
                numberOfPoints: 100,
                radius: 400,
                radiusUnit: "meters",
              });
            }
            //接收参数：
            //起点以及终点的name、geometry对象
            const routeLayer = new RouteLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/C991networkService/NAServer/route",
              stops: [
                new Stop({
                  name: "【起点名】",
                  geometry: {
                    spatialReference: {
                      latestWkid: 3857,
                      wkid: 102100,
                    },
                    x: 11589748.073435064,
                    y: 3594098.1369922976,
                  },
                }),
                new Stop({
                  name: "【终点名】",
                  geometry: {
                    spatialReference: {
                      latestWkid: 3857,
                      wkid: 102100,
                    },
                    x: 11580636.779605167,
                    y: 3590750.194920144,
                  },
                }),
              ],
              polylineBarriers,
            });
            const map = new Map({
              basemap: "topo-vector",
              layers: [routeLayer],
            });
            const view = new MapView({
              zoom: 14,
              center: [104.08, 30.68],
              container: "MapView",
              map: map,
            });
            let directionsVM = new DirectionsViewModel({
              layer: routeLayer,
            });
            let directionsWidget = new Directions({
              viewModel: directionsVM,
              view: view,
              visibleElements: {
                layerDetailsLink: false,
                saveAsButton: false,
                saveButton: false,
              },
            });
            view.ui.add(directionsWidget, "top-right");
            directionsVM.load().then(() => {
              directionsVM.getDirections();
            });
          }
        )
        .catch((e) => {
          console.log("出现错误" + e.message);
        });
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

<style scoped>
html,
body,
#MapView {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
