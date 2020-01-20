import request from '@/utils/request'
// 根据书获取数相关的题库列表
export function getQuestionOfBook(data) {
  return request({
    url: '/exercise/getListOfBookZhangJie',
    method: 'get',
    data
  })
}
// 获取题的类型
export function getQuestionTypes(token) {
  return request({
    url: '/exercise/getExerciseKind',
    method: 'get',
    params: { token }
  })
}
// 添加题的信息
export function addQuestion() {
  return request({
    url: '/exercise/addQuestion',
    method: 'post'
  })
}
// 修改题的信息
export function editQuestion() {
  return request({
    url: '/exercise/updateQuestion/',
    method: 'put'
  })
}
