<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(kg)">
      <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
          <el-select  placeholder="请选择" v-model="attr.attrIdAndValueId" style="margin-bottom:10px;">
            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
          <el-select  placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange" border>
        <el-table-column prop="prop" width="120" align="center" type="selection"></el-table-column>
        <el-table-column prop="prop" label="图片" width="width" align="center">
          <template slot-scope="{row,$index}">
            <img :src="row.imgUrl" width="100px" height="100px">
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width" align="center"></el-table-column>
        <el-table-column prop="prop" label="操作" width="width" align="center">
          <template slot-scope="{row,$index}">
            <el-button type="primary" v-show="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
            <el-button type="success" size="mini" v-show="row.isDefault == 1">默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name:'SkuForm',
  data() {
    return {
      // 存储图片数据
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList:[],
      // 平台属性的数据
      attrInfoList: [],
      // 收集 sku 数据
      skuInfo:{
        // 第一类收集的数据: 父组件给的数据
        spuId: 0,
        tmId: 0,
        category3Id: 0,
        // 第二类收集的数据: 需要通过数据双向绑定v-model收集
        price: '',
        weight: "",
        skuName: "",
        skuDesc: "",
        // 第三类收集的数据: 需要自己书写
        skuDefaultImg: "",
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      // 保存从父组件中传递过来的数据
      spu: {},
      // 收集用户选择的图片数据(不完整,缺少isDefault字段,后期处理)
      imgList:[]
    }
  },
  methods: {
    // 获取 SkuForm 的初始数据
    async getSkuData(CategoryId,spu) {
      this.spu = spu
      const { category1Id, category2Id, category3Id } = CategoryId
      // 收集父组件给予的数据
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 获取图片的数据 
      const imageResult = await this.$API.sku.reqSpuImageList(spu.id)
      if (imageResult.code == 200) {
        let list = imageResult.data
        list.forEach(item => {
          item.isDefault = 0
        });
        this.spuImageList = list
      }

      // 获取销售属性的数据
      const saleResult = await this.$API.sku.reqSpuSaleAttrList(spu.id)
      if(saleResult.code == 200) this.spuSaleAttrList = saleResult.data

      // 获取平台属性的数据
      const attrInfoResult = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, category3Id)
      if(attrInfoResult.code == 200) this.attrInfoList = attrInfoResult.data
    },
    // 图片列表复选框的回调
    // val为数组,里面的每一个元素就是对应的勾选中复选框的图片数据
    handleSelectionChange(val) {
      // 获取到用户图片的数据中,不包含 isDefault 字段
      this.imgList = val
    },
    // 设置默认图片的回调(排他)
    changeDefault(row) {
      // 将图片列表中的 isDefault 字段变为 0
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 再将当前图片设为默认图片,并将默认图片的地址收集起来
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 点击保存的回调
    async save() {
      // 整理参数
      // 整理平台属性
      this.attrInfoList.forEach(item=> {
        // 当前平台属性用户进行了选择
        if(item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          let obj = {attrId, valueId}
          this.skuInfo.skuAttrValueList.push(obj)
        }
      })

      // 整理销售属性
      this.spuSaleAttrList.forEach(item => {
        if(item.attrIdAndValueId) {
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
          let obj = {saleAttrId,saleAttrValueId}
          this.skuInfo.skuSaleAttrValueList.push(obj)
        }
      })
      // this.spuSaleAttrList.reduce((prev, item) => {
      //   if(item.attrIdAndValueId) {
      //     const [saleId,saleAttrValueId] = item.attrIdAndValueId.split(':')
      //     prev.push({saleId,saleAttrValueId})
      //   }
      //   return prev
      // },[])

      // 整理图片的数据
      this.skuInfo.skuImageList = this.imgList.map(item =>{
        return {
          spuImgId: item.id,
          isDefault: item.isDefault,
          imgName: item.imgName,
          imgUrl: item.imgUrl
        }
      })
    
      // 发请求
      const result = await this.$API.sku.reqAddSku(this.skuInfo)
      if (result.code == 200) {
        this.$message({type:'success',message:'添加SKU成功'})
        this.cancel()
      }
    },
    // 返回 SPU
    cancel() {
      this.$emit('changeScene', {scene: 0, flag:'添加'})
      Object.assign(this._data, this.$options.data())
    }
    
  },
}
</script>

<style>

</style>