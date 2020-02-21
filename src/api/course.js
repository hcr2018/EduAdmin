import request from '@/utils/request'

// 获取课程列表-查询课程名称获取
export function getCourseList(url, param, data) {
  return request({
    url: '/course' + url,
    method: 'get',
    params: param,
    data
  })
}

// 获取课程大类
export function GetCourseOfKind(url, param, data) {
  return request({
    url: '/course/getCourseOfKind' + url,
    method: 'get',
    params: param,
    data
  })
}

// 设置课程是否上架
export function setCourseUpperShelf(url, param, data) {
  return request({
    url: '/course/setOpen/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 添加课程

export function addCourse(url, param, data) {
  return request({
    url: '/course' + url,
    method: 'post',
    params: param,
    data
  })
}
// 编辑课程
export function editCourse(url, param, data) {
  return request({
    url: '/course/' + url,
    method: 'put',
    params: param,
    data
  })
}

// 根据课程获取科目
export function GetSubjectByCourse(url, param, data) {
  return request({
    url: '/coursebook/getCourseBookByCourse/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 获取课程的宣传资料
export function getCourseTravelBrochure(url, param, data) {
  return request({
    url: '/course/getCourseShowInfo/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 修改课程的宣传资料
export function updateCourseTravelBrochure(url, param, data) {
  return request({
    url: '/course/updateCourseShowInfo/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 获取课程价格列表
export function getCoursePriceList(url, param, data) {
  return request({
    url: '/coursebook/getByCourse/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 保存课程价格列表
export function saveCoursePriceList(url, param, data) {
  return request({
    url: '/coursebook/addCoursePrice' + url,
    method: 'post',
    params: param,
    data
  })
}

// 添加课程

export function addCourseKind(url, param, data) {
  return request({
    url: '/course_kind/' + url,
    method: 'post',
    params: param,
    data
  })
}
// 编辑课程
export function editCourseKind(url, param, data) {
  return request({
    url: '/course_kind/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 绕开学院，直接获取所有课程大类列表
export function getAllCourseKind(url, param, data) {
  return request({
    url: '/course_kind/getAllCourseKind' + url,
    method: 'get',
    params: param,
    data
  })
}

// 删除课程大类
export function deleteCourseKind(url, param, data) {
  return request({
    url: '/course_kind/' + url,
    method: 'delete',
    params: param,
    data
  })
}