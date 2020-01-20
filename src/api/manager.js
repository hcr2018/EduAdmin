import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/manager/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/manager/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/manager/logout',
    method: 'post'
  })
}

//-----------------------------
export function getManagerList() {
  return request({
    url: '/manager',
    method: 'get'
  })
}
export function getLoginPhoneCode() {
  return request({
    url: '/manager/captcha',
    method: 'post',
    data
  })
}
export function editManager() {
  return request({
    url: '/manager/',
    method: 'put'
  })
}
export function addManager() {
  return request({
    url: '/manager',
    method: 'post'
  })
}
export function setStateManager() {
  return request({
    url: '/manager/setState/',
    method: 'put'
  })
}
export function resetPasswordManager() {
  return request({
    url: '/manager/resetpswd/',
    method: 'put'
  })
}
export function setTeachBook() {
  return request({
    url: '/manager/setTeachBook/',
    method: 'put'
  })
}
export function getTeachBook() {
  return request({
    url: '/manager/getTeachBook/',
    method: 'get'
  })
}
export function getManagerRight() {
  return request({
    url: '/manager/getRight/withLabel/',
    method: 'get'
  })
}
export function setManagerRight() {
  return request({
    url: '/manager/setRight/',
    method: 'put'
  })
}
export function getAllTeacher() {
  return request({
    url: '/manager/',
    method: 'get'
  })
}
export function getPlatformTeacher() {
  return request({
    url: '/manager/samePlatfromWorkers/mine',
    method: 'get'
  })
}