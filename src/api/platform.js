import request from '@/utils/request'
// 获取列表
export function queryPlatform(url, query, data) {
  return request({
    url: '/platform/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加

export function addPlatform(url, query, data) {
  return request({
    url: '/platform/addPlatform' + url,
    method: 'post',
    params: query,
    data
  })
}

// 修改
export function updatePlatform(url, query, data) {
  return request({
    url: '/platform/updatePlatform/' + url,
    method: 'put',
    params: query,
    data
  })
}

// 添加或者删除的单个工作人员
export function setPlatformWorker(url, query, data) {
  return request({
    url: '/platform/setPlatformWorker/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 直接重新设置的工作人员列表
export function setNewPlatformWorks(url, query, data) {
  return request({
    url: '/platform/setNewPlatformWorks/' + url,
    method: 'put',
    params: query,
    data
  })
}

// 获取的工作人员所在的校区
export function getPlatformAboutWorkers(url, query, data) {
  return request({
    url: '/platform/getPlatformOfManager/' + url,
    method: 'get',
    params: query,
    data
  })
}

// 获取的工作人员
export function getPlatformWorkers(url, query, data) {
  return request({
    url: '/platform/getPlatformWorkers/' + url,
    method: 'get',
    params: query,
    data
  })
}

// 获取的某个校区的所有工作人员
export function getAllManagerOfPlatform(url, query, data) {
  return request({
    url: '/platform/getAllManagerOfPlatform/' + url,
    method: 'get',
    params: query,
    data
  })
}


// 设置的管理员
export function setPlatformMaster(url, query, data) {
  return request({
    url: '/platform/setPlatformMaster/' + url,
    method: 'put',
    params: query,
    data
  })
}
//   ----------------销售人员的客户数据---------------------
// 获取客户信息列表

export function getWorkersCustomList(url, query, data) {
  return request({
    url: '/platform/getWorkersStudentList/' + url,
    method: 'get',
    params: query,
    data
  })
}

// 添加客户信息
export function addWorkersCustom(url, query, data) {
  return request({
    url: '/platform/addStudentOfWorker/' + url,
    method: 'post',
    params: query,
    data
  })
}
// 编辑客户信息
export function editWorkersCustom(url, query, data) {
  return request({
    url: '/platform/updateMyStudentComments/' + url,
    method: 'put',
    params: query,
    data
  })
}

// 获取所有平台的信息
export function getAllTPlatform(url, param, data) {
  return request({
    url: '/platform/getAllTPlatform' + url,
    method: 'get',
    params: param,
    data
  })
}