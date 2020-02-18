/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = [
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'system',
    meta: { title: 'system', icon: 'skill' },
    children: [
      {
        path: 'setting',
        component: () => import('@/views/system/setting'),
        name: 'setting',
        meta: {
          title: 'system',
          icon: 'edit'

        }
      }
    ]
  },
  {
    path: '/platform',
    component: Layout,
    redirect: 'platform',
    alwaysShow: true, // will always show the root menu
    name: 'system',
    meta: { title: 'system', icon: 'skill' },
    children: [
      {
        path: 'platform',
        component: () => import('@/views/system/platform'),
        name: 'setPlatform',
        meta: {
          title: 'platform',
          icon: 'tree-table'
        }
      }
    ]
  },
  {
    path: '/manager',
    component: Layout,
    redirect: 'list',
    alwaysShow: true, // will always show the root menu
    name: 'managerList',
    meta: { title: 'system', icon: 'skill' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/system/managerlist'),
        name: 'managerList',
        meta: { title: 'managerList', icon: "user" }
      }
    ]
  }
]
export default systemRouter
