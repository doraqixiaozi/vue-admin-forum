<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="昵称">
        <el-input v-model="searchMap.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="是否被封禁">
        <el-select v-model="searchMap.state" placeholder="请选择">
          <el-option label="封禁" value="1"></el-option>
          <el-option label="未封禁" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
    </el-form>

    <el-table
      :data="list"
    >
      <el-table-column
        prop="loginname"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
      >
      </el-table-column>
      <el-table-column
        label="性别"
      >
        <template slot-scope="scope">
          {{scope.row.sex=='0'?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column
        label="头像"
      >
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.avatar"
              :preview-src-list="url2List(scope.row.avatar)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="fanscount"
        label="粉丝"
      >
      </el-table-column>
      <el-table-column
        prop="followcount"
        label="关注"
      >
      </el-table-column>
      <el-table-column
        label="封禁"
      >
        <template slot-scope="scope">
          <el-switch active-value="1" inactive-value="0" v-model="scope.row.state" @change="changeState(scope.row)" ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total.sync="total">
    </el-pagination>

  </div>
</template>

<script>
  import userApi from '@/api/user'

  export default {
    name: "user",
    data() {
      return {
        list: [],
        total: 0,//总记录数
        currentPage: 1,//当前页
        pageSize: 10,//每页大小
        searchMap: {}, //查询条件
        dialogFormVisible: false,//编辑窗口是否可见
        pojo: {},//编辑表单绑定的实体对象
      }
    }, created() {
      this.fetchData();
    },
    methods: {
      changeState(user){
        userApi.changeState(user.id,user.state).then(res=>{
          if (res.flag==true){
            if (user.state=='0'){
              this.$message({
                showClose: true,
                message: `成功解封用户:${user.nickname}`,
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: `成功封禁用户:${user.nickname}`,
                type: 'success'
              });
            }
          }else{
            this.$message({
              showClose: true,
              message: `网络错误！`,
              type: 'error'
            });
          }

        });
      },
      //将url地址转list以适配element ui进行大图预览
      url2List(url) {
        let urlList = [];
        urlList.push(url);
        return urlList;
      },
      fetchData() {
        userApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
        this.pageSize = val;
        userApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },

      handleCurrentChange(val) {//currentPage  改变时会触发  第几页

        // console.log(`当前页: ${val}`);
        this.currentPage = val;
        userApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      handleSave() {
        userApi.update(this.id, this.pojo).then(response => {

          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          });

          if (response.flag) {//如果成功
            this.fetchData()//刷新列表
          }
        })
        this.dialogFormVisible = false//关闭窗口
      },
      handleEdit(id) {
        this.id = id
        this.dialogFormVisible = true//打开窗口

        if (id != '') {//修改
          userApi.findById(id).then(response => {
            if (response.flag) {
              this.pojo = response.data
            }
          })
        } else {
          this.pojo = {}//清空数据
        }

      },

      handleDelete(id) {
        this.$confirm('确定要删除此纪录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          userApi.deleteById(id).then(response => {
            this.$message({
              message: response.message,
              type: (response.flag ? 'success' : 'error')
            })
            if (response.flag) {
              this.fetchData()// 刷新数据
            }
          })

        }).catch(() => {

        });

      },
    }

  }
</script>

<style scoped>

</style>
