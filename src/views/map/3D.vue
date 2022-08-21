<template>
  <div id="MapView"></div>
</template>



<script>
import  geolocate from "mock-geolocation"
import { loadModules } from 'esri-loader';
import { onMounted } from 'vue';
export default {
  setup() {
    let createView = () => {
      var options = {
        url: "https://js.arcgis.com/4.24/",
        css: "https://js.arcgis.com/4.24/esri/themes/light/main.css",
      };

      loadModules([
        "esri/widgets/Track",
        "esri/views/SceneView",
        "esri/layers/SceneLayer",
        "esri/Map",
        "esri/widgets/Home",
        "esri/rest/support/Stop",
        "esri/layers/RouteLayer"
        ], options).then(([
          Track,
          SceneView,
          SceneLayer,
          Map,
          Home,
          Stop,
          RouteLayer
          ]) => {
          stubGeolocation();

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
              position: [104.0896089, 30.6755822, 1500],
            },
            ui: {
              components: ["attribution"],
            },
          });

          const symbol = {
            type: "mesh-3d",
            symbolLayers: [
              {
                type: "fill",
                material: {
                  color: "#FFFCD4",
                },
              },
            ],
          };

          //添加场景图层
          const sceneLayer = new SceneLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_building/SceneServer/layers/0",
            popupEnabled: false,
            renderer: {
              type: "simple",
              symbol: symbol,
            },
          });
          map.add(sceneLayer);

          const home = new Home({
            view: view,
          });
          view.ui.add(home, "top-left");

          //引入追踪微件
          const track = new Track({
            view: view,
            goToLocationEnabled: false,
          });
          view.ui.add(track, "top-left");

          const routeLayer = new RouteLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/C991networkService/NAServer/route",
            view: view,
            stops: [
              new Stop({
                geometry: {
                  longitude: 104.0896089,
                  latitude: 30.6755822,
                },
              }),
              new Stop({
                geometry: {
                  longitude: 104.1347756,
                  latitude: 30.6749278,
                },
              }),
            ],
          });
          map.add(routeLayer, 0);
          StartSolve();

          async function StartSolve() {
            const results = await routeLayer.solve();
            routeLayer.update(results);
          }

          view.when(() => {
            let prevLocation = view.center;

            track.on("track", () => {
              const location = track.graphic.geometry;

              view
                .goTo({
                  center: location,
                  tilt: 60,
                  scale: 2000,
                  heading: 360 - getHeading(location, prevLocation),
                  rotation: 360 - getHeading(location, prevLocation),
                })
                .catch((error) => {
                  if (error.name != "AbortError") {
                    console.error(error);
                  }
                });

              prevLocation = location.clone();
            });

            track.start();
          });

          function getHeading(point, oldPoint) {
            const angleInDegrees =
              (Math.atan2(point.y - oldPoint.y, point.x - oldPoint.x) * 180) /
              Math.PI;

            return -90 + angleInDegrees;
          }

          function stubGeolocation() {
            let coords = [
              {
                lng: 104.0896089,
                lat: 30.6755822,
              },
              {
                lng: 104.0927118,
                lat: 30.6788710
              },
              {
                lng: 104.0938192,
                lat: 30.6780311
              },
              {
                lng: 104.0948731,
                lat: 30.6769545
              },
              {
                lng: 104.0957615,
                lat: 30.6772294
              },
              {
                lng: 104.0965995,
                lat: 30.6775026
              },
              {
                lng: 104.0969510,
                lat: 30.6769987
              },
              {
                lng: 104.0981918,
                lat: 30.6773586
              },
              {
                lng: 104.0994963,
                lat: 30.6777186
              },
              {
                lng: 104.0995653,
                lat: 30.6775865
              },
              {
                lng: 104.1003425,
                lat: 30.6778067
              },
              {
                lng: 104.1008050,
                lat: 30.6768112
              },
              {
                lng: 104.1009924,
                lat: 30.6768552
              },
              {
                lng: 104.1012136,
                lat: 30.6763087
              },
              {
                lng: 104.1016713,
                lat: 30.6764147
              },
              {
                lng: 104.1017082,
                lat: 30.6763521
              },
              {
                lng: 104.1059228,
                lat: 30.6776656
              },
              {
                lng: 104.1101805,
                lat: 30.6789211
              },
              {
                lng: 104.1137703,
                lat: 30.6800091
              },
              {
                lng: 104.1186549,
                lat: 30.6815454
              },
              {
                lng: 104.1238775,
                lat: 30.6831502,
              },
              {
                lng: 104.126679,
                lat: 30.6810703,
              },
              {
                lng: 104.1298049,
                lat: 30.6787168,
              },
              {
                lng: 104.1325198,
                lat: 30.6766814,
              },
              {
                lng: 104.1347756,
                lat: 30.6749278,
              },
            ],
              currentCoordIndex = 0;

            geolocate.use();

            setInterval(() => {
              geolocate.change(coords[currentCoordIndex]);
              currentCoordIndex = (currentCoordIndex + 1) % coords.length;
            }, 2000);
          }
        })
        .catch((e) => {
          console.log("出现错误" + e.message);
        });

    };

    onMounted(() => {
      createView();
    });
    return {
      createView
    }
  }
}
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