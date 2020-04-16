import request from "@/utils/request"
const group_name = 'file'
const api_name = 'image'
const imageUrl=`http://127.0.0.1:9014/${api_name}`
export default {
  imageUrl,
  uploadImg(form,componentName){
    return request({
      method:'post',
      url:`${imageUrl}/${componentName}`,
      data:form,
      headers:{
        'Content-Type':'multipart/form-data'
      }
      }
    )
  }
}
