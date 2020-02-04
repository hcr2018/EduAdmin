import request from '@/utils/request'
//   ----------------客户-合同相关操作---------------------
// 获取合同列表
export function getContractList(url, query, data) {
  return request({
    url: '/contract/getContractList/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 获取客户的合同数据
export function getCustomContract(url, query, data) {
  return request({
    url: '/contract/getContractByStudent/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加客户合同
export function addCustomContract(url, query, data) {
  return request({
    url: '/contract/addContract' + url,
    method: 'post',
    params: query,
    data
  })
}
// 删除客户合同
export function deleCustomContract(url, query, data) {
  return request({
    url: '/contract/deleteContract/' + url,
    method: 'delete',
    params: query,
    data
  })
}
// 更新客户合同
export function updateCustomContract(url, query, data) {
  return request({
    url: '/contract/update/' + url,
    method: 'put',
    params: query,
    data
  })
}
