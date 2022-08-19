<template>
  <div id="MapView"></div>

  <el-card class="box-card" id="orderlist">
    <el-tabs class="demo-tabs" v-model="activeName" stretch>
      <el-tab-pane label="订单列表" name="odlist" id="odlist">
        <el-button id="getOrder"
          >刷新订单<el-icon> <AddLocation /> </el-icon
        ></el-button>
        <el-table
          :data="tableData"
          style="width: 100%"
          @row-click="gotoPoint"
          max-height="400"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="Oid" label="订单编号" width="170" />
          <el-table-column prop="Oaddress" label="订单地址" width="245" />
          <el-table-column
            prop="Ostate"
            label="状态"
            width="80"
            :filters="[
              { text: '待处理', value: '待处理' },
              { text: '进行中', value: '进行中' },
              { text: '待分配', value: '待分配' },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="物资点列表" name="second" :disabled="tabtwo">
        <div class="count">
          附近的物资点数量:
          <div class="count" id="count">0</div>
        </div>
        <el-button type="primary" id="naviToClosestF" color="#5F9EA0"
          >分析最邻近</el-button
        >
        <el-divider style="margin: 24px 0 0 0" />
        <el-table :data="splist" style="width: 100%" max-height="400">
          <el-table-column prop="Address" label="地址" width="180" />
          <el-table-column prop="Name" label="店名" width="180" />
          <el-table-column prop="Phone_Number" label="电话" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="志愿者列表" name="third" :disabled="tabthree"
        ><div class="count">
          附近的志愿者人数:
          <div class="count" id="count">6</div>
        </div>
        <el-button type="primary" id="setOrder" color="#5F9EA0"
          >分配订单</el-button
        >
        <el-divider style="margin: 24px 0 0 0" />
        <el-table :data="vlist" style="width: 100%" max-height="400">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="Name" label="姓名" width="110" />
          <el-table-column prop="Position" label="当前位置" width="250" />
          <el-table-column prop="Phone_Number" label="电话" /> </el-table
      ></el-tab-pane>
      <el-tab-pane label="设置路径" name="fourth" :disabled="tabfour"
        ><div id="routeBox"></div>
        <div>
          <el-button type="success" round id="getroute" color="#5F9EA0"
            >生成路径</el-button
          >
        </div></el-tab-pane
      >
    </el-tabs>
  </el-card>
  <el-card id="buffermenu">
    <el-form label-width="90px">
      <div id="sketchbox"></div>
      <el-form-item label="缓冲区半径:">
        <div id="sliderbox"></div>
      </el-form-item>
    </el-form>
    <el-button type="primary" id="createbuffer" color="#5F9EA0">创建</el-button>
    <el-button id="clearGeometry">清空</el-button>
  </el-card>
</template>

