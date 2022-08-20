<template>
  <div id="list">
    <el-card class="box-card">
      <el-button @click="getOrder">刷新订单</el-button>
      <el-table
        id="odlist"
        :data="tableData"
        style="width: 100%"
        @row-click="getOstate"
        max-height="450"
      >
        <el-table-column prop="Oid" label="订单编号" width="180" />
        <el-table-column prop="Oaddress" label="订单地址" width="250" />
        <el-table-column
          prop="Ostate"
          label="状态"
          width="100"
          :filters="[
            { text: '待处理', value: '待处理' },
            { text: '进行中', value: '进行中' },
            { text: '待分配', value: '待分配' },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
        </el-table-column>
        <el-table-column label="位置">
          <template #default="scope">
            <el-button type="success" @click="getinfo(scope.row)">
              <el-icon>
                <AddLocation />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template #default="scope">
            <el-button type="success" @click="getmoreinfo(scope.row)">
              <el-icon><More /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div id="smallMapView"></div>
    </el-card>
  </div>
  <div class="smallWindow"><div class="opacityZero"></div></div>
  <div id="bigMapView"></div>
  <div id="infoCard" v-show="showbox">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-size: 18px">订单详情</span>
          <el-button type="info" circle @click="close"
            ><el-icon><CircleClose /></el-icon
          ></el-button>
        </div>
      </template>
      <div id="details">
        <el-table :data="orderlist" style="width: 100%">
          <el-table-column prop="photo" label="图片" />
          <el-table-column prop="title" label="物品名" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="num" label="数量" />
        </el-table>
        <span style="font-size: 18px">总价: {{ sum }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import {
  GetOrderPoint,
  GetOrderList,
  GetOrderPointById,
  SetOrder,
} from "@/../api/admin";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
import { AddLocation, Edit, More, CircleClose } from "@element-plus/icons-vue";
import Supply from "@/views/supply/Supply.vue";
import { $EleMsgNotifyError, $EleMsgNotifySuccess } from "@/../utils/alert.js";
import Nprogress from "nprogress";
import { provideGlobalConfig } from "element-plus";
export default {
  name: "Supply",
  components: {
    AddLocation,
    More,
    CircleClose,
  },
  setup() {
    const filterTag = (value, row) => {
      return row.Ostate === value;
    };
    let data = reactive({
      tableData: [],
      orderlist: [],
      Ostate: "",
      Point: [],
      Locationtrigger: false,
      sum: 0,
      showbox: false,
    });
    /* let tableData = []; */
    let getinfo = async (row) => {
      data.Point = await GetOrderPointById(row);
      data.Locationtrigger = true;
    };
    let getmoreinfo = async (row) => {
      data.showbox = true;
      let moreInfo = await GetOrderPointById(row);
      var jsonstr = JSON.parse(moreInfo[0].Odetail);
      data.orderlist = jsonstr.cartList;
      data.sum = jsonstr.total;
    };
    let close = () => {
      data.showbox = false;
    };
    let getOrder = async () => {
      let Order = await GetOrderList();
      data.tableData = Order;
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
          "esri/widgets/Slider",
          "esri/geometry/geometryEngine",
          "esri/layers/RouteLayer",
          "esri/rest/support/PolygonBarrier",
          "esri/rest/support/FeatureSet",
          "esri/widgets/Legend",
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
            Slider,
            geometryEngine,
            RouteLayer,
            PolygonBarrier,
            FeatureSet,
            Legend,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            //地图
            var map = new Map({
              basemap: "topo-vector",
            });
            var view = new MapView({
              container: "smallMapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 16,
            });
            const view2 = new MapView({
              container: "bigMapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
              /* constraints: {
                // Disable zoom snapping to get the best synchronization
                snapToZoom: false,
              }, */
            });
            var orderLayer = new GraphicsLayer();
            view.map.addMany([orderLayer]);
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
            let odlist = document.getElementById("odlist");
            odlist.addEventListener("click", async () => {
              if (data.Locationtrigger == true) {
                addPoint(data.Point);
                AutoQueryFirst(data.Point[0]);
                data.Locationtrigger = false;
              }
            });
            function AutoQueryFirst(order) {
              /* view.goTo(orderLayer.graphics).then(function () { */
              view.zoom = 16;
              view.center = [order.OPlon, order.OPlat];
              view2.center = [order.OPlon, order.OPlat];
            }
            /* let closeBtn = document.getElementById("close");
            closeBtn.addEventListener("click", async () => {
              
            }); */

            const views = [view, view2];
            let active;
            const sync = (source) => {
              if (!active || !active.viewpoint || active !== source) {
                return;
              }
              for (const view of views) {
                if (view !== active) {
                  view.center = active.center;
                }
              }
            };
            for (const view of views) {
              view.watch(["interacting", "animation"], () => {
                active = view;
                sync(active);
              });
              view.watch("viewpoint", () => sync(view));
            }
            view.ui.remove("attribution");
            view2.ui.remove("attribution");
            view2.ui.add([
              {
                component: "infoCard",
                position: "top-right",
                index: 1,
              },
            ]);
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
      ...toRefs(data),
      getOrder,
      filterTag,
      getinfo,
      createView,
      getmoreinfo,
      close,
    };
  },
};
</script>

<style>
#list {
  padding: 0;
  margin: 0;
  height: 100%;
}
#smallMapView {
  padding: 0;
  margin: 20px auto;
  width: 500px;
  height: 400px;
}
#bigMapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
.smallWindow {
  top: 488px;
  left: 562px;
  width: 106px;
  height: 48px;
  position: relative;
  z-index: 999;
  border: 3px solid black;
}
.opacityZero {
  opacity: 0.1;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>