<template>
  <div id="MapView"></div>
  <div id="layerchange"><el-button type="切换">切换</el-button></div>
</template>

<script>
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
          "esri/config",
          "esri/Map",
          "esri/views/MapView",
          "esri/widgets/Home",
          "esri/widgets/ScaleBar",
          "esri/widgets/LayerList",
          "esri/widgets/Legend",
          "esri/widgets/Expand",
          "esri/widgets/Compass",
          "esri/geometry/Extent",
          "esri/layers/MapImageLayer",
          "esri/layers/FeatureLayer",
          "esri/widgets/LayerList/LayerListViewModel",
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
          ScaleBar,
          LayerList,
          Legend,
          Expand,
          Compass,
          Extent,
          MapImageLayer,
          FeatureLayer,
          LayerListViewModel,
          WebTileLayer,
          TileInfo,
          SpatialReference,
        ]) => {
          esriConfig.apiKey =
            "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
          const spatialReference = new SpatialReference({
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
          });
          const view = new MapView({
            container: "MapView",
            map: map,
            center: [104.08, 30.68],
            zoom: 12,
          });

          var cluster1 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_DensityBasedClustering/FeatureServer/0",
            blendMode: "darken",
            title: "活动轨迹聚类",
            visible: true,
          });
          map.add(cluster1);
          var cluster2 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/cluster/FeatureServer/0",
            blendMode: "darken",
            title: "医疗设施点多元聚类",
            visible: false,
          });
          map.add(cluster2);
          var cluster3 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/cluster/FeatureServer/1",
            blendMode: "darken",
            title: "医疗设施点聚类和异常值分析",
            visible: false,
          });
          map.add(cluster3);
          const homeBtn = new Home({
            view: view,
          });
          const layerList = new LayerList({
            view: view,
          });
          let changeLayer = document.getElementById("layerchange");
          changeLayer.addEventListener("click", async () => {
            if (cluster1.visible == true) {
              cluster1.visible = false;
              cluster2.visible = true;
              cluster3.visible = false;
              return;
            }
            if (cluster2.visible == true) {
              cluster1.visible = false;
              cluster2.visible = false;
              cluster3.visible = true;
              return;
            }
            if (cluster3.visible == true) {
              cluster1.visible = true;
              cluster2.visible = false;
              cluster3.visible = false;
              return;
            }
          });
          const legend = new Legend({});
          const layerListExpand = new Expand({
            view: view,
            content: layerList,
            expanded: false,
            expandTooltip: "Expand LayerList",
          });
          const legendExpand = new Expand({
            view: view,
            content: legend,
            expandTooltip: "Expand Legend",
            expanded: true,
          });
          const compass = new Compass({
            view: view,
            visible: false,
          });
          view.ui.add(homeBtn, "top-left");
          view.ui.add(layerListExpand, "top-right");
          view.ui.add(legendExpand, "bottom-left");
          view.ui.add(compass, "top-left");
          view.ui.add([
            {
              component: "layerchange",
              position: "bottom-right",
              index: 1,
            },
          ]);
          /* hospitalscale.when(() => {
            const initialExtent = Extent.fromJSON(
              hospitalscale.sourceJSON.initialExtent
            );
            view.goTo(initialExtent);
          }); */
          // load the Compass only when the view is rotated
          view.watch("rotation", function (rotation) {
            if (rotation && !compass.visible) {
              compass.visible = true;
            }
          });
        }
      );
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
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
