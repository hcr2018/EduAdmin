import request from '@/utils/request'
// 获取所有平台的信息
export function getAllTPlatform(url, param, data) {
  return request({
    url: '/platform/getAllTPlatform' + url,
    method: 'get',
    params: param,
    data
  })
}
// 获取所有学院，可选择是否获取学院所属的课程大类
export function getCollegeWithCourseKind(url, param, data) {
  return request({
    url: '/college/' + url,
    method: 'get',
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
