<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="searchMap.name" placeholder="名称"></el-input>
      </el-form-item>
        <el-form-item label="是否热门">
          <el-select v-model="searchMap.ishot" placeholder="请选择">
            <el-option label="热门" value="1"></el-option>
            <el-option label="不热门" value="0"></el-option>
          </el-select>
        </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>

    <el-table
      :data="list"
    >
      <el-table-column
        prop="name"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="是否热门"
        width="100px"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.ishot=='1'"></i>
          <i class="el-icon-close" v-if="scope.row.ishot=='0'"></i>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100px"
      >
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
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total.sync="total">
    </el-pagination>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="pojo.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="是否热门">
          <el-switch active-value="1" inactive-value="0" v-model="pojo.ishot"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import cityApi from '@/api/city';
    export default {
        name: "city",
      data() {
        return {
          list: [],
          total: 0,//总记录数
          currentPage: 1,//当前页
          pageSize: 10,//每页大小
          searchMap: {}, //查询条件
          dialogFormVisible: false,//编辑窗口是否可见
          pojo: {},//编辑表单绑定的实体对象
          id: '',//当前用户修改的ID
        }
      },created() {
          this.fetchData();
      },
      methods: {
        fetchData() {
          cityApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
          })
        },
        handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
          this.pageSize = val;
          cityApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
          })
        },

        handleCurrentChange(val) {//currentPage  改变时会触发  第几页

          // console.log(`当前页: ${val}`);
          this.currentPage = val;
          cityApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
          })
        },
        handleSave() {
          cityApi.update(this.id, this.pojo).then(response => {

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
            cityApi.findById(id).then(response => {
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

            cityApi.deleteById(id).then(response => {
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
