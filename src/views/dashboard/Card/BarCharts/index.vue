<template>
  <!-- 容器 -->
  <div class="charts-box" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarCharts",
  props: ["data"],
  mounted() {
    this.newBarcharts()
  },
  methods: {
    newBarcharts() {
      // 初始化 echarts 实例
      const lineCharts = echarts.init(this.$refs.charts);
      lineCharts.setOption({
        xAxis: {
          show: false,
          // 均分
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
            type: "bar",
            data: this.data,
          },
        ],
        tooltip: {},
      });
    },
  },
  watch: {
    data() {
      this.newBarcharts()
    }
  }
};
</script>

<style scoped>
.charts-box {
  width: 100%;
  height: 100%;
}
</style>