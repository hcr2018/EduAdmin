import request from '@/utils/request'

// 获取课程列表-查询课程名称获取
export function getCourseList(url, param, data) {
  return request({
    url: '/course' + url,
    method: 'get',
    params: param,
    data
  })
} 

// 获取课程大类
export function GetCourseOfKind(url, param, data) {
  return request({
    url: '/course/getCourseOfKind' + url,
    method: 'get',
    params: param,
    data
  })
} 

// 设置课程是否上架
export function setCourseUpperShelf(url, param, data) {
  return request({
    url: '/course/setOpen/' + url,
    method: 'put',
    params: param,
    data
  })
} 
// 添加课程

export function addCourse(url, param, data) {
  return request({
    url: '/course' + url,
    method: 'post',
    params: param,
    data
  })
} 
// 编辑课程
export function editCourse(url, param, data) {
  return request({
    url: '/course/' + url,
    method: 'put',
    params: param,
    data
  })
} 
// 根据课程获取科目
export function GetSubjectByCourse(url, param, data) {
  return request({
    url: '/coursebook/getCourseBookByCourse/' + url,
    method: 'get',
    params: param,
    data
  })
} 
// 获取课程的宣传资料
export function getCourseTravelBrochure(url, param, data) {
  return request({
    url: '/course/getCourseShowInfo/' + url,
    method: 'get',
    params: param,
    data
  })
} 
// 修改课程的宣传资料
export function updateCourseTravelBrochure(url, param, data) {
  return request({
    url: '/course/updateCourseShowInfo/' + url,
    method: 'put',
    params: param,
    data
  })
} 
// 获取课程价格列表
export function getCoursePriceList(url, param, data) {
  return request({
    url: '/coursebook/getByCourse/' + url,
    method: 'get',
    params: param,
    data
  })
} 
// 保存课程价格列表
export function saveCoursePriceList(url, param, data) {
  return request({
    url: '/coursebook/addCoursePrice' + url,
    method: 'post',
    params: param,
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
// 获取科目下的所有题库
export function getQuestionsOfSubject(url, param, data) {
  return request({
    url: '/exercise/getListOfBookZhangJie' + url,
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
