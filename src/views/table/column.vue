<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="专栏名称">
        <el-input v-model="searchMap.name" placeholder="专栏名称"></el-input>
      </el-form-item>
      <el-form-item label="专栏简介" >
        <el-input v-model="searchMap.summary" placeholder="专栏简介" ></el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="searchMap.userid" placeholder="用户ID"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="申请日期">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="searchMap.createtimeFrom"
                        ></el-date-picker>---
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="searchMap.createtimeEnd"
                        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核日期">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="searchMap.checktimeFrom"
                        ></el-date-picker>---
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="searchMap.checktimeEnd"
        ></el-date-picker>
      </el-form-item>
      <br>

      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>
    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="专栏名称"></el-table-column>
      <el-table-column prop="summary" label="专栏简介" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userid" label="用户ID"></el-table-column>
      <el-table-column prop="createtime" label="申请日期">
      </el-table-column>
      <el-table-column prop="checktime" label="审核日期"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.state=='1'"></i>
          <i class="el-icon-close" v-if="scope.row.state=='0'"></i>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="审核/封禁"
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
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="专栏名称">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="专栏简介">
          <el-input v-model="pojo.summary"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="pojo.userid"></el-input>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="pojo.createtime"
          placeholder="申请日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核日期">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="pojo.checktime"
                          placeholder="申请日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch active-value="1" inactive-value="0" v-model="pojo.state"></el-switch>
        </el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import columnApi from '@/api/column'

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
      changeState(column){
        columnApi.changeState(column.id,column.state).then(res=>{
          if (res.flag==true){
            if (column.state=='0'){
              this.$message({
                showClose: true,
                message: `成功审核专栏:${column.name}`,
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: `成功封禁专栏:${column.name}`,
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
        columnApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
      },
      handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
        this.pageSize = val;
        columnApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },

      handleCurrentChange(val) {//currentPage  改变时会触发  第几页

        // console.log(`当前页: ${val}`);
        this.currentPage = val;
        columnApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      handleSave() {
        columnApi.update(this.id, this.pojo).then(response => {
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
          columnApi.findById(id).then(response => {
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
          columnApi.deleteById(id).then(response => {
            this.$message({message: response.message, type: (response.flag ? 'success' : 'error')})
            if (response.flag) {
              this.fetchData() // 刷新数据
            }
          })
        })
      },
      handleExamine(id) {
        this.$confirm('确定要审核此纪录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          columnApi.examine(id).then(response => {
            this.$message({message: response.message, type: (response.flag ? 'success' : 'error')})
            if (response.flag) {
              this.fetchData() // 刷新数据
            }
          })
        })
      }
    }
  }
</script>
