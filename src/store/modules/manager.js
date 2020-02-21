import { login, getInfo } from '@/api/manager'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router' 

const state = {
  token: getToken(),
  manager: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_MANAGER: (state, data) => {
    state.manager = data
  }
}

const actions = {
  // user login
  login({ commit,dispatch }, userInfo) {
    const { tel, password } = userInfo
    return new Promise((resolve, reject) => {
      login('', '', { tel: tel.trim(), password: password }).then(response => {
        commit('SET_MANAGER', response.data)
        commit('SET_TOKEN', response.title)
        setToken(response.title) 
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  // // get user info
  getInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo("", "", "").then(response => {
        commit('SET_MANAGER', response.data)
        commit('SET_TOKEN', response.title)
        setToken(response.title)
        dispatch('app/getPlatformList', null, { root: true })
        dispatch('app/getCollegeWithCourseKind', null, { root: true })
        // dispatch('app/getAllCourseKind', null, { root: true })
  
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_MANAGER', {})
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_MANAGER', {})
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
