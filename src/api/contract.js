import request from '@/utils/request'
//   ----------------客户-合同相关操作--------------------- 
    // 获取合同列表
export function getContractList() {
  return request({
    url:  "/contract/getContractList/",
    method: 'get'
  })
}
    // 获取客户的合同数据
export function getCustomContract() {
  return request({
    url: "/contract/getContractByStudent/",
    method: 'get'
  })
}
    // 添加客户合同 
export function addCustomContract() {
  return request({
    url: "/contract/addContract",
    method: 'post'
  })
}
    // 删除客户合同 
export function deleCustomContract() {
  return request({
    url: "/contract/deleteContract/" ,
    method: 'delete'
  })
}
    // 更新客户合同 
export function updateCustomContract() {
  return request({
    url: "/contract/update/",
    method: 'put'
  })
}