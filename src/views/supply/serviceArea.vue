<template>
  <div id="MapView"></div>
  <div id="selectContainer" class="esri-widget">
    <select
      id="selectTravelMode"
      name="travelMode"
      class="esri-select esri-input"
      title="selectTravelMode"
    >
      <option value="car">驾车</option>
      <option selected value="walk">步行</option>
    </select>
  </div>
  <div id="legend">
    <div style="font-size: 18px;">服务区</div>
    <div class="linebox"><div id="purple"></div><span class="text">0——2</span></div>
    <div class="linebox"><div id="purple2"></div><span class="text">2——4</span></div>
    <div class="linebox"><div id="purple3"></div><span class="text">4——6</span></div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import { onMounted } from "vue";
import { Nprogress } from "nprogress";
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
          "esri/rest/networkService",
          "esri/rest/serviceArea",
          "esri/rest/support/ServiceAreaParameters",
          "esri/rest/support/FeatureSet",
          "esri/Graphic",
          "esri/widgets/ScaleBar",
          "esri/layers/FeatureLayer",
          "esri/widgets/Legend",
          "esri/layers/GraphicsLayer",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            Home,
            networkService,
            serviceArea,
            ServiceAreaParameters,
            FeatureSet,
            Graphic,
            ScaleBar,
            FeatureLayer,
            Legend,
            GraphicsLayer,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            //网络分析服务url
            const url =
              "https://edutrial.geoscene.cn/geoscene/rest/services/C991networkService/NAServer/serviceArea";
            let serviceAreaLayer = new GraphicsLayer();

            const map = new Map({
              basemap: "topo-vector",
            });
            //初始化参数
            let networkDescription = null;
            let defaultBreak = [2, 4, 6];
            let travelMode = null;

            const view = new MapView({
              container: "MapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
              constraints: {
                snapToZoom: false,
              },
            });
            var homeBtn = new Home({
              view: view,
            });
            view.ui.add(homeBtn, "top-left");
            var graphics = [];
            map.add(serviceAreaLayer);
            //在图层加载完成之后获取url中网络分析的描述属性
            Promise.all([
              view.when(),
              networkService.fetchServiceDescription(url),
            ]).then(([_view, description]) => {
              networkDescription = description;
              //监听选择出行模式的事件，
              const elem = document.getElementById("selectContainer");
              view.ui.add(elem, "top-right");
              document
                .getElementById("selectTravelMode")
                .addEventListener("change", changeTravelMode);
              createServiceAreas(view.center);
            });
            var supermarketLayer = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/POI/MapServer/0",
              title: "物资点",
            });
            map.add(supermarketLayer);
            var scaleBar = new ScaleBar({
              view,
              style: "line",
              unit: "metric",
            });
            view.ui.add(scaleBar, "bottom-right");
            view.ui.add("legend", "bottom-left");
            //点击地图创建分析服务区
            view.on("click", (event) => {
              /* Nprogress.start(); */
              createServiceAreas(event.mapPoint);
              /* Nprogress.done(); */
            });

            async function createServiceAreas(point) {
              const locationGraphic = createLocationGraphic(point);
              const serviceAreaParams = await createServiceAreaParameters(
                locationGraphic
              );
              executeServiceAreaTask(serviceAreaParams);
            }

            function createLocationGraphic(point) {
              //在Grahpic图层上绘制服务区
              view.graphics.removeAll();
              const graphic = new Graphic({
                geometry: point,
                symbol: {
                  type: "simple-marker",
                  color: "white",
                  size: 8,
                },
              });
              view.graphics.add(graphic);
              return graphic;
            }

            function createServiceAreaParameters(locationGraphic) {
              //设置设施点
              const facilities = new FeatureSet({
                features: [locationGraphic],
              });
              //组成分析参数
              const serviceAreaParameters = new ServiceAreaParameters({
                facilities,
                defaultBreaks: defaultBreak,
                outSpatialReference: view.spatialReference,
                travelMode,
                trimOuterPolygon: true,
                outputGeometryPrecisionUnits: "kilometers",
              });
              return serviceAreaParameters;
            }

            async function executeServiceAreaTask(serviceAreaParameters) {
              //解构出返回的服务区分析结果
              serviceAreaLayer.removeAll();
              const { serviceAreaPolygons } = await serviceArea.solve(
                url,
                serviceAreaParameters
              );
              for (const graphic of serviceAreaPolygons) {
                graphic.symbol = {
                  type: "simple-fill",
                  title: "",
                  color: [149, 80, 159, 0.35],
                  outline: {
                    color: "white",
                    width: 0.5,
                  },
                };
                console.log(graphic)
              }
              serviceAreaLayer.graphics.addMany(serviceAreaPolygons, 0);
              
            }
            //通过经纬度实现跳转
            async function zoomToCity(lon, lat) {
              if (!event.target.value) {
                view.goTo({
                  target: [104.08, 30.68],
                  zoom: 13,
                });
                return;
              }

              const center = [lon, lat];
              await view.goTo({
                center,
                zoom: 13,
              });
              createServiceAreas(view.center);
            }

            function changeTravelMode() {
              const value = document
                .querySelectorAll("select[name='travelMode'] > option:checked")
                .item(0)
                .getAttribute("value");
              //在网络分析图层描述中查询满足条件的出行模式
              travelMode = networkDescription.supportedTravelModes.find(
                (travelMode) => travelMode.name === value
              );
              //出行方式的时间属性的单位各不相同
              if (value == "walk") {
                defaultBreak = [2, 4, 6];
              } else {
                defaultBreak = [0.033333, 0.066667, 0.1];
              }
              createServiceAreas(view.center);
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
    return { createView };
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

#selectContainer {
  background: #00000000;
  box-shadow: none;
}

#selectTravelMode {
  min-width: 270px;
  font-size: 16px;
}

#legend {
  padding: 20px;
  display: flex;
  background-color: #fff;
  height: 150px;
  width: 200px;
  justify-content: space-around;
  align-content: space-around;
  flex-direction: column;
}
.linebox{
  display: flex;
}
#purple{
  background-color: rgba(149, 80, 159, 0.5);
  height: 20px;
  width: 40px;
}
#purple2{
  background-color: rgba(149, 80, 159, 0.35);
  height: 20px;
  width: 40px;
}
#purple3{
  background-color: rgba(149, 80, 159, 0.2);
  height: 20px;
  width: 40px;
}
.text{
  margin-left: 15px;
}
</style>
