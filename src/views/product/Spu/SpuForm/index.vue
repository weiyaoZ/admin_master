<template>
  <el-form ref="form" label-width="80px" :model="spuInfo">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option v-for="tm in tradeMarkList" :label="tm.tmName" :value="tm.id" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 
        上传图片：action 图片上传的地址 list-type：文件列表的类型，on-preview：图片预览时会触发，on-remove：当删除图片的时候会触发
        file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有 name、url属性】
      -->
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handleAvatarSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl"/>
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select :placeholder="`还有${unSelectAttr.length}未选择`" v-model="attrIdAndAttrName">
        <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectAttr" :key="unSelect.id"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" style="margin-left: 5px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
      <el-table style="width: 100%; margin-top: 10px" border :data="spuInfo.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="130" align="center"></el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="width" align="center"></el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width" align="center">
          <template slot-scope="{row, $index}">
            <el-tag :key="tag.id" v-for="(tag,$index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice($index,1)">{{tag.saleAttrValueName}}</el-tag>
            <!-- 底下两个组件进行切换 -->
            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)" @keyup.enter.native="handleInputConfirm(row)"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width" align="center">
          <template slot-scope="{row,$index}">
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="spuInfo.spuSaleAttrList.splice($index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      // 在添加的时候，得有默认的字段，用来获取数据
      spuInfo: {
        // 三级分类的 id
        category3Id: 0,
        // 描述
        description: "",
        // 收集 SPU 图片的信息
        spuImageList: [],
        // 品牌的 id
        tmId: 0,
        // SPU 的名称
        spuName: "",
        // 产品属性与属性值的收集
        spuSaleAttrList: [],
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储 SPU 图片信息
      saleAttrList: [], // 产品全部销售属性
      attrIdAndAttrName: '', // 收集未选择的销售属性的 id
    };
  },
  methods: {
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      // file：代表的是删除的那张图片
      // fileList：照片墙删除某一张图片以后，剩余的其他图片的数组
      // 当前照片墙的数据中包含name、url字段，对于服务器而言，不需要这两个字段字段
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给 dialogImageUrl 这个属性
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 照片墙图片上传成功的回调
    handleAvatarSuccess(res, file, fileList) {
      // res：上传图片成功服务器返回的数据
      // file：代表的是删除的那张图片的信息
      // fileList：照片墙删除某一张图片以后，剩余的其他图片的数组
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 父组件点击修改按钮的回调
    async getSpuData(row) {
      // 获取 SPU 信息的数据
      let spuResult = await this.$API.spu.reqSpuInfo(row.id)
      if (spuResult.code == 200) {
        // this.spuInfo = spuResult.data;
        Object.assign(this.spuInfo, spuResult.data)
      }

      // 获取品牌的数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }

      // 获取 SPU 图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id)
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data
        // 由于照片墙显示图片的数据需要数据，数据里面的元素需要有 name 与 url 字段
        // 需要把服务器返回的数据进行修改
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值给 spuImageList
        this.spuImageList = listArr
      }

      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },

     // 父组件点击添加 SPU 按钮发请求的回调
    async addSpuData(category3Id) {
      // 在添加或者修改数据前，先置空数据
      Object.assign(this._data, this.$options.data())
      this.spuInfo.category3Id = category3Id
      // 获取品牌的数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }

       // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },

    // 当前组件点击添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息，需要将数据进行处理
      const [ baseSaleAttrId, saleAttrName ] = this.attrIdAndAttrName.split(':')
      // 向 spuInfo 对象的 spuSaleAttrList 属性值里面添加销售属性
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList:[] }
      // 添加新的销售属性
      this.spuInfo.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 当前组件添加属性值的添加按钮的回调
    addSaleAttrValue(row) {
      // 点击添加按钮的时候，需要有 button 变为 input，通过当前销售属性的 inputVisible 控制
      this.$set(row, 'inputVisible', true)
      // 挂载响应式字段 inputValue 用来收集用户输入的属性值
      this.$set(row, 'inputValue', '')
      // 自动给最后一个元素获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 输入框失去焦点的回调
    handleInputConfirm(row) {
      // 解构出销售属性中收集到的数据
      const { baseSaleAttrId, inputValue } = row
      if(inputValue.trim() == "") {
        this.$message('属性值不能为空')
        return
      }
      let result = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName == inputValue
      })
      if (result) {
        return this.$message('该属性值已存在')
      }
      let newSaleAttrValue = {
      baseSaleAttrId,
      saleAttrValueName: inputValue
      }
      // 将属性的新的属性值添加到属性值列表中
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改 inputVisible 的值，显示 button 按钮
      row.inputVisible = false
    },
    // 当前组件保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带 imgName 与 imgUrl 字段
      // 数组.map()：对数组的每一项进行操作，返回的是新数组不影响原数组
      this.spuInfo.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl ? item.imgUrl : item.response.data
          // imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 使照片墙的数据置空
      this.spuImageList=[]
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo)
      if (result.code == 200) {
        this.$message({type: "success", message:'保存成功'})
        // 通知父组件回到 spu 列表中
        this.$emit('changeScene', { scene: 0, flag: this.spuInfo.id ? '修改' : '添加' })
      }
    },
    // 当前组件点击取消按钮的回调
    cancel() {
      // 组件实例 this._data，可以操作 data 当中响应式数据
      // this.$options，可以获取配置对象，配置对象的 data 函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
      this.$emit('changeScene', {scene: 0, flag: this.spuInfo.id ? '修改' : '添加'})
    },
  },
  computed:{
    // 计算出未选择的产品销售属性
    unSelectAttr() {
      let result = this.saleAttrList.filter(item => {
        return this.spuInfo.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>