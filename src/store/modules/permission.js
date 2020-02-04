import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
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
  generateRoutes({ commit }, managerdata) {
    return new Promise(resolve => {
      let accessedRoutes
      if (managerdata.role == 1) {
        // 分校工作员
        accessedRoutes = asyncRoutes || []
      } else {
        // 管理员
        accessedRoutes = filterAsyncRoutes(asyncRoutes, managerdata.role)
      }

      const topPlatformRoute = {
        path: '/platform',
        component: Layout,
        redirect: 'noRedirect',
        name: 'platform',
        meta: {
          title: 'platform',
          icon: 'nested'
        },
        children: []
      }

      managerdata.myPlatformList.forEach(platform => {
        const platformRoute = {
          path: 'list/' + platform.Id,
          component: () => import('@/views/platform/index'), // Parent router-view
          name: platform.Label,
          meta: { title: platform.Label }
        }
        topPlatformRoute.children.push(platformRoute)
      })
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
