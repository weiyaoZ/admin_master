<template>
  <div class="barChsrts" ref="barCharts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "SaleCharts",
  data() {
    return {
      myCharts: null,
    };
  },
  props: ["title", "list"],
  mounted() {
    this.newEcharts();
  },
  methods: {
    newEcharts() {
      // 初始化 echarts 实例
      this.myCharts = echarts.init(this.$refs.barCharts);
      this.myCharts.setOption({
        title: {
          text: `${this.title}趋势`,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.list.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "50%",
            data: this.list.orderFullYear,
          },
        ],
      });
    },
  },
  watch: {
    title() {
      return this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.list.orderFullYearAxis
              : this.list.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "50%",
            data:
              this.title == "销售额"
                ? this.list.orderFullYear
                : this.list.userFullYear,
          },
        ],
      });
    },
    list() {
      this.newEcharts()
    },
  },
};
</script>

<style scoped>
.barChsrts {
  width: 100%;
  height: 320px;
}
</style>