import request from '@/utils/request'
  //获取所有班级
export function getAllClass(data) {
  return request({
    url: '/class',
    method: 'get',
    data
  })
} 
  //编辑班级的基本信息
export function editClassInfo(data) {
  return request({
    url: '/class/',
    method: 'put',
    data
  })
} 
  //添加班级的基本信息
export function addClassInfo(data) {
  return request({
    url: '/class',
    method: 'post',
    data
  })
} 
  // 获取某个班级的所有学员
export function getOneClass(data) {
  return request({
    url: '/class/',
    method: 'get',
    data
  })
} 
  // 添加班级的开班申请的资料
export function addClassOpenData(data) {
  return request({
    url: '/class/openClass/',
    method: 'post',
    data
  })
} 
  // 获取班级的开班申请的资料
export function getClassOpenData(data) {
  return request({
    url: '/class/getClassTeachers/',
    method: 'get',
    data
  })
} 
  // 根据月份获取班级的课程表
export function getTimeTableByMonth(data) {
  return request({
    url: '/class/getMonthClassDaily/',
    method: 'get',
    data
  })
} 
  // 添加班级的课程表
export function addTimeTableBy(data) {
  return request({
    url: '/class/addClassDaily/',
    method: 'post',
    data
  })
} 
  // 添加课程表对应的考勤数据
export function addTimeTag(data) {
  return request({
    url: '/class/addClassCheck/',
    method: 'post',
    data
  })
} 
  // 获取课程表对应的考勤数据
export function getTimeTag(data) {
  return request({
    url: '/class/getClassCheck/',
    method: 'get',
    data
  })
} 
  // 添加班级学生
export function addClassStu(data) {
  return request({
    url: '/class/addClassStudent/',
    method: 'post',
    data
  })
} 
  // 获取班级学生
export function getClassStu(data) {
  return request({
    url: '/class/getClassStudents/',
    method: 'get',
    data
  })
} 
  // 分发作业
export function handOutTask(data) {
  return request({
    url: '/class/sendStudentsExercise/',
    method: 'put',
    data
  })
} 
  // 获取分发记录-全班
export function getAllClassTaskRecord(data) {
  return request({
    url: '/class/getSendExerciseOfClassRecord/',
    method: 'get',
    data
  })
}  