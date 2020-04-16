<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="searchMap.sponsor" placeholder="主办方"></el-input>
      </el-form-item>
      <el-form-item label="是否可见">
        <el-select v-model="searchMap.state" placeholder="请选择">
          <el-option label="可见" value="1"></el-option>
          <el-option label="不可见" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间:">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="searchMap.startTime"
          type="date"
          placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="searchMap.endTime"
          type="date"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>

    <el-table
      :data="list"
    >
      <el-table-column
        prop="name"
        label="活动名称"
        width="120px"
      >
      </el-table-column>
      <el-table-column
        prop="sponsor"
        label="主办方"
        width="120px"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="活动地址"
        width="200px"
      >
      </el-table-column>
      <el-table-column
        prop="starttime"
        label="开始时间"
        width="180px"
      >
      </el-table-column>
      <el-table-column
        prop="endtime"
        label="结束时间"
      >
      </el-table-column>
      <el-table-column
        label="活动图"
      >
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image"
              :preview-src-list="url2List(scope.row.image)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否可见"
        width="100px"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.state=='1'"></i>
          <i class="el-icon-close" v-if="scope.row.state=='0'"></i>
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
        <el-form-item label="活动名称">
          <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="基本地址">
          <el-input v-model="pojo.address" placeholder="基本地址"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="pojo.starttime"
                          placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="截至时间">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="pojo.endtime"
                          placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-date-picker type="date" v-model="pojo.enrolltime" value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="报名截止"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动详情">
          <el-input v-model="pojo.detail" placeholder="活动详情" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="选择城市">
          <el-select v-model="pojo.city" placeholder="请选择">
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否可见">
          <el-switch active-value="1" inactive-value="0" v-model="pojo.state"></el-switch>
        </el-form-item>
        <my-image :image="pojo.image" label-name="活动图" model-name="gathering" @changeMine="changeMine"></my-image>
        <el-form-item>
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import gatheringApi from '@/api/gathering'
  import cityApi from '@/api/city'
  import myImage from "../../components/mine/myImage";
  export default {
    data() {
      return {
        list: [],
        total: 0,//总记录数
        currentPage: 1,//当前页
        pageSize: 10,//每页大小
        searchMap: {}, //查询条件
        dialogFormVisible: false,//编辑窗口是否可见
        pojo: {image:''},//编辑表单绑定的实体对象
        cityList: [],//城市列表
        id: '',//当前用户修改的ID
      }
    },
    components:{
      myImage
    },
    created() {
      this.fetchData();
      cityApi.getList().then(response => {
        this.cityList = response.data
      })
    },
    methods: {
      changeMine(image){
        this.pojo.image=image;
      },
      //将url地址转list以适配element ui进行大图预览
      url2List(url) {
        let urlList = [];
        urlList.push(url);
        return urlList;
      },
      handleRemoveImage(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.pojo.image = file.url;
        this.dialogVisible = true;
      },
      fetchData() {
        gatheringApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          // console.log(this.searchMap);
          this.list = response.data.rows;
          this.total = response.data.total;
          console.log(this.currentPage, this.pageSize)
        })
      },
      handleSizeChange(val) {//pageSize  改变时会触发  每一页显示多少条
        this.pageSize = val;
        gatheringApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },

      handleCurrentChange(val) {//currentPage  改变时会触发  第几页

        // console.log(`当前页: ${val}`);
        this.currentPage = val;
        gatheringApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
      },
      handleSave() {
        gatheringApi.update(this.id, this.pojo).then(response => {

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
          gatheringApi.findById(id).then(response => {
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

          gatheringApi.deleteById(id).then(response => {
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

      }
    }

  }
</script>
<style>
  .el-table {
    width: 99.9% !important;
  }

  .configurationTable .el-table__body-wrapper {
    overflow: hidden;
  }

  .afterRenderClass .el-table__body-wrapper {

    overflow: auto;

  }
</style>
