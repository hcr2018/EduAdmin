import request from '@/utils/request'
 //获取指定大类的科目列表
export function queryBookList(data) {
  return request({
    url: '/book',
    method: 'get',
    data
  })
} 

  //添加大类的科目数据
export function addBook(data) {
  return request({
    url: '/book',
    method: 'post',
    data
  })
} 

  //编辑大类的科目数据
export function editBook(data) {
  return request({
    url: '/book/',
    method: 'put',
    data
  })
} 
  //获取书章节知识点的视频
export function getBookVideo(data) {
  return request({
    url: '/book/',
    method: 'get',
    data
  })
} 
  //添加书章节知识点的视频
export function editBookVideo(data) {
  return request({
    url: '/topic/',
    method: 'put',
    data
  })
} 
  //编辑书章节知识点的视频
export function addBookVideo(data) {
  return request({
    url: '/book/',
    method: 'post',
    data
  })
} 
  //批量删除书章节知识点的视频
export function deleBookVideo(data) {
  return request({
    url: '/topic/batchDelete',
    method: 'delete',
    data
  })
} 
  //生成书的章节知识点结构
export function createBookStructure(data) {
  return request({
    url: '/book/updateContent/',
    method: 'put',
    data
  })
}  