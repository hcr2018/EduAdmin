/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const managerRouter = {
  path: '/manager',
  component: Layout,
  redirect: 'noRedirect',
  name: 'manager',
  meta: {
    title: 'managerList',
    icon: 'people'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/manager/list'),
      name: 'managerList',
      meta: { title: 'managerList',icon:"user" }
    } 

  ]
}
export default managerRouter
