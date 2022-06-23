<template>
  <div>
    <el-table style="width: 100%" :data="skuList" border>
      <el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width" align="center"></el-table-column>
      <el-table-column label="默认图片" width="120" align="center">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" width="80px" height="80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="120" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" width="120" align="center"></el-table-column>
      <el-table-column label="操作" width="width" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale == 0" @click="cancelSale(row)"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini" v-else @click="onSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message({type:'info', message:'正在开发中....'})"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="showSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSku(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,  ->, sizes ,total"
      :total="total">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%"  :before-close="close" v-loading="loading">
      <el-row>
        <el-col :span="6">名称：</el-col>
        <el-col :span="15">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">描述：</el-col>
        <el-col :span="15">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">价格：</el-col>
        <el-col :span="15">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">平台属性：</el-col>
        <el-col :span="15">
          <template>
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin:5px;">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">商品图片：</el-col>
        <el-col :span="15">
          <el-carousel height="400px" trigger="click">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" width="100%" height="100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 抽屉效果的相关属性
      drawer: false,
      // 是否显示 loading 效果
      loading: false,

      page:1, // 当前第几页
      pageSize:10, // 一页中有多少条数据
      total:0, // 信息总条数
      skuList: [], // sku 列表的数据
      skuInfo: {}, // 展示的 sku 信息
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取 sku 列表数据
    async getSkuList(page = 1) {
      this.page = page
      let result = await this.$API.sku.reqSkuList(this.page, this.pageSize)
      if(result.code == 200) {
        this.total = result.data.total
        this.skuList = result.data.records
      }
    },
    // 分页器相关回调
    handleSizeChange(val){
      this.pageSize = val
      this.getSkuList()
    },
    // 上架的回调
    async onSale(sku){
      let result = await this.$API.sku.reqSkuOnSale(sku.id)
      if(result.code == 200) {
        sku.isSale = 0
        this.$message({type: "success", message: '上架成功'})
      }
    },
    // 下架的回调
    async cancelSale(sku) {
      let result = await this.$API.sku.reqSkuOnSale(sku.id)
      if(result.code == 200) {
        sku.isSale = 1
        this.$message({type: "info", message: '下架成功'})
      }
    },
    // 点击详情按钮的回调
    async showSkuInfo(sku) {
      this.loading = true
      // 展开抽屉
      this.drawer = true
      // 获取 SKU 的数据
      let result = await this.$API.sku.reqSkuById(sku.id)
      if(result.code == 200) {
        this.loading = false
        this.skuInfo = result.data
      }
    },
    // 抽屉关闭前得回调
    close(done) {
      done()
      this.skuInfo = {}
      this.loading = true
    },
    // 删除某个 sku
    async deleteSku(sku) {
      let result = await this.$API.sku.reqDeleteSku(sku.id)
      if(result.code == 200) {
        this.$message({type:'success', message:'删除SKU成功'})
        this.getSkuList()
      }
    }
    },
}
</script>

<style scoped>
.el-row .el-col {
margin: 10px;
}
.el-col-6 {
font-size: 20px;
text-align: right;
font-weight: 600;
}
.el-col-15 {
font-size: 15px;
}

/* 深度选择器 */
/* >>>.el-drawer {
  overflow-y: auto;
}
>>>.el-carousel__button{
  width: 30px;
  height: 5px;
  border-radius: 25%;
  background: rgb(90, 85, 85);
}

>>>.el-carousel__arrow{
  width: 30px;
  height: 60px;
  border-radius: 25%;
}
>>>.el-carousel__arrow:hover{
  background-color: rgba(101, 97, 97, 0.5);
} */

</style>