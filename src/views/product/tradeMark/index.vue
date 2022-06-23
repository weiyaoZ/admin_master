<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 3px 0 20px 0" @click="showDialog" >添加</el-button >
    <!-- 
      表格组件
      data：表格组件将来要展示的数据 --- 数据为数组类型
      border：是给表格添加边框

      column 属性
      label：显示的标题
      width：对应列的宽度
      align：标题的对齐方式
      prop: 对应列内容的字段名，也可以使用 property 属性
      注意1: elmentUI 当中的 table 组件,展示的数据都是以列进行展示
      -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width" align="center"><template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px"/>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" @click="updateDialog(row)">修改</el-button> 
          <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      
      current-page：代表当前第几页
      total：代表分页器一共需要展示数据条数
      pageSize：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器的布局
      pager-count：页码按钮的数量，当总页数超过该值时会折叠 如果为 9 连续页码就为 7
      -->
    <el-pagination
      style="margin-top: 20px"
      align="center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="pageSize"
      :pager-count="7"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total "
    >
    </el-pagination>

    <!-- 
      对话框
        :visible.sync：控制对话框显示与隐藏用的
        Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
      -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- from表单，:model属性，将表单的数据收集到 tmFrom对象身上，将来表单验证也需要这个属性 -->
      <el-form style="width: 80%" :model="tmFrom" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 
            这里收集数据，不能使用 v-model 因为不是表单元素
            action：设置图片上传的地址
            :on-success：可以检测到图片上传，当图片上传成功会执行一次
            :before-upload：可以在上传图片之前，会执行一次
          -->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则的回调函数
    var validateTmName = (rule, value, callback) => {
      // 自定义校验品牌名称的规则
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("品牌名称为2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 代表的分页器第几页
      page: 1,
      // 当前页数展示数据条数
      pageSize: 3,
      // 总共多少条数据
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 收集品牌信息
      tmFrom: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证的规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          // require:必须为校验字段（前面五角星有关系）  message：提示信息  trigger：用户行为设置（事件的设置：blur、change）
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // elmentUI 系统校验规则
          // { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change"},
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌 LOGO 的验证规则
        logoUrl: [{ required: true, message: "请选择品牌的LOGO" }],
      },
    };
  },
  // 组件挂载完毕发请求
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      // 解构出参数
      const { page, pageSize } = this;
      // 获取品牌列表的接口
      let result = await this.$API.tradeMark.reqTradeMarkList(page, pageSize);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当分页器某一页需要展示数据条数发生改变的时候触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      this.dialogFormVisible = true;
      // 清除数据
      this.tmFrom = { tmName: "", logoUrl: "" };
    },
    // 点击修改品牌信息的按钮
    updateDialog(row) {
      this.dialogFormVisible = true;
      // row 为用户选中品牌的信息
      // 将已有的品牌信息赋值给 tmFrom 进行展示
      this.tmFrom = { ...row };
    },
    // 上传图片相关的回调
    handleAvatarSuccess(res, file) {
      // res：上传成功之后返回前端数据
      // file：上传成功之后服务器返回前端的数据，该数据包含 res 所以一般只是用 file
      this.tmFrom.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮的回调（添加品牌|修改品牌)
    addOrUpdateTradeMark() {
      // 当全部验证字段通过，再写业务逻辑
      this.$refs.ruleForm.validate(async (valid) => {
        // 如果全部字段符合条件
        if (valid) {
          // 隐藏对话框
          this.dialogFormVisible = false;
          // 发送请求
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmFrom
          );
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmFrom.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改品牌成功后，再次发送请求
            // 如果是添加品牌：停留在最后 一页，如果是修改，则停留在当前页
            let lastPage = 0
            if(this.total % this.pageSize){
              lastPage = Math.ceil(this.total / this.pageSize)
            } else {
              lastPage = Math.ceil(this.total / this.pageSize) + 1
            }
            this.getPageList(this.tmFrom.id ? this.page : lastPage);
          }
        } else {
          console.log("err submit!!");
          return false;
        }
      });
    },
    // 删除品牌的回调
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`此操作将永久删除该文件, 是否确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮的时候会触发
          // 向服务器发请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if(result.code == 200) {
            this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 再次发送请求
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          // 当用户点击取消按钮的时候会触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>