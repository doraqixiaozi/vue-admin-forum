<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="企业名称">
        <el-input v-model="searchMap.name" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>
    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column prop="name" label="企业名称"></el-table-column>
      <el-table-column prop="summary" label="企业简介" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="address" label="企业地址"></el-table-column>
      <el-table-column prop="labels" label="标签列表"></el-table-column>
      <el-table-column
        label="是否热门"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.ishot=='1'"></i>
          <i class="el-icon-close" v-if="scope.row.ishot=='0'"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="LOGO"
      >
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.logo"
              :preview-src-list="convert(scope.row.logo)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="jobcount" label="职位数"></el-table-column>
      <el-table-column prop="url" label="URL"></el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="企业名称">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介">
          <el-input v-model="pojo.summary" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="企业地址">
          <el-input v-model="pojo.address"></el-input>
        </el-form-item>
        <el-form-item label="标签列表">
          <el-input v-model="pojo.labels"></el-input>
        </el-form-item>
        <el-form-item label="是否热门">
          <el-switch active-value="1" inactive-value="0" v-model="pojo.ishot"></el-switch>
        </el-form-item>
        <my-image :image="pojo.logo" label-name="Logo" model-name="enterprise" @changeMine="changeMine"></my-image>
        <el-form-item label="职位数">
          <el-input v-model="pojo.jobcount"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="pojo.url">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>

        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import enterpriseApi from '@/api/enterprise'
  import {url2List} from '@/utils'
  import myImage from "../../components/mine/myImage";
  export default {
    data() {
      return {
        list: [],
        total: 0, // 总记录数
        currentPage: 1, // 当前页
        pageSize: 10, // 每页大小
        searchMap: {}, // 查询条件
        dialogFormVisible: false, // 编辑窗口是否可见
        pojo: {}, // 编辑表单绑定的实体对象
        cityList: [], // 城市列表
        id: '', // 当前用户修改的ID
        imageUrl: ''
      }
    },
    components:{
    myImage
    },
    created() {
      this.fetchData()
    },
    methods: {
      //用于图片组件中的父子组件数据同步
      changeMine(image){
        this.pojo.logo=image;
      },
      convert(url) {
        return url2List(url);
      },
      fetchData() {
        enterpriseApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
      },
      handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
        this.pageSize = val;
        enterpriseApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },

      handleCurrentChange(val) {//currentPage  改变时会触发  第几页

        // console.log(`当前页: ${val}`);
        this.currentPage = val;
        enterpriseApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      handleSave() {
        enterpriseApi.update(this.id, this.pojo).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) { // 如果成功
            this.fetchData() // 刷新列表
          }
        })
        this.dialogFormVisible = false // 关闭窗口
      },
      handleEdit(id) {
        this.id = id
        this.dialogFormVisible = true // 打开窗口
        if (id !== '') { // 修改
          enterpriseApi.findById(id).then(response => {
            if (response.flag) {
              this.pojo = response.data
            }
          })
        } else {
          this.pojo = {} // 清空数据
        }
      },
      handleDelete(id) {
        this.$confirm('确定要删除此纪录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          enterpriseApi.deleteById(id).then(response => {
            this.$message({message: response.message, type: (response.flag ? 'success' : 'error')})
            if (response.flag) {
              this.fetchData() // 刷新数据
            }
          })
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.pojo.logo = this.imageUrl
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
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
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 50px;
    display: block;
  }
</style>
