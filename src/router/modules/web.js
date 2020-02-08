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
      path: 'docDownload',
      name: 'docDownload',
      component: () => import('@/views/web/news'),
      meta: { title: 'docDownload' }
    },
    {
      path: 'news',
      name: 'newsList',
      component: () => import('@/views/web/news'),
      meta: { title: 'news' }
    },
    {
      path: 'race',
      name: 'race',
      component: () => import('@/views/web/news'),
      meta: { title: 'race' }
    },
    {
      path: 'teacher',
      name: 'teacher',
      component: () => import('@/views/web/news'),
      meta: { title: 'teacher' }
    }
  ]
}

export default webRouter
