import request from '@/utils/request'
//   ----------------告警提醒 相关操作---------------------
// 获取提醒列表
export function getAlarmList(url, query, data) {
  return request({
    url: '/alarm/getMYAlarms/all',
    method: 'get',
    params: query,
    data
  })
}
// 添加提醒
export function addAlarm(url, query, data) {
  return request({
    url: '/alarm/addAlarm',
    method: 'post',
    params: query,
    data
  })
}
// 获取单条提醒提示
export function getSingleAlarm(url, query, data) {
  return request({
    url: '/alarm/checkAlarm',
    method: 'get',
    params: query,
    data
  })
}
// 将提醒设置为已处理
export function handleAlarm(url, query, data) {
  return request({
    url: '/alarm/closeAlarm/',
    method: 'put',
    params: query,
    data
  })
}
