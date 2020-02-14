import request from '@/utils/request'
// 获取新闻列表
export function getNewsList(url, param, data) {
  return request({
    url: '/news/getNewsest'+url,
    method: 'get',
    params: param,
    data
  })
}
// 删除单条新闻数据
export function deleNewsRow(url, param, data) {
  return request({
    url: '/news/'+url,
    method: 'delete',
    params: param,
    data
  })
}
// 编辑单条新闻数据
export function editNewsRow(url, param, data) {
  return request({
    url: '/news/updateNews/'+url,
    method: 'put',
    params: param,
    data
  })
}
// 添加单条新闻数据
export function addNewsRow(url, param, data) {
  return request({
    url: '/news'+url,
    method: 'post',
    params: param,
    data
  })
}
