<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="left">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          class="date"
        >
        </el-date-picker>
      </div>
    </div>

    <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <BarCharts :title="title" :list="list"/>
          </el-col>
          <el-col :span="6">
            <article>门店{{title}}排名</article>
            <nav>
              <ul>
                <li v-for="(item,index) in list.orderRank" :key="index">
                  <span :class="{rindex: index < 3}">{{item.no}}</span>
                  <span>{{item.name}}</span>
                  <span>{{item.money}}</span>
                </li>
              </ul>
            </nav>
          </el-col>
        </el-row>
    </div>

  </el-card>
</template>

<script>
import BarCharts from "./BarCharts";
import dayjs from "dayjs";
import {mapState} from "vuex"
export default {
  name: "Sale",
  components: { BarCharts },
  data() {
    return {
      // 收集日历的数据
      date:[],
      activeName: "sale",
    };
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD")
      this.date = [day,day]
    },
    // 本周
    setWeek() {
      // 获取周一的数据
      const mon = dayjs().day(1).format("YYYY-MM-DD")
      const sun = dayjs().day(7).format("YYYY-MM-DD")
      this.date = [mon,sun]
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format("YYYY-MM-DD")
      const end = dayjs().endOf('month').format("YYYY-MM-DD")
      this.date = [start,end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format("YYYY-MM-DD")
      const end = dayjs().endOf('year').format("YYYY-MM-DD")
      this.date = [start,end]
    }
    
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState('home',['list'])
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.clearfix {
  display: flex;
  position: relative;
  justify-content: space-between;
}
.left {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin-right: 20px;
  font-size: 15px;
  color: rgb(118, 117, 117);
}
.right span:hover {
  cursor: pointer;
  color: #409EFF ;
}
.date{
  width: 220px;
}
ul {
  list-style-type: none;
  width: 100%;
  height: 280px;
  padding: 0 10px;
}
ul li {
  height: 11%;
  margin: 12px auto;
}

.rindex {
  color: white;
  background: black;
}
ul li span:nth-child(1) {
  float: left;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  text-align: center;
}
ul li span:nth-child(2) {
  margin: 0 50px;
}
ul li span:last-child {
  float: right;
}
ul li span:hover {
  cursor: pointer;
  color: #409EFF;
}
</style>