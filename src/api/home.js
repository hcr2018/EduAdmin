import request from '@/utils/request'

// 获取首页上的统计统计数据
export function GetStudentDataFromAnalysis(url, query, data) {
  return request({
    url: '/home/getStudentDataFromAnalysis/' + url,
    method: 'get',
    params: query,
    data
  })
}

export function GetStudentDataTrackAnalysis(url, query, data) {
  return request({
    url: '/home/getStudentDataTrackAnalysis/' + url,
    method: 'get',
    params: query,
    data
  })
}
 
