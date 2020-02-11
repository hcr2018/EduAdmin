import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import { getAllTPlatform, getCollegeWithCourseKind, getAllCourseKind } from '@/api/app'
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  platformList: [],
  collegeWithCourseKind: [],
  courseKind: []
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_PLATFORMLIST: (state, data) => {
    state.platformList = data
  },
  SET_COLLEGEWITHCOURSEKIND: (state, data) => {
    state.collegeWithCourseKind = data
  },
  SET_COURSEKIND: (state, data) => {
    state.courseKind = data
  },
  PUSH_PLATFORM:(state,newItem)=>{
    let hasIn = false;
    state.platformList.forEach(item=>{
      if (item.Id ===newItem.Id ){
        item = newItem; 
        hasIn = true;
        return
      }
    })
    if (hasIn == false){
      state.platformList.push(newItem);
    }
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  // getPlatformList
  getPlatformList({ commit }) {
    return new Promise((resolve, reject) => {
      getAllTPlatform('', '', '').then(response => { 
        commit('SET_PLATFORMLIST', response.data) 
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // getPlatformList
  getCollegeWithCourseKind({ commit }) {
    return new Promise((resolve, reject) => {

      getCollegeWithCourseKind('', {"include":1}, '').then(response => {
        commit('SET_COLLEGEWITHCOURSEKIND', response.data)
        resolve()
      }).catch(error => {
        rr
        reject(error)
      })
    })
  },
  // getPlatformList
  getAllCourseKind({ commit }) {
    return new Promise((resolve, reject) => {
      getAllCourseKind('', '', '').then(response => {
        commit('SET_COURSEKIND', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
   // setPlatformList
   pushPlatform({ commit },newItem) { 
    commit('PUSH_PLATFORM', newItem)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
