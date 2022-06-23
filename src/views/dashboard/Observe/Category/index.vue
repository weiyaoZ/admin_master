<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    // 初始化 echarts 实例
    const pieCharts = echarts.init(this.$refs.charts);
    pieCharts.setOption({
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          // avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          data: [
            { value: 1048, name: "Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    pieCharts.on("mouseover", (params) => {
      // 获取鼠标衣移上去那条数据
      const { name, value } = params.data;
      pieCharts.setOption({
        title: {
          left: "center",
          top: "center",
          text: name,
          textStyle: {
            fontSize: 15
          },
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header {
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(215, 214, 214);
}
.charts {
  width: 100%;
  height: 300px;
}
</style>