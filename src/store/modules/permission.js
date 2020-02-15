import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '@/store'
/**
 * Use meta.role to determine if the current user has permission
 * @param role
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param role
 */
export function filterAsyncRoutes(routes, role) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(async resolve => {
      if (!store.getters.manager.tel) {
        await store.dispatch('manager/getInfo')
      }
      let accessedRoutes
      if (store.getters.manager.role == 1) {
        // 分校工作员
        accessedRoutes = asyncRoutes || []
      } else {
        // 管理员
        accessedRoutes = filterAsyncRoutes(asyncRoutes, store.getters.manager.role)
      }
      const topPlatformRoute = {
        path: '/platform',
        component: Layout,
        redirect: 'noRedirect',
        alwaysShow: true,
        name: 'platform',
        meta: {
          title: 'platform',
          icon: 'nested'
        },
        children: [
        ]
      }
      let myPlatformList = store.getters.manager.myPlatformList;
      if (myPlatformList) {
        let index = 0;
        myPlatformList.forEach(platform => {
          index++;
          const platformRoute = {
            path: 'list/' + index,// platform.Id,
            component: () => import('@/views/platform/classList'), // Parent router-view
            name: platform.Id,
            meta: { title: platform.Label, icon: "platform" },
            children: [
              {
                path: 'website',// platform.Id,
                component: () => import('@/views/platform/classList'), // Parent router-view
                name: platform.Id,
                meta: { title: "本校官网", icon: "platform" }
              },
              {
                path: 'teacher',// platform.Id,
                component: () => import('@/views/platform/classList'), // Parent router-view
                name: platform.Id,
                meta: { title: "本校员工", icon: "platform" }
              }
              ,
              {
                path: 'student',// platform.Id,
                component: () => import('@/views/platform/classList'), // Parent router-view
                name: platform.Id,
                meta: { title: "本校学员", icon: "platform" }
              }
            ]
          }
          topPlatformRoute.children.push(platformRoute)
        })
      }
      accessedRoutes.push(topPlatformRoute)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