<script>
import "@esri/calcite-components/dist/calcite/calcite.css";
import { loadModules } from "esri-loader";
import {
  GetOrderPoint,
  GetOrderList,
  GetOrderPointById,
  SetOrder,
} from "@/../api/admin";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
import { AddLocation, Edit } from "@element-plus/icons-vue";
import Supply from "@/views/supply/Supply.vue";
import { $EleMsgNotifyError, $EleMsgNotifySuccess } from "@/../utils/alert.js";
import Nprogress from "nprogress";
import { useRouter } from "vue-router";
import { rowKey } from "element-plus/lib/components/table-v2/src/common";
export default {
  name: "Order",
  components: {
    Supply,
    AddLocation,
    Edit,
  },
  setup() {
    let router = useRouter();
    const filterTag = (value, row) => {
      return row.Ostate === value;
    };
    let data = reactive({
      tableData: [],
      splist: [],
      Ostate: "",
      Oid: "",
      PointSet: [],
      tempPoint: [],
      trigger: false,
      vlist: [],
      activeName: "odlist",
      tabtwo: true,
      tabthree: true,
      tabfour: true,
    });
    let orderdata = reactive({
      Oid: "",
      Odestination: "",
      ODlon: "",
      ODlat: "",
    });
    let gotoPoint = async (row) => {
      data.Oid = row.Oid;
      data.trigger = true;
    };
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
          "esri/layers/FeatureLayer",
          "esri/widgets/Search",
          "esri/geometry/Point",
          "esri/geometry/Circle",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/Graphic",
          "esri/widgets/Expand",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/widgets/Slider",
          "esri/geometry/geometryEngine",
          "esri/widgets/Directions",
          "esri/widgets/Directions/DirectionsViewModel",
          "esri/layers/RouteLayer",
          "esri/rest/support/PolygonBarrier",
          "esri/rest/support/Stop",
          "esri/rest/closestFacility",
          "esri/rest/support/ClosestFacilityParameters",
          "esri/rest/support/FeatureSet",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            Home,
            FeatureLayer,
            Search,
            Point,
            Circle,
            SimpleMarkerSymbol,
            Graphic,
            Expand,
            GraphicsLayer,
            Sketch,
            SketchViewModel,
            Slider,
            geometryEngine,
            Directions,
            DirectionsViewModel,
            RouteLayer,
            PolygonBarrier,
            Stop,
            closestFacility,
            ClosestFacilityParameters,
            FeatureSet,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            let highlightHandle = null;
            let allStats = null;
            //停靠点
            let ordergeometry = null;
            let volunteergeometry = null;
            let supplygeometry = null;
            let ordergeometryname = null;
            let supplygeometryname = null;
            //路径模块
            const polygonBarriers = [
              new PolygonBarrier({
                geometry: polygonBarrierGraphic(104.08, 30.68),
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
                  name: "志愿者位置",
                  geometry: volunteergeometry,
                }),
                new Stop({
                  name: "物资点位置",
                  geometry: ordergeometry,
                }),
                new Stop({
                  name: "终点",
                  geometry: supplygeometry,
                }),
              ],
              polygonBarriers,
            });
            //最近设施点
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

            const lineLayer = new GraphicsLayer();
            const facilitiesLayer = new GraphicsLayer();
            const selectedFacilitiesLayer = new GraphicsLayer();
            const startLayer = new GraphicsLayer();

            //地图
            var map = new Map({
              basemap: "topo-vector",
            });
            var view = new MapView({
              container: "MapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
            });
            //添加绘制图层
            var sketchLayer = new GraphicsLayer();
            var bufferLayer = new GraphicsLayer();
            var orderLayer = new GraphicsLayer();
            view.map.addMany([
              bufferLayer,
              sketchLayer,
              orderLayer,
              routeLayer,
              lineLayer,
              facilitiesLayer,
              startLayer,
              selectedFacilitiesLayer,
            ]);
            //全图按钮
            var homeBtn = new Home({
              view: view,
            });
            //收缩
            const orderlistexpand = new Expand({
              view: view,
              expandIconClass: "esri-icon-layer-list",
              content: orderlist,
            });
            view.ui.remove("attribution");
            view.ui.add([
              {
                component: orderlistexpand,
                position: "top-right",
                index: 1,
              },
              {
                component: "buffermenu",
                position: "bottom-left",
                index: 2,
              },
            ]);
            view.ui.add(homeBtn, "top-left");
            //路径微件
            let directionsVM = new DirectionsViewModel({
              layer: routeLayer,
            });
            let directionsWidget = new Directions({
              viewModel: directionsVM,
              view: view,
              container: "routeBox",
              visibleElements: {
                layerDetailsLink: false,
                saveAsButton: false,
                saveButton: false,
              },
            });
            let getroute = document.getElementById("getroute");
            getroute.addEventListener("click", () => {
              console.log(ordergeometry);
              console.log(supplygeometry);
              routeLayer.stops = [
                new Stop({
                  name: supplygeometryname,
                  geometry: supplygeometry,
                }),
                new Stop({
                  name: ordergeometryname,
                  geometry: ordergeometry,
                }),
              ];
              directionsVM.getDirections();
            });

            //弹出窗口
            var popup = view.popup;
            popup.actions = [];
            popup.dockEnable = true;
            popup.dockOptions = {
              breakpoints: false,
              buttonEnabled: false,
            };
            popup.defaultPopupTemplateEnabled = true;
            const supermarkettemplate = {
              title: "{Name}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "Name",
                      label: "店名",
                    },
                    {
                      fieldName: "Address",
                      label: "地址",
                    },
                    {
                      fieldName: "Phone_Number",
                      label: "电话",
                    },
                  ],
                },
              ],
            };
            //分别添加图层
            var supermarketLayer = new FeatureLayer({
              url: "https://localhost:6443/arcgis/rest/services/POI/MapServer/0",
              popupTemplate: supermarkettemplate,
            });
            map.add(supermarketLayer, 0);
            var highriskLayer = new FeatureLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991Facilities/FeatureServer/7",
            });
            map.add(highriskLayer, 0);

            //搜索图层
            var searchWidget = new Search({
              view: view,
              sources: [
                {
                  layer: new FeatureLayer({
                    url: supermarketLayer.url,
                  }),
                  maxResults: 100,
                  name: "超市",
                },
              ],
            });
            // //搜索建立缓冲区
            // searchWidget.on("select-result", function (event) {
            //   createbufferBtn.addEventListener("click", () => {
            //     bufferLayer.removeAll();
            //     createBuffer(event.result.feature.geometry);
            //     runQuery();
            //   });
            // });
            // view.ui.add(searchWidget, {
            //   position: "top-right",
            //   index: 2,
            // });
            //添加动态特效
            let highlight;
            let lastUid;
            //当前选中点索引
            let itemindex = 0;
            //根据鼠标移动获取几何图形
            function getGraphic(response) {
              let graphic;
              if (
                response.results.length &&
                response.results[0].graphic.layer === supermarketLayer
              ) {
                graphic = response.results[0].graphic;
              }
              return graphic;
            }
            //分配订单按钮
            let setOrder = document.getElementById("setOrder");
            setOrder.addEventListener("click", async () => {
              orderdata.Odestination = supplygeometryname;
              orderdata.Oid =
                orderLayer.graphics.items[itemindex].attributes.Oid;
              orderdata.ODlon = supplygeometry.longitude;
              orderdata.ODlat = supplygeometry.latitude;
              sendOrder();
              data.activeName = "fourth";
              data.tabfour = false;
            });
            let sendOrder = async () => {
              let status = await SetOrder(orderdata);
              if (status) {
                $EleMsgNotifySuccess("已分配给志愿者");
              } else {
                $EleMsgNotifyError("分配失败，请重新设置");
              }
            };
            var clickgetorderlist = async () => {
              let Order = await GetOrderList();
              data.PointSet = [];
              data.tableData = Order;
              data.tableData.forEach(async (result, index) => {
                let Point = await GetOrderPointById(result);
                data.PointSet.push(Point[0]);
                /* var jsonstr = JSON.parse(data.PointSet[0].Odetail);
        console.log(jsonstr[0]); */
              });
            };
            clickgetorderlist();
            //刷新订单
            let locationBtn = document.getElementById("getOrder");
            locationBtn.addEventListener("click", async () => {
              clickgetorderlist();
              clear();
              addPoint(data.PointSet);
            });
            //点击列表事件
            let odlist = document.getElementById("odlist");
            odlist.addEventListener("click", async () => {
              if (data.trigger === true) {
                data.tempPoint = await GetOrderPointById(data);
                orderLayer.graphics.items.forEach((result, index) => {
                  if (
                    orderLayer.graphics.items[index].attributes.Oid === data.Oid
                  ) {
                    itemindex = index;
                  }
                });
                AutoQueryFirst(data.tempPoint[0]);
                orderlistexpand.collapse();
                /* console.log(orderLayer.graphics.items[0]); */
                //创建按钮
                const createbufferBtn = document.getElementById("createbuffer");
                createbufferBtn.addEventListener("click", () => {
                  bufferLayer.removeAll();
                  view.popup.close();
                  sketchGeometry =
                    orderLayer.graphics.items[itemindex].geometry;
                  sketchGeometry.spatialReference = view.spatialReference;
                  createBuffer(sketchGeometry);
                  bufferGeometry = bufferLayer.graphics.items[0].geometry;
                  runQuery();
                  orderlistexpand.expand();
                  data.activeName = "second";
                  data.tabtwo = false;
                });
                data.trigger = false;
              }
            });
            //订单绘制点
            let addPoint = (PointSet) => {
              orderLayer.removeAll();
              /* let Point = await GetOrderPoint(data); */
              if (PointSet !== []) {
                PointSet.forEach((result, index) => {
                  createPoint(
                    PointSet[index].OPlon,
                    PointSet[index].OPlat,
                    PointSet[index]
                  );
                });
                orderlistexpand.collapse();
              } else {
                console.log("No order!");
              }
            };
            let createPoint = (lon, lat, data) => {
              var point = new Point({
                latitude: lat,
                longitude: lon,
                spatialReference: view.spatialReference,
              });
              var simpleMarkerSymbol = new SimpleMarkerSymbol({
                style: "square",
                color: "blue",
                size: "8px",
                outline: {
                  width: 1,
                },
              });
              var graphic = new Graphic(point, simpleMarkerSymbol);
              graphic.attributes = data;
              orderLayer.graphics.add(graphic);
            };
            function AutoQueryFirst(order) {
              /* view.goTo(orderLayer.graphics).then(function () { */
              view.zoom = 16;
              view.center = [order.OPlon, order.OPlat];
              view.popup.open({
                title: "订单请求",
                content:
                  "<ul>" +
                  "<li> 订单号: " +
                  order.Oid +
                  "</li>" +
                  "<li> 订单地址: " +
                  order.Oaddress +
                  "</li>" +
                  "<li> 订单状态: " +
                  order.Ostate +
                  "</li>" +
                  "<li> 用户名: " +
                  order.Ouser +
                  "</li>" +
                  "</ul>",
                location: [order.OPlon, order.OPlat],
              });
            }
            //确定最近设施点
            function findFacilities(pt) {
              addStart(pt);
              facilitiesLayer.graphics = allStats;
              console.log(facilitiesLayer.graphics);
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
              lineLayer.removeAll();
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
                defaultTargetFacilityCount: 1,
              });
              closestFacility.solve(closestFacilityUrl, params).then(
                (results) => {
                  results.routes.forEach((route, i) => {
                    let name = route.attributes.Name;
                    name = name.replace(/Location 1 - /, "");
                    supplygeometryname = name;
                    const facility =
                      results.facilities[route.attributes.FacilityID - 1];
                    supplygeometry = facility;
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
                    text: "✔",
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
            document
              .getElementById("naviToClosestF")
              .addEventListener("click", () => {
                //最近设施点选择
                findFacilities(orderLayer.graphics.items[itemindex].geometry);
                ordergeometry = orderLayer.graphics.items[itemindex].geometry;
                ordergeometryname =
                  orderLayer.graphics.items[itemindex].attributes.Oaddress;
                data.activeName = "third";
                data.tabthree = false;
              });
            //清空按钮
            function clear() {
              sketchGeometry = null;
              bufferLayer.removeAll();
              sketchLayer.removeAll();
              if (highlightHandle) {
                highlightHandle.remove();
                highlightHandle = null;
              }
              document.getElementById("count").innerHTML = 0;
              data.splist = [];
            }
            const clearGeometryBtn = document.getElementById("clearGeometry");
            clearGeometryBtn.addEventListener("click", () => {
              clear();
            });

            data.vlist = [
              {
                Name: "张三",
                Position: "建设北路二段5号附1号35栋",
                Phone_Number: "15381007036",
              },
              {
                Name: "李四",
                Position: "建设北路二段5号附1号35栋",
                Phone_Number: "15381007036",
              },
              {
                Name: "王五",
                Position: "建设北路二段5号附1号35栋",
                Phone_Number: "15381007036",
              },
              {
                Name: "赵六",
                Position: "建设北路二段5号附1号35栋",
                Phone_Number: "15381007036",
              },
            ];

            //创建缓冲区
            var polySym = {
              type: "simple-fill",
              color: [140, 140, 222, 0.5],
              outline: {
                color: [0, 0, 0, 0.5],
                width: 2,
              },
            };
            function createBuffer(geometry) {
              var buffer = geometryEngine.buffer(
                geometry,
                slider.values,
                "meters",
                false
              );
              bufferLayer.add(
                new Graphic({
                  geometry: buffer,
                  symbol: polySym,
                })
              );
            }

            //滑动条
            const slider = new Slider({
              container: "sliderbox",
              min: 1000,
              max: 20000,
              values: [1000],
              snapOnClickEnabled: false,
              visibleElements: {
                labels: true,
                rangeLabels: true,
              },
              labelFormatFunction: (values, type) => {
                return `${values.toString()}m`;
              },
              precision: 0,
            });
            let sketchGeometry = null;
            let bufferGeometry = null;
            //滑动条控制半径变化
            slider.on(["thumb-change", "thumb-drag"], function () {
              if (bufferLayer.graphics.items[0]) {
                bufferLayer.removeAll();
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
              if (sketchLayer.graphics.items[0]) {
              }
            });

            //查询功能
            function runQuery() {
              Nprogress.start();
              const query = supermarketLayer.createQuery();
              query.geometry = bufferGeometry;
              query.distance = slider.values;
              query.outFields = ["Name", "Address", "Phone_Number"];
              query.returnGeometry = true;
              supermarketLayer.queryFeatures(query).then(function (response) {
                allStats = response.features;
                const dataset = [];
                if (allStats) {
                  Nprogress.done();
                  document.getElementById("count").innerHTML = allStats.length;
                  allStats.forEach((result, index) => {
                    const attributes = result.attributes;
                    dataset.push(attributes);
                  });
                  data.splist = dataset;
                } else {
                  console.log("find nothing");
                }
              });
              view.whenLayerView(supermarketLayer).then(function (layerView) {
                supermarketLayer.queryObjectIds(query).then((ids) => {
                  if (highlightHandle) {
                    highlightHandle.remove();
                    highlightHandle = null;
                  }
                  highlightHandle = layerView.highlight(ids);
                });
              });
            }
            //获取障碍面
            function queryHighRisk() {
              const query = highriskLayer.createQuery();
              query.returnGeometry = true;
              highriskLayer.queryFeatures(query).then(function (response) {
                let poly = null;
                response.features.forEach((element) => {
                  poly = new PolygonBarrier({ geometry: element.geometry });
                  polygonBarriers.push(poly);
                });
                routeLayer.polygonBarriers = polygonBarriers;
              });
            }
            queryHighRisk();
            //草图绘制
            let sketch = new Sketch({
              layer: sketchLayer,
              visibleElements: {
                selectionTools: {
                  "lasso-selection": false,
                  "rectangle-selection": false,
                },
                undoRedoMenu: false,
              },
              view: view,
              container: "sketchbox",
            });
            sketch.on("create", (event) => {
              clear();
              if (event.state === "complete") {
                sketchGeometry = event.graphic.geometry;
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
            });
            sketch.on("update", (event) => {
              clear();
              if (event.state === "complete") {
                sketchGeometry = event.graphics[0].geometry;
                createBuffer(sketchGeometry);
                bufferGeometry = bufferLayer.graphics.items[0].geometry;
                runQuery();
              }
            });
          }
        )
        .catch((e) => {
          console.log("出现错误" + e.message);
        });
    };
    let getOrder = async () => {
      let Order = await GetOrderList();
      data.PointSet = [];
      data.tableData = Order;
      data.tableData.forEach(async (result, index) => {
        let Point = await GetOrderPointById(result);
        data.PointSet.push(Point[0]);
        /* var jsonstr = JSON.parse(data.PointSet[0].Odetail);
        console.log(jsonstr[0]); */
      });
    };
    onMounted(() => {
      createView();
    });
    return {
      ...toRefs(data),
      getOrder,
      filterTag,
      createView,
      gotoPoint,
    };
  },
  methods: {},
};
</script>

<style scoped>
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#buffermenu {
  width: 450px;
}

#sketchbox {
  padding-bottom: 15px;
}

#createbuffer,
#clearGeometry {
  width: 130px;
}

.count {
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
}
#setOrder {
  position: absolute;
  right: 30px;
}
#naviToClosestF {
  position: absolute;
  right: 30px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
