import request from '@/utils/request'

export function fetchList(url, param, data) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: param,
    data
  })
}

export function fetchArticle(url, param, data) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: param,
    data
  })
}

export function fetchPv(url, param, data) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: param,
    data
  })
}

export function createArticle(url, param, data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    params: param,
    data
  })
}

export function updateArticle(url, param, data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    params: param,
    data
  })
}
