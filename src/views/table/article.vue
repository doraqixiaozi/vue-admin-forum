<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="标题">
        <el-input v-model="searchMap.title" placeholder="标题"></el-input>
      </el-form-item>
        <el-form-item label="是否公开">
          <el-select v-model="searchMap.ispublic" placeholder="请选择">
            <el-option label="公开" value="1"></el-option>
            <el-option label="不公开" value="0"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="searchMap.state" placeholder="请选择">
          <el-option label="已审核" value="1"></el-option>
          <el-option label="未审核" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属频道">
        <el-input v-model="searchMap.channelid" placeholder="所属频道"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="searchMap.type" placeholder="类型"></el-input>
      </el-form-item>

      <el-button type="primary" @click="fetchData()">查询</el-button>
    </el-form>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column prop="id" label="ID" ></el-table-column>
      <el-table-column prop="columnid" label="专栏ID" ></el-table-column>
      <el-table-column prop="userid" label="用户ID" ></el-table-column>
      <el-table-column prop="title" label="标题" ></el-table-column>
      <el-table-column prop="createtime" label="发表日期" ></el-table-column>
      <el-table-column prop="updatetime" label="修改日期" ></el-table-column>
<!--      <el-table-column prop="ispublic" label="是否公开" ></el-table-column>
      <el-table-column prop="istop" label="是否置顶" ></el-table-column>-->
      <el-table-column prop="state" label="审核状态" >
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.state=='1'"></i>
          <i class="el-icon-close" v-if="scope.row.state=='0'"></i>
        </template>
      </el-table-column>
      <el-table-column prop="channelid" label="所属频道" ></el-table-column>
      <el-table-column prop="type" label="类型" ></el-table-column>

      <el-table-column
        fixed="right"
        label="审核/下架"
        width="100">
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
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="文章详情" :visible.sync="dialogFormVisible">
      {{pojo.title}}
      <hr>
      <div v-html="pojo.content"></div>

      <el-button type="primary" @click="handleExamine(pojo.id)">审核</el-button>
      <el-button type="primary" @click="handleDelete(pojo.id)">删除</el-button>
      <el-button @click="dialogFormVisible = false">关闭</el-button>

    </el-dialog>
  </div>
</template>
<script>
  import articleApi from '@/api/article'

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
        id: '' // 当前用户修改的ID
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      changeState(article){
        articleApi.changeState(article.id,article.state).then(res=>{
          if (res.flag==true){
            if (article.state=='0'){
              this.$message({
                showClose: true,
                message: `成功下架文章:${article.title}`,
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: `成功审核文章:${article.title}`,
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
      fetchData() {
        articleApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
      },
      handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
        this.pageSize = val;
        articleApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },

      handleCurrentChange(val) {//currentPage  改变时会触发  第几页

        // console.log(`当前页: ${val}`);
        this.currentPage = val;
        articleApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      handleSave() {
        articleApi.update(this.id, this.pojo).then(response => {
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
          articleApi.findById(id).then(response => {
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
          articleApi.deleteById(id).then(response => {
            this.$message({message: response.message, type: (response.flag ? 'success' : 'error')})
            if (response.flag) {
              this.fetchData() // 刷新数据

            }
            this.dialogFormVisible = false
          })
        })
      },
      handleExamine(id) {
        this.$confirm('确定要审核此纪录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          articleApi.examine(id).then(response => {
            this.$message({message: response.message, type: (response.flag ? 'success' : 'error')})
            if (response.flag) {
              this.fetchData() // 刷新数据

            }
            this.dialogFormVisible = false
          })
        })
      }
    }
  }
</script>
