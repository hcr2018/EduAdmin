import request from '@/utils/request'
    // 获取所有平台的信息
export function getPlatform(data) {
  return request({
    url: '/platform/getAllTPlatform',
    method: 'get',
    data
  })
} 
    //获取所有学院，可选择是否获取学院所属的课程大类
export function getCollegeWithCourseKind(data) {
  return request({
    url: '/college/',
    method: 'get',
    data
  })
} 
    //绕开学院，直接获取所有课程大类列表
export function getAllCourseKind(data) {
  return request({
    url: '/course_kind/getAllCourseKind',
    method: 'get',
    data
  })
}  