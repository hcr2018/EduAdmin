/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const webRouter = {
  path: '/web',
  component: Layout,
  redirect: 'noRedirect',
  name: 'web',
  meta: {
    title: 'web',
    icon: 'nested'
  },
  children: [
    {
      path: 'webIndex',
      component: () => import('@/views/web/index'), // Parent router-view
      name: 'webIndex',
      meta: { title: 'webIndex' }
    },
    {
      path: 'webOther',
      name: 'webOther',
      component: () => import('@/views/web/other'),
      meta: { title: 'webOther' }
    }
  ]
}

export default webRouter
