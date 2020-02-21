import request from '@/utils/request'

// 获取所有学院，可选择是否获取学院所属的课程大类
export function getCollegeWithCourseKind(url, param, data) {
  return request({
    url: '/college/' + url,
    method: 'get',
    params: param,
    data
  })
}

// 修改
export function updateCollege(url, param, data) {
  return request({
    url: '/college/' + url,
    method: 'put',
    params: param,
    data
  })
}
