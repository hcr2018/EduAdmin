/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const managerRouter = {
  path: '/manager',
  component: Layout,
  redirect: 'noRedirect',
  name: 'manager',
  meta: {
    title: 'managerList',
    icon: 'table'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/manager/list'),
      name: 'managerList',
      meta: { title: 'managerList' }
    },
    {
      path: 'logs',
      component: () => import('@/views/manager/logs'),
      name: 'managerLogs',
      meta: { title: 'managerLogs' }
    }

  ]
}
export default managerRouter
