<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" :count="`￥${list.salesTotal}`">
            <template slot="charts">
              <div style="font-size: 15px; display:flex; justify-content: space-around;">
                <span style="display:flex;">
                <span>月同比&nbsp;&nbsp;{{list.salesGrowthLastMonth}}%</span>
                <svg
                  t="1655200425570"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2222"
                  width="20"
                  height="20"
                >
                  <path
                    d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
                    fill="#d81e06"
                    p-id="2223"
                  ></path>
                </svg>
              </span>
              <span style="display:flex;">
                <span>日同比&nbsp;&nbsp;{{list.salesGrowthLastDay}}%</span>
                <svg
                  t="1655200595441"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3248"
                  width="20"
                  height="20"
                >
                  <path
                    d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
                    fill="#1afa29"
                    p-id="3249"
                  ></path>
                </svg>
              </span>
              </div>
            </template>
            <template slot="footer">
              <span>日销售额 ￥ {{list.salesToday}}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" :count="list.visitTotal">
            <template slot="charts">
              <LineChart/>
            </template>
            <template slot="footer">
              <span>日访问量 {{list.visitToday}}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" :count="list.payTotal">
            <template slot="charts">
              <BarCharts :data="list.payTrend"/>
            </template>
            <template slot="footer">
              <span>转化率 {{list.payRate}}%</span>
            </template>
          </Detail>
          </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" :count="`${list.activityRate}%`">
            <template slot="charts">
              <ProgressCharts/>
            </template>
            <template slot="footer">
              <div style="font-size: 15px; display:flex; justify-content: space-around;">
                <span style="display:flex;">
                <span>月同比&nbsp;&nbsp;{{list.salesGrowthLastMonth}}%</span>
                <svg
                  t="1655200425570"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2222"
                  width="20"
                  height="20"
                >
                  <path
                    d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
                    fill="#d81e06"
                    p-id="2223"
                  ></path>
                </svg>
              </span>
              <span style="display:flex;">
                <span>日同比&nbsp;&nbsp;{{list.salesGrowthLastDay}}%</span>
                <svg
                  t="1655200595441"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3248"
                  width="20"
                  height="20"
                >
                  <path
                    d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
                    fill="#1afa29"
                    p-id="3249"
                  ></path>
                </svg>
              </span>
              </div>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineChart from "./LineChart";
import BarCharts from "./BarCharts";
import ProgressCharts from "./ProgressCharts";
import {mapState} from 'vuex'
export default {
  name: "Card",
  components: {
    Detail,
    LineChart,
    BarCharts,
    ProgressCharts
  },
  computed: {
    ...mapState('home',['list'])
  }
};
</script>
