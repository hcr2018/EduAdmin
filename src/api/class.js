import request from '@/utils/request'
// 获取所有班级
export function getAllClass(url, param, data) {
  return request({
    url: '/class',
    method: 'get',
    params: param,
    data
  })
}
// 编辑班级的基本信息
export function editClassInfo(url, param, data) {
  return request({
    url: '/class/',
    method: 'put',
    params: param,
    data
  })
}
// 添加班级的基本信息
export function addClassInfo(url, param, data) {
  return request({
    url: '/class',
    method: 'post',
    params: param,
    data
  })
}
// 获取某个班级的所有学员
export function getOneClass(url, param, data) {
  return request({
    url: '/class/',
    method: 'get',
    params: param,
    data
  })
}
// 添加班级的开班申请的资料
export function addClassOpenData(url, param, data) {
  return request({
    url: '/class/openClass/',
    method: 'post',
    params: param,
    data
  })
}
// 获取班级的开班申请的资料
export function getClassOpenData(url, param, data) {
  return request({
    url: '/class/getClassTeachers/',
    method: 'get',
    params: param,
    data
  })
}
// 根据月份获取班级的课程表
export function getTimeTableByMonth(url, param, data) {
  return request({
    url: '/class/getMonthClassDaily/',
    method: 'get',
    params: param,
    data
  })
}
// 添加班级的课程表
export function addTimeTableBy(url, param, data) {
  return request({
    url: '/class/addClassDaily/',
    method: 'post',
    params: param,
    data
  })
}
// 添加课程表对应的考勤数据
export function addTimeTag(url, param, data) {
  return request({
    url: '/class/addClassCheck/',
    method: 'post',
    params: param,
    data
  })
}
// 获取课程表对应的考勤数据
export function getTimeTag(url, param, data) {
  return request({
    url: '/class/getClassCheck/',
    method: 'get',
    params: param,
    data
  })
}
// 添加班级学生
export function addClassStu(url, param, data) {
  return request({
    url: '/class/addClassStudent/',
    method: 'post',
    params: param,
    data
  })
}
// 获取班级学生
export function getClassStu(url, param, data) {
  return request({
    url: '/class/getClassStudents/',
    method: 'get',
    params: param,
    data
  })
}
// 分发作业
export function handOutTask(url, param, data) {
  return request({
    url: '/class/sendStudentsExercise/',
    method: 'put',
    params: param,
    data
  })
}
// 获取分发记录-全班
export function getAllClassTaskRecord(url, param, data) {
  return request({
    url: '/class/getSendExerciseOfClassRecord/',
    method: 'get',
    params: param,
    data
  })
}
