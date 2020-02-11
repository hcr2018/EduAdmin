import request from '@/utils/request'
// 获取指定大类的科目列表
export function queryBookList(url, param, data) {
  return request({
    url: '/book' + url,
    method: 'get',
    params: param,
    data
  })
}

// 添加大类的科目数据
export function addBook(url, param, data) {
  return request({
    url: '/book' + url,
    method: 'post',
    params: param,
    data
  })
}

// 编辑大类的科目数据
export function editBook(url, param, data) {
  return request({
    url: '/book/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 获取书章节知识点的视频
export function getBookVideo(url, param, data) {
  return request({
    url: '/book/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 添加书章节知识点的视频
export function editBookVideo(url, param, data) {
  return request({
    url: '/topic/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 编辑书章节知识点的视频
export function addBookVideo(url, param, data) {
  return request({
    url: '/book/' + url,
    method: 'post',
    params: param,
    data
  })
}
// 批量删除书章节知识点的视频
export function deleBookVideo(url, param, data) {
  return request({
    url: '/topic/batchDelete' + url,
    method: 'delete',
    params: param,
    data
  })
}
// 生成书的章节知识点结构
export function createBookStructure(url, param, data) {
  return request({
    url: '/book/updateContent/' + url,
    method: 'put',
    params: param,
    data
  })
}
