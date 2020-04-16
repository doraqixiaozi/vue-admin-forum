<template>
<div>
  <br>
  <el-form :inline="true">
          <el-form-item label="频道名称">
<el-input v-model="searchMap.name" placeholder="频道名称"></el-input></el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchMap.state" placeholder="请选择">
              <el-option label="可见" value="1"></el-option>
              <el-option label="不可见" value="0"></el-option>
            </el-select>
          </el-form-item>

    <el-button type="primary" @click="fetchData()">查询</el-button>
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
  </el-form>
  <el-table
    :data="list"
    border
    style="width: 100%">
          <el-table-column prop="id" label="ID" ></el-table-column>
          <el-table-column prop="name" label="频道名称" ></el-table-column>
          <el-table-column prop="state" label="可见状态" >
            <template slot-scope="scope">
              <i class="el-icon-check" v-if="scope.row.state=='1'"></i>
              <i class="el-icon-close" v-if="scope.row.state=='0'"></i>
            </template>
          </el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
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
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  <el-dialog title="编辑" :visible.sync="dialogFormVisible">
    <el-form label-width="80px">
        <el-form-item label="频道名称"><el-input v-model="pojo.name"></el-input></el-form-item>
      <el-form-item label="状态">
        <el-switch active-value="1" inactive-value="0"  v-model="pojo.state"></el-switch>
      </el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false" >关闭</el-button>
    </el-form>
  </el-dialog>
</div>
</template>
<script>
import channelApi from '@/api/channel'
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
    fetchData() {
      channelApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
      this.pageSize = val;
      channelApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
      })
    },

    handleCurrentChange(val) {//currentPage  改变时会触发  第几页

      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      channelApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
      })
    },
    handleSave() {
      channelApi.update(this.id, this.pojo).then(response => {
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
        channelApi.findById(id).then(response => {
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
        channelApi.deleteById(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })
    }
  }
}
</script>
