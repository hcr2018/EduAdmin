/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const webRouter = {
  path: '/web',
  component: Layout,
  redirect: 'noRedirect',
  name: 'web',
  meta: {
    title: 'web',
    icon: 'international'
  },
  children: [
    {
      path: 'banner',
      component: () => import('@/views/web/banner'), // Parent router-view
      name: 'banner',
      meta: { title: 'banner',icon:"website" }
    },
    {
      path: 'docDownload',
      name: 'docDownload',
      component: () => import('@/views/web/docDownload'),
      meta: { title: 'docDownload' ,icon:"download"}
    },
    {
      path: 'news',
      name: 'newsList',
      component: () => import('@/views/web/news'),
      meta: { title: 'news' ,icon:"guide"}
    },
    {
      path: 'jingsai',
      name: 'jingsai',
      component: () => import('@/views/web/jingsai'),
      meta: { title: 'jingsai',icon:"guide" }
    },
    {
      path: 'teacher',
      name: 'teacher',
      component: () => import('@/views/web/teacher'),
      meta: { title: 'teacher' ,icon:"guide"}
    }
  ]
}

export default webRouter
