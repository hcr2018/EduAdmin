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
      // const topPlatformRoute = {
      //   path: '/platform',
      //   component: Layout,
      //   redirect: 'noRedirect',
      //   alwaysShow: true,
      //   name: 'platform',
      //   meta: {
      //     title: 'platform',
      //     icon: 'nested'
      //   },
      //   children: [
      //   ]
      // }
      let myPlatformList = store.getters.manager.myPlatformList;
      if (myPlatformList) {
        let index = 0;
        myPlatformList.forEach(platform => {
          index++;
          const platformRoute = {
            path: '/platform' + index.toString(10),// platform.Id,
            redirect: 'noRedirect',
            component: Layout,
            name: platform.Id,
            meta: { title: platform.Label, icon: "platform" },
            children: [
              {
                path: 'web',
                redirect: 'noRedirect',
                name: 'web'+index.toString(10),
                meta: { title: 'web', icon: "website" },
                children: [
                  {
                    path: 'banner',
                    component: () => import('@/views/web/banner'), // Parent router-view
                    name: 'banner' + index.toString(10),
                    meta: { title: 'banner', icon: "website" }
                  },
                  {
                    path: 'docDownload',
                    name: 'docDownload' + index.toString(10),
                    component: () => import('@/views/web/docDownload'),
                    meta: { title: 'docDownload', icon: "guide" }
                  },
                  {
                    path: 'news',
                    name: 'newsList' + index.toString(10),
                    component: () => import('@/views/web/news'),
                    meta: { title: 'news', icon: "guide" }
                  },
                  {
                    path: 'jingsai',
                    name: 'jingsai' + index.toString(10),
                    component: () => import('@/views/web/jingsai'),
                    meta: { title: 'jingsai', icon: "guide" }
                  },
                  {
                    path: 'teacher',
                    name: 'teacher' + index.toString(10),
                    component: () => import('@/views/web/teacher'),
                    meta: { title: 'teacher', icon: "guide" }
                  }
                ]
              },
              {
                path: 'managers',
                component: () => import('@/views/system/managerlist'),
                name: 'managerList' + index.toString(10),
                meta: { title: 'managerList', icon: "user" }
              }
              ,
              {
                path: 'list',
                component: () => import('@/views/custom/customList'),
                name: 'customList' + index.toString(10),
                meta: { title: 'customList', icon: 'student' }
              },
              {
                path: 'classList',// platform.Id,
                component: () => import('@/views/platform/classList'), // Parent router-view
                name: "classList" + index.toString(10),
                meta: { title: "classList", icon: "platform" }
              },
              {
                path: 'contractList',
                component: () => import('@/views/custom/contractList'),
                name: 'contractList' + index.toString(10),
                meta: { title: 'contractList', icon: 'contract' }
              }
            ]
          }
          accessedRoutes.push(platformRoute)
        })
      }
      // accessedRoutes.push(topPlatformRoute)
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
