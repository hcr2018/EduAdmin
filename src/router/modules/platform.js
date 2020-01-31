/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const platformRouter = {
  path: '/platform',
  component: Layout,
  redirect: 'noRedirect',
  name: 'platform',
  meta: {
    title: 'platform',
    icon: 'nested'
  },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/platform/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: 'menu1' }
    },
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/platform/index'),
      meta: { title: 'menu2' }
    }
  ]
}

export default platformRouter
