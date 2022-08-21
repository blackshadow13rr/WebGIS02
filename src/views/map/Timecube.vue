<template>
  <div id="MapView"></div>
</template>



<script>
import geolocate from "mock-geolocation";
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
          "esri/widgets/Track",
          "esri/views/SceneView",
          "esri/layers/SceneLayer",
          "esri/Map",
          "esri/widgets/Home",
          "esri/rest/support/Stop",
          "esri/layers/RouteLayer",
        ],
        options
      )
        .then(([Track, SceneView, SceneLayer, Map, Home, Stop, RouteLayer]) => {
          const map = new Map({
            basemap: "topo-vector",
            ground: "world-elevation",
          });

          const view = new SceneView({
            map: map,
            container: "MapView",
            center: [104.0896089, 30.6755822],
            zoom: 12,
            camera: {
              position: [103.84543155340633, 29.88433319751249, 57073.80763420276],
              tilt: 59.44576680145828,
              heading: 14.3306283974085,
              fov: 55
            },

            ui: {
              components: ["attribution"],
            },
          });
          view.on("drag", () => {
            console.log(view.camera);
          });
          //添加场景图层
          const sceneLayer = new SceneLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/3D91/SceneServer",
            popupEnabled: false,
          });
          map.add(sceneLayer);

          const home = new Home({
            view: view,
          });
          view.ui.add(home, "top-left");
        })
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

<style  scoped>
html,
body,
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>