import request from '@/utils/request'
    // 获取新闻列表
export function getNewsList(data) {
  return request({
    url: '/news/getNewsest',
    method: 'get',
    data
  })
}
    // 删除单条新闻数据
export function deleNewsRow(token) {
  return request({
    url: '/news/',
    method: 'delete',
    params: { token }
  })
}
    // 编辑单条新闻数据
export function editNewsRow() {
  return request({
    url: '/news/updateNews/',
    method: 'post'
  })
}
 // 添加单条新闻数据
export function addNewsRow() {
  return request({
    url: '/news',
    method: 'post'
  })
}
