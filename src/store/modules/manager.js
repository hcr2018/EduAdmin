import { login,getInfo } from '@/api/manager'
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
  login({ commit }, userInfo) {
    const { tel, password } = userInfo
    return new Promise((resolve, reject) => {
      login('', '', { tel: tel.trim(), password: password }).then(response => {
        commit('SET_MANAGER', response.data) 
        commit('SET_TOKEN', response.title) 
        setToken(response.title)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo("","","").then(response => { 
        commit('SET_MANAGER', response.data) 
        commit('SET_TOKEN', response.title) 
        resolve()
      }).catch(error => {
        reject(error)
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

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      console.log("--------------------------resetToken");
      commit('SET_TOKEN', '') 
      commit('SET_MANAGER',{}) 
      removeToken()
      resolve()
    })
  },

  // // dynamically modify permissions
  // changeRoles({ commit, dispatch }, role) {
  //   return new Promise(async resolve => {
  //     const token = role + '-token'

  //     commit('SET_TOKEN', token)
  //     setToken(token)

  //     const { roles } = await dispatch('getInfo')

  //     resetRouter()

  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)

  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })

  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
