<template>
  <div>
    <!-- inline：代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="getCategory2List" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in Category1List" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="getCategory3List" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in Category2List" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="setCategoryId" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in Category3List" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'CategorySelect',
  props:['show'],
  data() {
    return {
      // 获取一级、二级、三级分类的数据
      Category1List:[],
      Category2List:[],
      Category3List:[],

      // 收集相应的一级、二级、三级分类的 id
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  // 当组件挂载完毕，向服务器发请求，获取相应的一级分类的数据 
  mounted() {
    // 获取一级分类的数据的方法
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List()
      if(result.code == 200) {
        this.Category1List = result.data
      }
    },
    // 一级分类的 select 事件的回调（当一级分类的 option 发生变化的时候获取二级分类的数据）
    async getCategory2List() {
      // 清除二三级的数据以及二三级的 id
      this.Category2List = []
      this.Category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      let result = await this.$API.attr.reqCategory2List(this.cForm.category1Id)
      if(result.code == 200) {
        this.Category2List = result.data
      }
    },
    // 二级分类的 select 事件的回调（当二级分类的 option 发生变化的时候获取三级分类的数据）
    async getCategory3List() {
      // 清除三级的数据以及 id
      this.Category3List = []
      this.cForm.category3Id = ''
      let result = await this.$API.attr.reqCategory3List(this.cForm.category2Id)
      if(result.code == 200) {
        this.Category3List = result.data
      }
    },
    // 二级分类的 select 事件的回调（将来要用）
    setCategoryId() {
      // 在该事件中将各级商品的 id 传递给父组件
      this.$emit('getCategoryId',this.cForm)
    }
  },
};
</script>

<style>
</style>