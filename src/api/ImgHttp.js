import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 创建一个axios的实例
const instanceImg = axios.create({})
//请求验证拦截器
instanceImg.interceptors.request.use(config => {
    instanceImg.defaults.headers.post['Content-Type'] = 'application/json';
    // 全局配置默认路径
    config.baseURL = '/api'
    config.headers = {}
    if (store.getters.token) {
        config.headers['token'] = store.getters.token
    } else {
        config.headers['token'] = getToken()
    }
    return config;
});
//返回数据拦截器
instanceImg.interceptors.response.use(res => {
    if (res.data.code == 200) {
        return res.data;
    }
    return res.data
});
// 请求方法封装
export default async (methods, url, file, config = { "Content-Type": "multipart/form-data;" }) => {
    let formData = new FormData()
    formData.append("file", file);
    config.headers = {}
    if (store.getters.token) {
        config.headers['token'] = store.getters.token
    } else {
        config.headers['token'] = getToken()
    }
    let response = {}
    // 上传图片 
    try {
        response = await instanceImg[methods](url, formData, config)
    } catch (err) {
        response = err
    }
    return response;
}
