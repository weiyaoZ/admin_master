<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0" />
    </el-card>
    <el-card>
      <!-- 将来有三部分在进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示 SPU 列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!spuList.length" style="margin-bottom:20px;" @click="addSpu">添加&nbsp;SPU</el-button>
        <el-table style="width: 100%" :data="spuList" border >
          <el-table-column type="index" label="序号" width="130" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width" align="center"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width" align="center"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{ row, $index }">
              <el-tooltip class="item" effect="light" content="添加sku" placement="bottom">
                <el-button type="success" icon="el-icon-plus" size="mini" @click="addSku(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="修改spu" placement="bottom">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="UpdateSpu(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="查看当前spu全部sku" placement="bottom">
                <el-button type="info" icon="el-icon-info" size="mini" @click="showSkuList(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除spu" placement="bottom" style="margin-left:10px;">
                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' icon="el-icon-info" icon-color="red" title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                  <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="pageSize"
          layout="prev, pager, next, jumper, ->, sizes, total "
          :total="total"
          style="margin-top:20px;"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"/>
      <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="sku"/>
    </el-card>

  <!-- 对话框,展示 sku 数据列表 -->
    <el-dialog :title="`${spu.spuName}的 SKU 列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" v-loading="loading" border>
        <el-table-column prop="skuName" label="名称" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" align="center"></el-table-column>
        <el-table-column prop="weight" label="重量" align="center"></el-table-column>
        <el-table-column label="默认图片" align="center">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" width="100px" height="100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  components: {SpuForm, SkuForm},
  data() {
    return {
      // 显示 loading 效果
      loading: true,
      // 声明一个变量来接收spu中的某一项
      spu:{},
      // 当前 spu 的 sku 数据列表
      skuList: [],
      // 控制 sku 对话框的显示与隐藏
      dialogTableVisible: false,
      spuList: [], // spu 列表的数据
      // 各级分类的 id
      CategoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      page: 1, // 当前页数
      pageSize: 3, // 每一页展示的数据
      total: 0, // 总共有多少条数据
      scene: 0 // 0代表战术 spu 数据列表  1代表添加或修改 spu  2代表添加 sku 
    };
  },
  methods: {
    // 自定义事件的回调，获取到包含各级商品的 id 的对象
    getCategoryId(CategoryId) {
      // 使添加属性按钮可以使用
      Object.assign(this.CategoryId, CategoryId);
      this.getSpuList();
    },
    // 获取 Spu 列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, pageSize, CategoryId } = this
      // 携带三个参数：page 第几页  pageSize：每一个展示多少条数据  三级分类id
      let result = await this.$API.spu.reqSpuInfoList(page, pageSize, CategoryId.category3Id)
      if (result.code == 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 自定义事件，子组件点击取消的时候显示 spu 数据列表
    changeScene({scene,flag}) {
      this.scene = scene
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 分页器的回调函数
    handleSizeChange(val) {
      this.pageSize = val
      this.getSpuList()
    },
    // 点击添加 spu 的回调
    addSpu(){
      this.scene = 1
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.CategoryId.category3Id)
    },
    // 点击添加修改 spu 的回调
    UpdateSpu(row) {
      this.scene = 1
      this.$refs.spu.getSpuData(row)
    },
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({type: 'success ', message: '删除SPU成功'})
        // 如果当前页数据大于 1 ，停留在当前页，否则跳到前一页
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)
      }
    },
    addSku(row) {
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求----三个请求
      this.$refs.sku.getSkuData(this.CategoryId, row)
    },
    // 点击显示当前 spu 的 sku
    async showSkuList(row) {
      // 点击按钮显示 sku 对象框
      this.dialogTableVisible = true
      // 保存当前 spu 的信息
      this.spu = row
      // 获取 sku 列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code == 200) {
        this.skuList = result.data
        // loading 效果隐藏
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      // 清除 skuList 列表的数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  },
}
</script>
