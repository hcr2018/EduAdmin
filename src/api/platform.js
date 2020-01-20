import request from '@/utils/request'
    //获取列表
export function queryPlatform(data) {
  return request({
    url: '/platform/',
    method: 'get',
    data
  })
}
    //添加

export function addPlatform(data) {
  return request({
    url: '/platform/addPlatform',
    method: 'post',
    data
  })
}

    //修改
export function updatePlatform(data) {
  return request({
    url: '/platform/updatePlatform/',
    method: 'put',
    data
  })
}

    //添加或者删除的单个工作人员
export function setPlatformWorker(data) {
  return request({
    url: '/platform/setPlatformWorker/',
    method: 'put',
    data
  })
}
    //直接重新设置的工作人员列表  
export function setNewPlatformWorks(data) {
  return request({
    url: '/platform/setNewPlatformWorks/',
    method: 'put',
    data
  })
}

    //获取的工作人员所在的校区 
export function getPlatformAboutWorkers(data) {
  return request({
    url: '/platform/getPlatformOfManager/',
    method: 'get',
    data
  })
}

    //获取的工作人员 
export function getPlatformWorkers(data) {
  return request({
    url: '/platform/getPlatformWorkers/',
    method: 'get',
    data
  })
}

    //设置的管理员
export function setPlatformMaster(data) {
  return request({
    url: '/platform/setPlatformMaster/',
    method: 'put',
    data
  })
}
    //   ----------------销售人员的客户数据--------------------- 
    // 获取客户信息列表

export function getWorkersCustomList(data) {
  return request({
    url: '/platform/getWorkersStudentList/',
    method: 'get',
    data
  })
}

    // 添加客户信息
export function addWorkersCustom(data) {
  return request({
    url: '/platform/addStudentOfWorker/',
    method: 'post',
    data
  })
}
    // 编辑客户信息
export function editWorkersCustom(data) {
  return request({
    url: '/platform/updateMyStudentComments/',
    method: 'put',
    data
  })
}
