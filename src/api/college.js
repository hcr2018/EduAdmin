import request from '@/utils/request'

// 获取所有学院，可选择是否获取学院所属的课程类别
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
    url: '/college/updateCollege/' + url,
    method: 'put',
    params: param,
    data
  })
}

// 添加
export function addCollege(url, param, data) {
  return request({
    url: '/college/addCollege' + url,
    method: 'post',
    params: param,
    data
  })
}
