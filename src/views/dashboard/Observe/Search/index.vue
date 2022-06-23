<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><LineCharts/></el-col>
        <el-col :span="12"><BarCharts/></el-col>
      </el-row>
      <!-- table 表格 -->
      <el-table :data="tableList" style="width: 100%; margin-top: 20px" border>
        <el-table-column prop="id" label="排名" width="80" align="center"></el-table-column>
        <el-table-column prop="word" label="搜索关键字" align="center"></el-table-column>
        <el-table-column prop="user" label="用户数" sortable align="center"></el-table-column>
        <el-table-column prop="count" label="周涨幅" sortable align="center"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination layout="prev, pager, next" :total="total" :page-size="1" align="right" @current-change="handle"></el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from "./LineCharts";
import BarCharts from "./BarCharts";
import { mapState } from "vuex"
export default {
  name: "Search",
  data() {
    return {
      cunrrPage: 0,
      tableList:[],
      total:0
    }
  },
  components: {
    LineCharts,
    BarCharts
  },
  computed: {
    ...mapState('home',['list']),
  },
  methods: {
    handle(val) {
      this.cunrrPage = val - 1
    }
  },
  watch:{
    list() {
      this.total = this.list.searchWord.length
      this.tableList = [this.list.searchWord[this.cunrrPage]]
    },
    cunrrPage() {
      this.tableList = [this.list.searchWord[this.cunrrPage]]
    }
  }
};
</script>

<style scoped>
.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header {
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(215, 214, 214);
}
</style>