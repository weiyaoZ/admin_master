<template>
  <div>
    <el-card style="margin: 30px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>
    <el-card>
      <!-- 平台属性展示模块 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px;" :disabled='!isShowBtn' @click="addAttr">添加属性</el-button>
      <!-- 表格：展示平台属性 -->
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="230" align="center"></el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width" align="center">
          <template slot-scope="{row,$index}">
            <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin:0px 5px">{{attrValue.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="230" align="center">
          <template slot-scope="{row, $index}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" style="margin-right:10px;">修改</el-button>
            <el-popconfirm :title="`确定删除${row.attrName}这个属性?`" @onConfirm="deleteAttr(row)">
              <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <!-- 添加|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form label-width="80px" :inline="true" ref="form" :model="attrInfo">
          <el-form-item label="属性名" style="margin-left: -20px;">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button>取消</el-button>
        <el-table style="width: 100%; margin:20px 0; " border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="130" align="center"></el-table-column>
          <el-table-column align="center" label="属性值名称">
            <template slot-scope="{row,$index}">
              <!-- 这里的结构需要用到 span 与 input进行来回切换 -->
              <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值" size="mini" v-if="row.flag" @blur="tlLook(row)" @keyup.enter.native="tlLook(row)"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="prop" label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
              <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash 当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      // 获取商品属性的数据
      attrList :[],
      // 控制 table 表格显示与隐藏
      isShowTable: true,
      // 控制添加属性的按钮是否禁用
      isShowBtn: false,
      // 获取各级分类的id
      CategoryId:{
        category1Id: 0,
        category2Id: 0,
        category3Id: 0
      },
      // 收集新增属性名 | 修改属性名的字段
      attrInfo:{
        attrName: "", // 属性名
        attrValueList: [
          // 属性值，因为属性值可以有多个因素用数组，每一个属性值都是一个对象，包含attrId，valueName
        ],
        categoryId: 0, // 三级分类的 id
        categoryLevel: 3, // 服务器需要区分几级id
      }
    };
  },
  methods: {
    // 自定义事件的回调，获取到包含各级商品的 id 的对象
    getCategoryId(CategoryId) {
      // 使添加属性按钮可以使用
      this.isShowBtn ++
      Object.assign(this.CategoryId, CategoryId)
      this.getAttrList()
    },
    async getAttrList() {
      // 结构出各级分类商品的 id
      const { category1Id, category2Id, category3Id } = this.CategoryId;
      let result = await this.$API.attr.reqAttrList( category1Id, category2Id, category3Id )
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    // 点击添加属性的回调
    addAttr(){
      this.isShowTable=false
      this.attrInfo.attrName = ''
      this.attrInfo.attrValueList = []
      this.attrInfo.categoryId = this.CategoryId.category3Id
    },
    // 点击添加属性值的回调
    addAttrValue() {
      // 添加属性值之前，先判断属性名合不合理
      if(this.attrInfo.attrName.trim() == ''){
        this.$message('请输入合理的属性名')
        return
      }
      let newArrIndex = this.attrInfo.attrValueList.length
      if(newArrIndex >= 1 && this.attrInfo.attrValueList[newArrIndex-1].valueName.trim() == ''){
        this.$message('保存的属性值不应该为空')
        return
      }
      // 向属性值的数组中添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 相应的属性名的id,目前而言是添加属性的操作，还没有相对应的属性id
        valueName: "", // 相应的属性值
        flag: true, // 给每一个属性值添加一个标记flag，用于控制每一个属性的切换查看模式和编辑模式
      })
      // 一创建新的属性值列表，使 input 框自动获取焦点
      this.$nextTick(()=> {
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    // 点击修改按钮的回调
    updateAttr(row){
      this.isShowTable = false
      // 利用深拷贝
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素添加上 flag 标识
      this.attrInfo.attrValueList.forEach(item =>{
        // 使 flag 成为响应式的数据
        this.$set(item, 'flag', false)
      })
    },
    async deleteAttr(row) {
      let result = await this.$API.attr.deleteAttr(row.id)
      if (result.code == 200) {
        this.$message({type:'success', message:'删除属性成功'})
        this.getAttrList()
      }
    },
    // 修改属性 input 框失去焦点的回调
    // row：形参是当前用户添加的最新的属性值
    tlLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if(row.valueName.trim() == ''){
        this.$message('请你输入一个合理的属性值')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      /* 
        some() 方法会依次执行数组的每个元素：
          如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
          如果没有满足条件的元素，则返回false。
      */
    let isRepeat = this.attrInfo.attrValueList.some(item=> {
      // 需要将 row【最新新增的属性值（数组最后一项元素）】从数组里取消判断
      if(row != item) {
          return row.valueName == item.valueName
        }
      })
      // 当前编辑模式变为查看模式【让 input 消失，span 显示】 
      if(isRepeat) {
        this.$message('该属性值已存在')
        return
        }
      row.flag = false
    },
    // 点击 span 的回调，变为编辑模式
    toEdit(row,index) {
      row.flag = true
      // 点击属性值，使 input 框自动获取焦点
      this.$nextTick(()=> {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框确定按钮的回调
    // 最新的 elmentUI 为 2.15.6 目前版本的号为 2.13.x
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮的回调，进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数
      // 不能提交空的数据给服务器 
      // 提交给服务器的数据中不应该出现 flag 字段】
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值不为空的
        if(item.valueName.trim() != ""){
          // 删除 flag 属性
          delete item.flag
          return item
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 展示平台属性信号量进行切换
        this.isShowTable = true
        // 提示信息
        this.$message({type:'success',message:'保存成功'})
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    }
  },
};
</script>

<style>

</style>