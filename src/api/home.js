import request from '@/utils/request'


 // 获取首页上的统计统计数据
 export function GetStudentDataFromAnalysis(days) {
  return request({
    url: '/home/getStudentDataFromAnalysis/'+days,
    method: 'get' 
  })
}

export function GetStudentDataTrackAnalysis(days) {
  return request({
    url: '/home/getStudentDataTrackAnalysis/'+days,
    method: 'get'
  })
}
 