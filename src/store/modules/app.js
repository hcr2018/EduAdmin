import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import manager from './manager'
import { getCollegeWithCourseKind } from '@/api/college'
import { getAllTPlatform } from '@/api/platform'
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  platformList: [],//所有的平台列表
  collegeWithCourseKind: [],//
  myPlatformList: []// 当前登录用户能操作的平台列表
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
  SET_MYPLATFORMLIST: (state, data) => {
    state.myPlatformList = data
  },
  PUSH_PLATFORM: (state, newItem) => {
    let hasIn = false;
    state.platformList.forEach(item => {
      if (item.Id === newItem.Id) {
        item = newItem;
        hasIn = true;
        return
      }
    })
    if (hasIn == false) {
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
        commit('SET_PLATFORMLIST', response.data); 
        //下面计算出 只有自己负责的校区列表。
        let IHasPlatforms = manager.state.manager.Platform.split(",");
        let platfromlistTemp = [];
        IHasPlatforms.forEach(IHasPlatfrom => {
          if (IHasPlatfrom == "0") {
            platfromlistTemp = state.platformList;
          } else {
            state.platformList.forEach(PlatformItem => {
              if (PlatformItem.Id == IHasPlatfrom) {
                platfromlistTemp.push(PlatformItem);
              }
            });
          }
          commit('SET_MYPLATFORMLIST', platfromlistTemp)
        });
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // getPlatformList
  getCollegeWithCourseKind({ commit }) {
    return new Promise((resolve, reject) => {
      getCollegeWithCourseKind('', { "include": 1 }, '').then(response => {
        commit('SET_COLLEGEWITHCOURSEKIND', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  pushPlatform({ commit }, data) {
    commit('PUSH_PLATFORM', data)
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
