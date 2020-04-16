<template>
  <el-form-item :label="labelName">
    <el-upload
      action="none"
      class="avatar-uploader"
      :http-request="uploadImg"
      list-type="picture-card"
      :show-file-list="false"
      v-show="image==''">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div class="el-upload-list el-upload-list--picture-card" v-show="image!=''">
      <div class="el-upload-list__item is-success">
        <img class="el-image__inner el-image__preview" v-show="image!=''" :src="image">
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <span class="el-upload-list__item-actions">
               <!-- 删除图片-->
               <span class="el-upload-list__item-delete">
                 <i class="el-icon-delete" @click="image=''"></i>
               </span>
          <!--放大图片-->
                 <span class="el-upload-list__item-delete">
                 <i class="el-icon-zoom-in" @click="dialogVisible=true"></i>
               </span>
               </span>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body='dialogVisible' :append-to-body="dialogVisible">
      <img width="100%" :src="image" alt>
    </el-dialog>
  </el-form-item>
</template>

<script>
  import fileUpload from "@/api/fileUpload";
  //注意用此组件需在父组件method中定义方法changeMine并如下使用
  //<my-image :image="pojo.logo" label-name="Logo" model-name="enterprise" @changeMine="changeMine"></my-image>
  export default {
    name: "myImage",
    data() {
      return {
        dialogVisible: false,
      }
    },
    //value值父组件可以通过v-model传入，这样子组件的value被修改可以通过触发父组件v-model本身的同步方法来修改父组件的值（可以省去自定义方法）
    props: ['labelName', 'image', 'modelName'],
    methods: {
      uploadImg(param) {
        let formData = new FormData();
        formData.append('image', param.file);
        fileUpload.uploadImg(formData, this.modelName).then(response => {
          this.image = response.data;
          this.$emit('changeMine', this.image)
        });

      },
    }
  }
</script>

<style scoped>

</style>
