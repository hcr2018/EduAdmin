import request from '@/utils/request'
    //   ----------------客户跟进记录相关操作--------------------- 
    // 获取客户的跟进数据
export function getCustomTracks() {
  return request({
    url:  "/studenttrack/getStudentTracks/",
    method: 'get'
  })
}
    // 添加客户的跟进数据
export function addcustomTracks() {
  return request({
    url: "/studenttrack/addStudentTrack",
    method: 'post'
  })
}
    // 上传跟进记录中的照片
export function uploadImgInTracks() {
  return request({
    url: "/managecourse/uploadImage/studentTrack",
    method: 'post'
  })
}
    // 回复跟进记录
export function replyTracks() {
  return request({
    url: "/studenttrack/replyStudentTrack/" ,
    method: 'put'
  })
}
    // 客户回复短信，写入跟进记录
export function receiveSmsTrack() {
  return request({
    url: "/studenttrack/receiveSmsTrack/",
    method: 'post'
  })
}
    // 获取跟进记录列表
export function getTrackList() {
  return request({
    url: "/studenttrack/getAllTracks/" ,
    method: 'get'
  })
}

    //   ----------------客户购买课程相关操作--------------------- 

    // 获取客户购买课程的记录
export function getCustomBuyCouseRecord() {
  return request({
    url: "/student/queryStudentPayedRecord",
    method: 'get'
  })
}
    // 手动添加客户购买课程的记录
export function addCustomBuyCourseRecord() {
  return request({
    url: '/managecourse/giveBuyCourse/',
    method: 'put'
  })
}
    // 是否允许客户做题
export function customAllowDoExercise() {
  return request({
    url: '/coursebook/forbidden/',
    method: 'get'
  })
}
    // 删除学员的购买记录。
export function deleteBuyCourse() {
  return request({
    url: '/managecourse/deleteBuyCourse/',
    method: 'delete'
  })
}
    //   ----------------客户个人信息相关操作--------------------- 

    // 获取客户信息列表
export function getCustomInfoList() {
  return request({
    url: '/student',
    method: 'get'
  })
}
    // 添加客户信息
export function addCustomInfo() {
  return request({
    url: '/student',
    method: 'post'
  })
}
    // 修改客户信息
export function editCustomInfo() {
  return request({
    url: '/student/update',
    method: 'put'
  })
}
    // 重置客户密码
export function resetCustomPassword() {
  return request({
    url: '/student/resetpswd/',
    method: 'put'
  })
}
    // 禁用或启用客户账户
export function setCustomAccountStatus() {
  return request({
    url: '/student/setState/',
    method: 'put'
  })
}
    // 检查这个电话号码是否已经注册
export function checkTelephone() {
  return request({
    url: '/student/checkTelephone/',
    method: 'get'
  })
}
    // 设置重点客户
export function setStar() {
  return request({
    url: '/student/markFocus/',
    method: 'put'
  })
}
    // 批量转移客户的管理员
export function batchChangeManager() {
  return request({
    url: '/student/batchChangeManager/',
    method: 'post'
  })
}