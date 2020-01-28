import request from '@/utils/request'
//   ----------------上传 相关操作--------------------- 
//   客户学籍页面上传图片
export function UploadImgStudentStatus(data) {
  return request({
    url: '/managecourse/uploadImage/studentStatus',
    method: 'post',
    data
  })
}
//   客户跟进记录页面上传图片
export function UploadImgCustomTrack(data) {
  return request({
    url: '/managecourse/uploadImage/studentTrack',
    method: 'post',
    data
  })
}
//   课程宣传资料的图片上传
export function UploadImgCourseTravelBrochure(data) {
  return request({
    url: '/course/uploadCourse/',
    method: 'post',
    data
  })
}
//   新增新闻的图片和附件上传
export function UploadImgNews(data) {
  return request({
    url: '/news/uploadNewsImage',
    method: 'post',
    data
  })
}  
    //   班级管理的开班申请图片上传
export function UploadImgClass(data) {
  return request({
    url: '/managecourse/uploadImage/class',
    method: 'post',
    data
  })
}  
    //   班级管理的考勤表图片上传
export function UploadClassTimeTagImg(data) {
  return request({
    url: '/managecourse/uploadImage/classCheck',
    method: 'post',
    data
  })
}  
    //   新增客户图片上传
export function UploadAddCustom(data) {
  return request({
    url: '/managecourse/uploadImage/addCustom',
    method: 'post',
    data
  })
}  
    //   新增合同图片上传
export function UploadImgContract(data) {
  return request({
    url: '/managecourse/uploadImage/contract',
    method: 'post',
    data
  })
}  
    //   课程图片上传
    export function UploadImgCourse(data) {
      return request({
        url: '/course/uploadCourse/',
        method: 'post',
        data
      })
    }  
    //   题库上传图片
export function UploadImgExercise(data) {
  return request({
    url: '/exercise/uploadExercise/',
    method: 'post',
    data
  })
}  