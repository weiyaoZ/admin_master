<template>
  <!-- 容器 -->
  <div class="charts-box" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: { show: false },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          type: "line",
          data: [20, 18, 33, 30, 25, 23, 45, 30, 43],
          // 拐点样式的设置
          itemStyle: {
            opacity: 0,
          },
          // 线条样式
          lineStyle: {
            color: "purple",
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth: true
        },
      ],
      tooltip:{}
    })
  },
};
</script>

<style scoped>
.charts-box {
  width: 100%;
  height: 100%;
}
</style>