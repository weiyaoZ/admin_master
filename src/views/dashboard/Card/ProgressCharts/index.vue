<template>
  <!-- 容器 -->
  <div class="charts-box" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        // 均分
        type: "category",
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          barWidth: 15,
          // 背景颜色的设置
          // 要显示背景，必须将 showBackground 设为true
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          label: {
            // 是否显示文本
            show: true,
            // 文本的内容
            formatter: "|",
            // 文本的位置
            position: "right",
            // 文本的颜色
            color: "green",
          },
        },
      ],
    });
  },
};
</script>

<style scoped>
.charts-box {
  width: 100%;
  height: 100%;
}
</style>