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
        <el-table
          :data="vlist"
          style="width: 100%"
          max-height="220"
          highlight-current-row
          @row-click="getvtrigger"
          id="vlist"
        >
          <el-table-column prop="RUuser" label="姓名" width="120" />
          <el-table-column prop="Raddress" label="当前位置" width="300" />
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
import { color } from "echarts";
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
      vtrigger: false,
      selectedvolunteer: [],
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
    let getvtrigger = (row) => {
      data.selectedvolunteer = row;
      data.vtrigger = true;
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
          "esri/widgets/Legend",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/geometry/SpatialReference",
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
          Legend,
          WebTileLayer,
          TileInfo,
          SpatialReference,
        ]) => {
          esriConfig.apiKey =
            "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
          /* const spatialReference = new SpatialReference({
            wkid: 4326,
          });
          const tileInfo = new TileInfo({
            dpi: 90.71428571428571,
            lods: [
              {
                level: 0,
                levelValue: "1",
                scale: 295828763.79585470937713011037,
                resolution: 0.703125,
              },
              {
                level: 1,
                levelValue: "2",
                scale: 147914381.89792735468856505518,
                resolution: 0.3515625,
              },
              {
                level: 2,
                levelValue: "3",
                scale: 73957190.948963677344282527592,
                resolution: 0.17578125,
              },
              {
                level: 3,
                levelValue: "4",
                scale: 36978595.474481838672141263796,
                resolution: 0.087890625,
              },
              {
                level: 4,
                levelValue: "5",
                scale: 18489297.737240919336070631898,
                resolution: 0.0439453125,
              },
              {
                level: 5,
                levelValue: "6",
                scale: 9244648.868620459668035315949,
                resolution: 0.02197265625,
              },
              {
                level: 6,
                levelValue: "7",
                scale: 4622324.4343102298340176579745,
                resolution: 0.010986328125,
              },
              {
                level: 7,
                levelValue: "8",
                scale: 2311162.2171551149170088289872,
                resolution: 0.0054931640625,
              },
              {
                level: 8,
                levelValue: "9",
                scale: 1155581.1085775574585044144937,
                resolution: 0.00274658203125,
              },
              {
                level: 9,
                levelValue: "10",
                scale: 577790.55428877872925220724681,
                resolution: 0.001373291015625,
              },
              {
                level: 10,
                levelValue: "11",
                scale: 288895.2771443893646261036234,
                resolution: 0.0006866455078125,
              },
              {
                level: 11,
                levelValue: "12",
                scale: 144447.63857219468231305181171,
                resolution: 0.00034332275390625,
              },
              {
                level: 12,
                levelValue: "13",
                scale: 72223.819286097341156525905853,
                resolution: 0.000171661376953125,
              },
              {
                level: 13,
                levelValue: "14",
                scale: 36111.909643048670578262952926,
                resolution: 0.0000858306884765625,
              },
              {
                level: 14,
                levelValue: "15",
                scale: 18055.954821524335289131476463,
                resolution: 0.00004291534423828125,
              },
              {
                level: 15,
                levelValue: "16",
                scale: 9027.977410762167644565738231,
                resolution: 0.000021457672119140625,
              },
              {
                level: 16,
                levelValue: "17",
                scale: 4513.9887053810838222828691158,
                resolution: 0.0000107288360595703125,
              },
              {
                level: 17,
                levelValue: "18",
                scale: 2256.9943526905419111414345579,
                resolution: 0.00000536441802978515625,
              },
              {
                level: 18,
                levelValue: "19",
                scale: 1128.4971763452709555707172788,
                resolution: 0.000002682209014892578125,
              },
            ],
            size: [256, 256],
            origin: {
              x: -180,
              y: 90,
            },
            spatialReference,
          });
          var webTileLayer = new WebTileLayer({
            urlTemplate:
              "http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=880502c1a7714a64a3ec29b7e24ebf0e",
            tileInfo,
            spatialReference,
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
          });
          const map = new Map({
            basemap: {
              baseLayers: [webTileLayer],
            },
          }); */
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
          let volunteergeometryname = null;
          let supplygeometry = null;
          let ordergeometryname = null;
          let supplygeometryname = null;

          //路径模块
          const polygonBarriers = [];
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
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_riskBarrierPolygons/FeatureServer/0",
            title: "中高风险地区",
          });
          map.add(highriskLayer);
          var Bighospital1 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/bighos/FeatureServer/1",
            title: "医院",
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
                name: volunteergeometryname,
                geometry: volunteergeometry,
              }),
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
          let setvlist = document.getElementById("vlist");
          setvlist.addEventListener("click", async () => {
            if (data.vtrigger === true) {
              console.log(data.selectedvolunteer.id);
              view.center = [
                data.selectedvolunteer.Rlon,
                data.selectedvolunteer.Rlat,
              ];
              let id = data.selectedvolunteer.id - 1;
              console.log(volunteerLayer.graphics.items[id].geometry);
              volunteergeometry = volunteerLayer.graphics.items[id].geometry;
              volunteergeometryname =
                volunteerLayer.graphics.items[id].attributes.Raddress;
              data.vtrigger = false;
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
          view.ui.add(
            new Legend({
              view: view,
            }),
            "bottom-right"
          );
        }
      );
    };
    onMounted(() => {
      createView();
    });
    return {
      ...toRefs(data),
      filterTag,
      createView,
      gotoPoint,
      gotoHosPoint,
      getvtrigger,
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