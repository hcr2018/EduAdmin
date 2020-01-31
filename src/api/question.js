import request from '@/utils/request'
// 根据书获取数相关的题库列表
export function getQuestionOfBook(url, query, data) {
  return request({
    url: '/exercise/getListOfBookZhangJie' + url,
    method: 'get',
    params: query,
    data
  })
}
// 获取题的类型
export function getQuestionTypes(url, query, data) {
  return request({
    url: '/exercise/getExerciseKind' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加题的信息
export function addQuestion(url, query, data) {
  return request({
    url: '/exercise/addQuestion' + url,
    method: 'post',
    params: query,
    data
  })
}
// 修改题的信息
export function editQuestion(url, query, data) {
  return request({
    url: '/exercise/updateQuestion/' + url,
    method: 'put',
    params: query,
    data
  })
}
