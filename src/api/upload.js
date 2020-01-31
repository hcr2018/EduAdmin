import request from '@/utils/request'
//   ----------------上传 相关操作--------------------- 
//   客户学籍页面上传图片
export function UploadImgStudentStatus(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/studentStatus' + url,
    method: 'post',
    params: query,
    data
  })
}
//   客户跟进记录页面上传图片
export function UploadImgCustomTrack(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/studentTrack' + url,
    method: 'post',
    params: query,
    data
  })
}
//   课程宣传资料的图片上传
export function UploadImgCourseTravelBrochure(url, query, data) {
  return request({
    url: '/course/uploadCourse/' + url,
    method: 'post',
    params: query,
    data
  })
}
//   新增新闻的图片和附件上传
export function UploadImgNews(url, query, data) {
  return request({
    url: '/news/uploadNewsImage' + url,
    method: 'post',
    params: query,
    data
  })
}
//   班级管理的开班申请图片上传
export function UploadImgClass(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/class' + url,
    method: 'post',
    params: query,
    data
  })
}
//   班级管理的考勤表图片上传
export function UploadClassTimeTagImg(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/classCheck' + url,
    method: 'post',
    params: query,
    data
  })
}
//   新增客户图片上传
export function UploadAddCustom(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/addCustom' + url,
    method: 'post',
    params: query,
    data
  })
}
//   新增合同图片上传
export function UploadImgContract(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/contract' + url,
    method: 'post',
    params: query,
    data
  })
}
//   课程图片上传
export function UploadImgCourse(url, query, data) {
  return request({
    url: '/course/uploadCourse/' + url,
    method: 'post',
    params: query,
    data
  })
}
//   题库上传图片
export function UploadImgExercise(url, query, data) {
  return request({
    url: '/exercise/uploadExercise/' + url,
    method: 'post',
    params: query,
    data
  })
}  
