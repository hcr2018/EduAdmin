import request from '@/utils/request'

// 获取课程列表-查询课程名称获取
export function getCourseList(data) {
  return request({
    url: '/course',
    method: 'get',
    data
  })
} 

// 获取课程大类
export function GetCourseOfKind(data) {
  return request({
    url: '/course/getCourseOfKind',
    method: 'get',
    data
  })
} 

// 设置课程是否上架
export function setCourseUpperShelf(data) {
  return request({
    url: '/course/setOpen/',
    method: 'put',
    data
  })
} 
// 添加课程

export function addCourse(data) {
  return request({
    url: '/course',
    method: 'post',
    data
  })
} 
// 编辑课程
export function editCourse(data) {
  return request({
    url: '/course/',
    method: 'put',
    data
  })
} 
// 根据课程获取科目
export function GetSubjectByCourse(data) {
  return request({
    url: '/coursebook/getCourseBookByCourse/',
    method: 'get',
    data
  })
} 
// 获取课程的宣传资料
export function getCourseTravelBrochure(data) {
  return request({
    url: '/course/getCourseShowInfo/',
    method: 'get',
    data
  })
} 
// 修改课程的宣传资料
export function updateCourseTravelBrochure(data) {
  return request({
    url: '/course/updateCourseShowInfo/',
    method: 'put',
    data
  })
} 
// 获取课程价格列表
export function getCoursePriceList(data) {
  return request({
    url: '/coursebook/getByCourse/',
    method: 'get',
    data
  })
} 
// 保存课程价格列表
export function saveCoursePriceList(data) {
  return request({
    url: '/coursebook/addCoursePrice',
    method: 'post',
    data
  })
} 
// 章节练习-获取章节练习列表

export function getSubjectChapter(data) {
  return request({
    url: '/exercise/getChapters/',
    method: 'get',
    data
  })
} 
// 组卷模考-获取组卷模考列表
export function getExamList(data) {
  return request({
    url: '/exercise/getExerciseByBookChapter/',
    method: 'get',
    data
  })
} 
// 添加组卷

export function addExam(data) {
  return request({
    url: '/exercise?public=',
    method: 'post',
    data
  })
} 
// 编辑组卷
export function editExam(data) {
  return request({
    url: '/exercise/',
    method: 'put',
    data
  })
} 
// 获取科目下的所有章组卷
export function getZhangOfSubject(data) {
  return request({
    url: '/exercise/getChapters/',
    method: 'get',
    data
  })
} 
// 获取科目下的所有题库
export function getQuestionsOfSubject(data) {
  return request({
    url: '/exercise/getListOfBookZhangJie',
    method: 'get',
    data
  })
} 
// 保存exam关联的题库
export function saveExamQuestions(data) {
  return request({
    url: '/exercise/linkQuestion2Exercise/',
    method: 'post',
    data
  })
} 
// 做题分析
// 获取做题错的较多的学生的数据
export function getDoWrongQuseStuList(data) {
  return request({
    url: '/exercise/getChpaterExerciseRecord/',
    method: 'get',
    data
  })
} 
 // 获取高频错题的数据
export function getTopWrongQuseList(data) {
  return request({
    url: '/exercise/getTopWrongNumQuestionByChapter/',
    method: 'get',
    data
  })
}  