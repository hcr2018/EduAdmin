import request from '@/utils/request'
    //   ----------------告警提醒 相关操作--------------------- 
    // 获取提醒列表
export function getAlarmList(data) {
  return request({
    url: '/alarm/getMYAlarms/all',
    method: 'get',
    data
  })
} 
    // 添加提醒
export function addAlarm(data) {
  return request({
    url: '/alarm/addAlarm',
    method: 'post',
    data
  })
} 
    // 获取单条提醒提示
export function getSingleAlarm(data) {
  return request({
    url: '/alarm/checkAlarm',
    method: 'get',
    data
  })
}  
    // 将提醒设置为已处理
    export function handleAlarm(data) {
      return request({
        url: '/alarm/closeAlarm/',
        method: 'put',
        data
      })
    }  