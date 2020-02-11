import request from '@/utils/request'
//   ----------------客户跟进记录相关操作---------------------
// 获取客户的跟进数据
export function getCustomTracks(url, query, data) {
  return request({
    url: '/studenttrack/getStudentTracks/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加客户的跟进数据
export function addcustomTracks(url, query, data) {
  return request({
    url: '/studenttrack/addStudentTrack' + url,
    method: 'post',
    params: query,
    data
  })
}
// 上传跟进记录中的照片
export function uploadImgInTracks(url, query, data) {
  return request({
    url: '/managecourse/uploadImage/studentTrack' + url,
    method: 'post',
    params: query,
    data
  })
}
// 回复跟进记录
export function replyTracks(url, query, data) {
  return request({
    url: '/studenttrack/replyStudentTrack/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 客户回复短信，写入跟进记录
export function receiveSmsTrack(url, query, data) {
  return request({
    url: '/studenttrack/receiveSmsTrack/' + url,
    method: 'post',
    params: query,
    data
  })
}
// 获取跟进记录列表
export function getTrackList(url, query, data) {
  return request({
    url: '/studenttrack/getAllTracks/' + url,
    method: 'get',
    params: query,
    data
  })
}

//   ----------------客户购买课程相关操作---------------------

// 获取客户购买课程的记录
export function getCustomBuyCouseRecord(url, query, data) {
  return request({
    url: '/student/queryStudentPayedRecord' + url,
    method: 'get',
    params: query,
    data
  })
}
// 手动添加客户购买课程的记录
export function addCustomBuyCourseRecord(url, query, data) {
  return request({
    url: '/managecourse/giveBuyCourse/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 是否允许客户做题
export function customAllowDoExercise(url, query, data) {
  return request({
    url: '/coursebook/forbidden/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 删除学员的购买记录。
export function deleteBuyCourse(url, query, data) {
  return request({
    url: '/managecourse/deleteBuyCourse/' + url,
    method: 'delete',
    params: query,
    data
  })
}
//   ----------------客户个人信息相关操作---------------------

// 获取客户信息列表
export function getCustomInfoList(url, query, data) {
  return request({
    url: '/student' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加客户信息
export function addCustomInfo(url, query, data) {
  return request({
    url: '/student' + url,
    method: 'post',
    params: query,
    data
  })
}
// 修改客户信息
export function editCustomInfo(url, query, data) {
  return request({
    url: '/student/update/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 重置客户密码
export function resetCustomPassword(url, query, data) {
  return request({
    url: '/student/resetpswd/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 禁用或启用客户账户
export function setCustomAccountStatus(url, query, data) {
  return request({
    url: '/student/setState/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 检查这个电话号码是否已经注册
export function checkTelephone(url, query, data) {
  return request({
    url: '/student/checkTelephone/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 设置重点客户
export function setStar(url, query, data) {
  return request({
    url: '/student/markFocus/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 批量转移客户的管理员
export function batchChangeManager(url, query, data) {
  return request({
    url: '/student/batchChangeManager/' + url,
    method: 'post',
    params: query,
    data
  })
}
