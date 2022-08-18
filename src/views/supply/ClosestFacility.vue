<template>
  <div id="MapView"></div>
</template>

<script>
import { loadModules } from "esri-loader";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
import Nprogress from "nprogress";
export default {
  name: "ClosestFacility",
  props: ["graphic"],
  setup(props) {
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
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/rest/closestFacility",
          "esri/rest/support/ClosestFacilityParameters",
          "esri/rest/support/FeatureSet",
          "esri/geometry/Point",
          "esri/symbols/Symbol",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            Graphic,
            GraphicsLayer,
            closestFacility,
            ClosestFacilityParameters,
            FeatureSet,
            Point,
            Symbol,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            console.log(props.graphic);
            let startSymbol = {
              type: "simple-marker",
              color: "white",
              size: "10px",
              outline: {
                color: "black",
                width: "1px",
              },
            };

            let facilitySymbol = {
              type: "simple-marker",
              color: "black",
              size: "11px",
              outline: {
                color: "white",
                width: "1px",
              },
            };

            let routeSymbol = {
              type: "simple-line",
              color: [50, 150, 255, 0.75],
              width: "5",
            };

            const closestFacilityUrl =
              "https://edutrial.geoscene.cn/geoscene/rest/services/C991networkService/NAServer/closestFacility";

            const routeLayer = new GraphicsLayer();
            const facilitiesLayer = new GraphicsLayer({
              geometry: props.graphic,
            });
            const selectedFacilitiesLayer = new GraphicsLayer();
            const startLayer = new GraphicsLayer();

            let map = new Map({
              basemap: "arcgis-navigation",
              layers: [
                routeLayer,
                facilitiesLayer,
                selectedFacilitiesLayer,
                startLayer,
              ],
            });

            let view = new MapView({
              container: "MapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
              constraints: {
                snapToZoom: false,
              },
            });

            view.popup.actions = [];

            view.when(() => {
              findFacilities(view.center);
            });

            view.on("click", (event) => {
              view.hitTest(event).then((response) => {
                if (response.results.length === 1) {
                  findFacilities(event.mapPoint);
                }
              });
            });

            function findFacilities(pt) {
              view.popup.close();
              addStart(pt);
              findClosestFacility(
                startLayer.graphics.getItemAt(0),
                facilitiesLayer.graphics
              );
            }

            function addStart(pt) {
              startLayer.graphics.removeAll();
              startLayer.add(
                new Graphic({
                  geometry: pt,
                  symbol: startSymbol,
                })
              );
            }

            function findClosestFacility(startGraphic, facilityGraphics) {
              routeLayer.removeAll();
              selectedFacilitiesLayer.removeAll();
              let params = new ClosestFacilityParameters({
                incidents: new FeatureSet({
                  features: [startGraphic],
                }),
                facilities: new FeatureSet({
                  features: facilityGraphics.toArray(),
                }),
                returnRoutes: true,
                returnFacilities: true,
                defaultTargetFacilityCount: 3,
              });

              closestFacility.solve(closestFacilityUrl, params).then(
                (results) => {
                  results.routes.forEach((route, i) => {
                    route.symbol = routeSymbol;
                    routeLayer.add(route);
                    const facility =
                      results.facilities[route.attributes.FacilityID - 1];
                    addSelectedFacility(
                      i + 1,
                      facility.latitude,
                      facility.longitude,
                      route.attributes
                    );
                  });
                },
                (error) => {
                  console.log(error.details);
                }
              );
            }

            function showFacilities(results) {
              results.forEach((result, i) => {
                facilitiesLayer.add(
                  new Graphic({
                    attributes: result.attributes,
                    geometry: result.location,
                    symbol: {
                      type: "web-style",
                      name: "grocery-store",
                      styleName: "Esri2DPointSymbolsStyle",
                    },
                    popupTemplate: {
                      title: "{Name}",
                      content:
                        "{Address}" +
                        "<br><br>" +
                        result.location.longitude.toFixed(5) +
                        "," +
                        result.location.latitude.toFixed(5),
                    },
                  })
                );
              });
            }

            function addSelectedFacility(
              number,
              latitude,
              longitude,
              attributes
            ) {
              selectedFacilitiesLayer.add(
                new Graphic({
                  symbol: {
                    type: "simple-marker",
                    color: [255, 255, 255, 1.0],
                    size: 18,
                    outline: {
                      color: [50, 50, 50],
                      width: 1,
                    },
                  },
                  geometry: {
                    type: "point",
                    latitude: latitude,
                    longitude: longitude,
                  },
                  attributes: attributes,
                })
              );
              selectedFacilitiesLayer.add(
                new Graphic({
                  symbol: {
                    type: "text",
                    text: number,
                    font: { size: 11, weight: "bold" },
                    yoffset: -4,
                    color: [50, 50, 50],
                  },
                  geometry: {
                    type: "point",
                    latitude: latitude,
                    longitude: longitude,
                  },
                  attributes: attributes,
                })
              );
            }
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
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
