<template>
  <div id="MapView"></div>
  <el-card class="box-card" id="orderlist" style="width: 750px">
    <el-tabs
      tab-position="left"
      v-model="activeName"
      style="height: 260px"
      class="demo-tabs"
      stretch
    >
      <el-tab-pane label="接送列表" name="odlist" id="odlist">
        <el-button id="getOrder"
          >刷新列表<el-icon> <AddLocation /> </el-icon
        ></el-button>
        <el-table
          highlight-current-row
          :data="tableData"
          style="width: 100%"
          @row-click="gotoPoint"
          max-height="220"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="Oid" label="请求编号" width="170" />
          <el-table-column prop="Oaddress" label="请求地址" width="245" />
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
      <el-tab-pane label="医院列表" name="second" :disabled="tabtwo">
        <div class="count">
          符合需求医院数量:
          <div class="count" id="count">0</div>
        </div>
        <el-button type="primary" id="confirmBtn" color="#5F9EA0"
          >确定选择</el-button
        >
        <el-divider style="margin: 24px 0 0 0" />
        <el-table
          :data="hoslist"
          style="width: 100%"
          max-height="200"
          highlight-current-row
          @row-click="gotoHosPoint"
          id="hoslist"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="180" />
          <el-table-column prop="name" label="医院名" width="180" />
          <el-table-column prop="等级" label="医院等级" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="志愿者列表" name="third" :disabled="tabthree"
        ><div class="count">
          可调配志愿者人数:
          <div class="count" id="count">6</div>
        </div>
        <el-button type="primary" id="setOrder" color="#5F9EA0"
          >分配订单</el-button
        >
        <el-divider style="margin: 24px 0 0 0" />
        <el-table :data="vlist" style="width: 100%" max-height="220">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="RUuser" label="姓名" width="110" />
          <el-table-column prop="Raddress" label="当前位置" width="250" />
          <el-table-column prop="RphoneNum" label="电话" /> </el-table
      ></el-tab-pane>
    </el-tabs>
  </el-card>
  <div id="routeBox" style="display: none">
    <div>
      <el-button type="success" round id="getroute" color="#5F9EA0"
        >生成路径</el-button
      >
      <el-button type="success" round id="finish" color="#5F9EA0"
        >完成调度</el-button
      >
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import {
  GetHosList,
  GetHosPointById,
  SetHosOrder,
  Getvolunteer,
} from "@/../api/admin";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
import { AddLocation, Edit } from "@element-plus/icons-vue";
import Supply from "@/views/supply/Supply.vue";
import { $EleMsgNotifyError, $EleMsgNotifySuccess } from "@/../utils/alert.js";
import Nprogress from "nprogress";
export default {
  components: {
    Supply,
    AddLocation,
    Edit,
  },
  setup() {
    const filterTag = (value, row) => {
      return row.Ostate === value;
    };
    let data = reactive({
      tableData: [],
      hoslist: [],
      Ostate: "",
      Oid: "",
      PointSet: [],
      tempPoint: [],
      trigger: false,
      hostrigger: false,
      vlist: [],
      activeName: "odlist",
      tabtwo: true,
      tabthree: true,
      hosname: "",
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
    let gotoHosPoint = (row) => {
      data.hosname = row.name;
      data.hostrigger = true;
    };
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
      ).then(
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
          const map = new Map({
            basemap: "topo-vector",
          });

          const view = new MapView({
            container: "MapView",
            map: map,
            center: [104.08, 30.68],
            zoom: 12,
          });
          var orderLayer = new GraphicsLayer();
          var volunteerLayer = new GraphicsLayer();
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
                name: "医院位置",
                geometry: ordergeometry,
              }),
              new Stop({
                name: "终点",
                geometry: supplygeometry,
              }),
            ],
            polygonBarriers,
          });
          //分别添加图层
          var highriskLayer = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991Facilities/FeatureServer/7",
          });
          map.add(highriskLayer);
          var Bighospital1 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/bighos/FeatureServer/0",
          });
          map.add(Bighospital1);
          view.map.addMany([orderLayer, routeLayer, volunteerLayer]);
          //清空按钮
          function clear() {
            /* sketchGeometry = null; */
            if (highlightHandle) {
              highlightHandle.remove();
              highlightHandle = null;
            }
            document.getElementById("count").innerHTML = 0;
          }
          let getvlist = async () => {
            let volunteer = await Getvolunteer();
            console.log(volunteer);
            data.vlist = volunteer;
            addvPoint(volunteer);
          };
          /* const clearGeometryBtn = document.getElementById("clearGeometry");
          clearGeometryBtn.addEventListener("click", () => {
            clear();
          }); */
          //完成订单
          let finishBtn = document.getElementById("finish");
          finishBtn.addEventListener("click", async () => {
            $EleMsgNotifySuccess("完成规划");
          });
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
          //分配订单按钮
          let setOrder = document.getElementById("setOrder");
          setOrder.addEventListener("click", async () => {
            orderdata.Odestination = supplygeometryname;
            orderdata.Oid = orderLayer.graphics.items[itemindex].attributes.Oid;
            orderdata.ODlon = supplygeometry.longitude;
            orderdata.ODlat = supplygeometry.latitude;
            sendOrder();
            let routeBox = document.getElementById("routeBox");
            routeBox.style.display = "block";
          });
          let sendOrder = async () => {
            let status = await SetHosOrder(orderdata);
            if (status) {
              $EleMsgNotifySuccess("已分配给志愿者");
            } else {
              $EleMsgNotifyError("分配失败，请重新设置");
            }
          };
          var clickgetorderlist = async () => {
            let Order = await GetHosList();
            data.PointSet = [];
            data.tableData = Order;
            data.tableData.forEach(async (result, index) => {
              let Point = await GetHosPointById(result);
              data.PointSet.push(Point[0]);
              /* var jsonstr = JSON.parse(data.PointSet[0].Odetail);
        console.log(jsonstr[0]); */
            });
          };
          clickgetorderlist();
          //刷新订单
          let locationBtn = document.getElementById("getOrder");
          locationBtn.addEventListener("click", async () => {
            view.popup.close();
            clickgetorderlist();
            clear();
            addPoint(data.PointSet);
          });
          //当前选中点索引
          let itemindex = 0;
          //点击列表事件
          let odlist = document.getElementById("odlist");
          odlist.addEventListener("click", async () => {
            if (data.trigger === true) {
              data.tempPoint = await GetHosPointById(data);
              orderLayer.graphics.items.forEach((result, index) => {
                if (
                  orderLayer.graphics.items[index].attributes.Oid === data.Oid
                ) {
                  itemindex = index;
                }
              });
              ordergeometry = orderLayer.graphics.items[itemindex].geometry;
              ordergeometryname =
                orderLayer.graphics.items[itemindex].attributes.Oaddress;
              var jsonstr = JSON.parse(data.tempPoint[0].Oparams);
              AutoQueryFirst(data.tempPoint[0]);
              /* data.tabtwo = false; */
              data.tabtwo = false;
              data.activeName = "second";
              runQuery(data.tempPoint[0]);
              data.trigger = false;
            }
          });

          let sethoslist = document.getElementById("hoslist");
          sethoslist.addEventListener("click", async () => {
            if (data.hostrigger === true) {
              const query = Bighospital1.createQuery();
              query.returnGeometry = true;
              Bighospital1.queryFeatures(query).then(function (response) {
                let Point = null;
                response.features.forEach((element) => {
                  if (element.attributes.name == data.hosname) {
                    supplygeometryname = element.attributes.name;
                    supplygeometry = element.geometry;
                  }
                });
                view.popup.close();
                view.center = [
                  supplygeometry.longitude,
                  supplygeometry.latitude,
                ];
              });
              data.hostrigger = false;
            }
          });
          //确定选择医院
          let confirmBtn = document.getElementById("confirmBtn");
          confirmBtn.addEventListener("click", async () => {
            data.tabthree = false;
            data.activeName = "third";
            getvlist();
          });
          //订单绘制点
          let addPoint = (PointSet) => {
            orderLayer.removeAll();
            if (PointSet !== []) {
              PointSet.forEach((result, index) => {
                createPoint(
                  PointSet[index].OPlon,
                  PointSet[index].OPlat,
                  PointSet[index]
                );
              });
            } else {
              console.log("No order!");
            }
          };
          let addvPoint = (PointSet) => {
            orderLayer.removeAll();
            if (PointSet !== []) {
              PointSet.forEach((result, index) => {
                createvPoint(
                  PointSet[index].Rlon,
                  PointSet[index].Rlat,
                  PointSet[index]
                );
              });
            } else {
              console.log("No order!");
            }
          };
          let createvPoint = (lon, lat, data) => {
            var point = new Point({
              latitude: lat,
              longitude: lon,
              spatialReference: view.spatialReference,
            });
            var simpleMarkerSymbol = new SimpleMarkerSymbol({
              style: "diamond",
              color: "green",
              size: "8px",
              outline: {
                width: 1,
              },
            });
            var graphic = new Graphic(point, simpleMarkerSymbol);
            graphic.attributes = data;
            volunteerLayer.graphics.add(graphic);
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
            var jsonstr = JSON.parse(order.Oparams);
            view.popup.open({
              title: "调度请求",
              content:
                "<ul>" +
                "<li> 请求编号: " +
                order.Oid +
                "</li>" +
                "<li> 请求地址: " +
                order.Oaddress +
                "</li>" +
                "<li> 任务状态: " +
                order.Ostate +
                "</li>" +
                "<li> 用户名: " +
                order.Ouser +
                "</li>" +
                "<li> 详情: " +
                "</li>" +
                "<li>是否诊断为新冠肺炎病例或无症状感染者：" +
                jsonstr.isDiagnosed +
                "</li>" +
                "<li>" +
                jsonstr.isLocatedInEpidemicArea +
                "</li>" +
                "<li>" +
                jsonstr.hasCloseContact +
                "</li>" +
                "<li>近7天是否有疑似感染症状: " +
                jsonstr.hasSymptomatic +
                "</li>" +
                "</ul>",
              location: [order.OPlon, order.OPlat],
            });
          }

          //查询功能
          function runQuery(tempdata) {
            Nprogress.start();
            var jsonstr = JSON.parse(tempdata.Oparams);
            const query = Bighospital1.createQuery();
            query.outFields = ["address", "name", "等级"];
            query.returnGeometry = true;
            if (jsonstr.isDiagnosed == "已确诊") {
              query.where = "是否为新冠确诊定点救治医院 = '是'";
            } else if (jsonstr.hasSymptomatic == "是") {
              query.where = "是否为疑似病例救治医院 = '是'";
            } else {
              query.where = "";
            }
            Bighospital1.queryFeatures(query).then(function (response) {
              allStats = response.features;
              let dataset = [];
              if (allStats) {
                Nprogress.done();
                document.getElementById("count").innerHTML = allStats.length;
                allStats.forEach((result, index) => {
                  const attributes = result.attributes;
                  dataset.push(attributes);
                });
                data.hoslist = dataset;
              } else {
                console.log("find nothing");
              }
            });
            view.whenLayerView(Bighospital1).then(function (layerView) {
              Bighospital1.queryObjectIds(query).then((ids) => {
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
              position: "bottom-left",
              index: 1,
            },
            {
              component: "routeBox",
              position: "top-right",
              index: 1,
            },
          ]);
        }
      );
    };
    onMounted(() => {
      createView();
    });
    return { ...toRefs(data), filterTag, createView, gotoPoint, gotoHosPoint };
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
#confirmBtn {
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