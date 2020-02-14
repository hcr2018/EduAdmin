import request from '@/utils/request'
 
// 轮播图 ，url填banner，优秀教师url填teacher
export function GetIndexItem(url, query, data) {
  return request({
    url: '/website/getIndexItem/' + url,
    method: 'get',
    params: query,
    data
  })
}

