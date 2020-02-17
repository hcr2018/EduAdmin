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

// 章节练习-获取章节练习列表

export function getSubjectChapter(url, param, data) {
  return request({
    url: '/exercise/getChapters/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 组卷模考-获取组卷模考列表
export function getExamList(url, param, data) {
  return request({
    url: '/exercise/getExerciseByBookChapter/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 添加组卷

export function addExam(url, param, data) {
  return request({
    url: '/exercise?public=' + url,
    method: 'post',
    params: param,
    data
  })
}
// 编辑组卷
export function editExam(url, param, data) {
  return request({
    url: '/exercise/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 获取科目下的所有章组卷
export function getZhangOfSubject(url, param, data) {
  return request({
    url: '/exercise/getChapters/' + url,
    method: 'get',
    params: param,
    data
  })
} 
// 保存exam关联的题库
export function saveExamQuestions(url, param, data) {
  return request({
    url: '/exercise/linkQuestion2Exercise/' + url,
    method: 'post',
    params: param,
    data
  })
}
// 做题分析
// 获取做题错的较多的学生的数据
export function getDoWrongQuseStuList(url, param, data) {
  return request({
    url: '/exercise/getChpaterExerciseRecord/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 获取高频错题的数据
export function getTopWrongQuseList(url, param, data) {
  return request({
    url: '/exercise/getTopWrongNumQuestionByChapter/' + url,
    method: 'get',
    params: param,
    data
  })
}
