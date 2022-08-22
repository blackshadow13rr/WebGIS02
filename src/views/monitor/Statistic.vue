<template>
  <div id="Container">
    <el-card class="box-card">
      <div
        id="barbox"
        ref="chart"
        style="margin: 10px 40px; width: 500px; height: 350px"
      ></div></el-card
    ><el-card class="box-card">
      <div
        id="thebox"
        ref="chart"
        style="margin: 10px 40px; width: 400px; height: 400px"
      ></div></el-card
    ><el-card class="box-card" >
      <div
        id="radiobox"
        ref="chart"
        style="margin: 10px 40px; width: 500px; height: 400px"
      ></div></el-card
    ><el-card class="box-card" style="height: 550px; ">
      <div
        id="3driskbox"
        ref="chart"
        style="margin: 10px 40px; width: 800px; height: 600px"
      ></div></el-card
    ><el-card class="box-card" style="height: 550px; ">
      <div
        id="sandianbox"
        ref="chart"
        style="margin: 10px 40px; width: 700px; height: 550px"
      ></div
    ></el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
export default {
  name: "Statistic",
  setup() {
    let data = reactive({});
    let set3driskchart = () => {
      var myChart = echarts.init(document.getElementById("3driskbox"));
      var myChart2 = echarts.init(document.getElementById("barbox"));
      var myChart3 = echarts.init(document.getElementById("thebox"));
      var myChart4 = echarts.init(document.getElementById("radiobox"));
      var myChart5 = echarts.init(document.getElementById("sandianbox"));
      var option;
      var option2;
      var option3;
      var option4;
      var option5;
      // prettier-ignore
      const hours = [
 '7/24','7/25','7/26','7/27','7/28','7/29','7/30','7/31','8/1','8/2',
      ];
      // prettier-ignore
      const days = [
    '成华区', '金牛区', '锦江区',
    '龙泉驿区', '青羊区', '天府新区', '武侯区',"新都区"
      ];
      // prettier-ignore
      const data = [[0,0,8],[1,0,2],[2,0,1],[3,0,23],[4,0,5],[5,0,0],[6,0,3],[7,0,2],[0,1,15],[1,1,5],[2,1,1],[3,1,23],[4,1,5],[5,1,0],[6,1,2],[7,1,5],[0,2,28],[1,2,7],[2,2,1],[3,2,19],[4,2,2],[5,2,0],[6,2,1],[7,2,5],[0,3,35],[1,3,7],[2,3,1],[3,3,16],[4,3,2],[5,3,1],[6,3,1],[7,3,6],[0,4,46],[1,4,7],[2,4,1],[3,4,8],[4,4,2],[5,4,1],[6,4,1],[7,4,6],[0,5,47],[1,5,8],[2,5,1],[3,5,8],[4,5,3],[5,5,1],[6,5,0],[7,5,6],[0,6,44],[1,6,8],[2,6,0],[3,6,3],[4,6,1],[5,6,1],[6,6,0],[7,6,5],[0,7,41],[1,7,4],[2,7,0],[3,7,2],[4,7,1],[5,7,1],[6,7,0],[7,7,2],[0,8,40],[1,8,1],[2,8,0],[3,8,0],[4,8,1],[5,8,1],[6,8,0],[7,8,2],[0,9,35],[1,9,1],[2,9,0],[3,9,0],[4,9,1],[5,9,1],[6,9,0],[7,9,0]]  .map(function (item) {
    return [item[1], item[0], item[2] || '-'];
      });
      option = {
        title: { text: "高风险地区时空分布", left: "center", top: "2%" },
        tooltip: {
          position: "top",
        },
        grid: {
          height: "50%",
          top: "10%",
        },
        xAxis: {
          type: "category",
          data: hours,
          splitArea: {
            show: true,
          },
        },
        yAxis: {
          type: "category",
          data: days,
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "20%",
        },
        series: [
          {
            name: "Punch Card",
            type: "heatmap",
            data: data,
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option2 = {
        title: {
          text: "高风险地区时空分布",
          left: "center",
          bottom: "85%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: [
            "7月24日",
            "7月25日",
            "7月26日",
            "7月27日",
            "7月28日",
            "7月29日",
            "7月30日",
            "7月31日",
            "8月1日",
            "8月2日",
          ],
        },
        series: [
          {
            name: "金牛区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [2, 5, 7, 7, 7, 8, 8, 4, 1, 1],
          },
          {
            name: "锦江区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
          },
          {
            name: "龙泉驿区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [23, 23, 19, 16, 8, 8, 3, 2, 0, 0],
          },
          {
            name: "青羊区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [5, 5, 2, 2, 2, 3, 1, 1, 1, 1],
          },
          {
            name: "成华区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [8, 15, 28, 35, 46, 47, 44, 41, 40, 35],
          },

          {
            name: "天府新区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
          },
          {
            name: "武侯区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [3, 2, 1, 1, 1, 0, 0, 0, 0, 0],
          },

          {
            name: "新都区",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [2, 5, 5, 6, 6, 6, 5, 2, 2, 0],
          },
        ],
      };
      option3 = {
        title: {
          text: "成都医院等级分布",
          subtext: "2021年",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          top: "bottom",
          data: [
            "三甲医院",
            "三乙医院",
            "三级未定等医院",
            "二甲医院",
            "二乙医院",
            "二级未定等医院",
            "一级及未定级机构",
          ],
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Area Mode",
            type: "pie",
            radius: [20, 140],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 5,
            },
            data: [
              { value: 71, name: "二级未定等医院" },
              { value: 59, name: "二甲医院" },
              { value: 39, name: "三甲医院" },
              { value: 36, name: "三乙医院" },
              { value: 34, name: "二乙医院" },
              { value: 16, name: "三级未定等医院" },
            ],
          },
        ],
      };
      option4 = {
        title: {
          text: "公立与民营医院统计信息",
          left: "center",
        },
        legend: {
          data: ["公立医院", "民营医院"],
          left: "10%",
          top: "10%",
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: "机构个数（个）", max: 2000 },
            { name: "床位数（个）", max: 350000 },
            { name: "卫生技术人员数（万人）", max: 31 },
            { name: "医师日均诊疗人次（人）", max: 9 },
            { name: "病床使用率（%）", max: 100 },
            { name: "出院者平均住院日（天）", max: 12 },
          ],
        },
        series: [
          {
            name: "Budget vs spending",
            type: "radar",
            data: [
              {
                value: [684, 324019, 30.39, 7.73, 90.04, 10.13],
                name: "公立医院",
              },
              {
                value: [1797, 173512, 11.19, 4.41, 66.89, 11.38],
                name: "民营医院",
              },
            ],
          },
        ],
      };
      // prettier-ignore
      const femaleData = [[104.081849,30.577431],[104.110246,30.650325],[104.02887,30.68628],[104.089418,30.675922],[103.976723,30.682857],[104.051146,30.670038],[103.943556,30.588934],[104.072747,30.578994],[104.032716,30.698623],[104.108113,30.690623],[103.934178,30.281952],[104.08474,30.647946],[104.000568,30.649534],[104.188478,30.700929],[103.901948,30.414543],[104.119692,30.681765],[104.129858,30.677772],[104.107937,30.684818],[104.072747,30.578994],[104.117787,30.681061],[104.16679,30.681078],[104.124559,30.684687],[104.124599,30.686426],[104.124828,30.68634],[104.144061,30.690456],[104.317855,30.624657],[104.247969,30.585034],[104.25603,30.64943],[104.277956,30.576384],[104.177739,30.575796],[104.170264,30.654681],[104.251549,30.54035],[104.266205,30.581409],[104.199565,30.572273],[104.072747,30.578994],[104.285526,30.575347],[104.284385,30.561008],[104.260449,30.544333],[104.23515,30.540803],[104.268262,30.579167],[104.27955,30.577039],[104.274782,30.554653],[104.254296,30.575098],[104.072747,30.578994],[103.989851,30.583156],[104.274292,30.561868],[104.072747,30.578994],[104.178976,30.788228],[104.095906,30.760539],[103.801352,30.693225],[103.801352,30.693225],[103.801352,30.693225],[104.461449,30.854767],[104.110246,30.650325],[104.089699,30.676018],[103.976723,30.682857]]
      // prettier-ignore
      const maleDeta = [[104.061316,30.579753],[104.099934,30.642355],[104.110148,30.643579],[104.089207,30.657471],[104.100699,30.6465],[104.079933,30.655894],[104.110246,30.650325],[104.029549,30.686754],[104.029214,30.68435],[104.027413,30.661739],[104.088774,30.675719],[104.038579,30.706459],[104.108113,30.690623],[103.934178,30.281952],[104.094202,30.681341],[104.08474,30.647946],[104.095836,30.64401],[104.05105,30.644374],[104.08883,30.647991],[104.066286,30.636373],[104.174493,30.704654],[104.122183,30.667937],[104.126112,30.685619],[104.129858,30.677772],[104.16679,30.681078],[104.317855,30.624657],[104.315978,30.349886],[104.266205,30.581409],[104.285526,30.575347],[104.072747,30.578994],[104.278519,30.665456],[104.242433,30.57755],[104.163706,30.623867],[104.273604,30.560545],[104.072747,30.578994],[104.200651,30.58458],[104.178976,30.788228],[104.075853,30.778177],[104.09612,30.761005],[103.801352,30.693225],[104.0843,30.58066],[104.110761,30.651489],[104.051858,30.669111],[104.02887,30.68628],[104.088774,30.675719],[104.108113,30.690623],[104.11782,30.764822],[104.122689,30.777426],[104.125138,30.77115],[104.049369,30.710902],[104.084542,30.648421],[104.066286,30.636373],[104.16679,30.681078],[104.122969,30.686418],[104.170264,30.654681],[104.206531,30.591568],[104.266205,30.581409],[104.285526,30.575347],[104.27955,30.577039],[104.26692,30.570195],[104.159544,30.623333],[104.273604,30.560545],[104.297344,30.687643],[104.317855,30.624657],[104.247969,30.585034],[104.256098,30.649252],[104.277956,30.576384]]
      const scatterOption = (option5 = {
        title: {
          text: "活动轨迹点时空分布",
          left: "center",
          bottom: "90%",
        },
        xAxis: {
          scale: true,
        },
        yAxis: {
          scale: true,
        },
        series: [
          {
            type: "scatter",
            id: "高风险",
            dataGroupId: "高风险",
            universalTransition: {
              enabled: true,
              delay: function (idx, count) {
                return Math.random() * 400;
              },
            },
            data: femaleData,
          },
          {
            type: "scatter",
            id: "中风险",
            dataGroupId: "中风险",
            universalTransition: {
              enabled: true,
              delay: function (idx, count) {
                return Math.random() * 400;
              },
            },
            data: maleDeta,
          },
        ],
      });
      const barOption = {
        xAxis: {
          type: "category",
          data: ["高风险", "中风险"],
        },
        yAxis: {},
        series: [
          {
            name: "高风险",
            type: "bar",
            id: "total",
            data: [
              {
                value: 56,
                groupId: "高风险",
              },
              {
                value: 67,
                groupId: "中风险",
              },
            ],
            universalTransition: {
              enabled: true,
              seriesKey: ["高风险", "中风险"],
              delay: function (idx, count) {
                return Math.random() * 400;
              },
            },
          },
        ],
      };
      let currentOption = scatterOption;
      setInterval(function () {
        currentOption =
          currentOption === scatterOption ? barOption : scatterOption;
        myChart5.setOption(currentOption, true);
      }, 2000);
      myChart.setOption(option);
      myChart2.setOption(option2);
      myChart3.setOption(option3);
      myChart4.setOption(option4);
      myChart5.setOption(option5);
    };
    onMounted(() => {
      set3driskchart();
    });
    return {
      set3driskchart,
    };
  },
};
</script>

<style scoped>
#Container {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  /* .3driskbox {
    width: 700px;
    height: 700px;
  } */
}
</style>