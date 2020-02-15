/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const courseRouter = {
  path: '/course',
  component: Layout,
  redirect: 'noRedirect',
  name: 'course',
  meta: {
    title: 'courseList',
    icon: 'education'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/course/courseList'),
      name: 'courseList',
      meta: { title: 'courseList',icon: 'documentation' }
    },
    {
      path: 'bookList',
      component: () => import('@/views/course/bookList'),
      name: 'bookList',
      meta: { title: 'bookList',icon:"book" }
    },
    {
      path: 'bookAdpter',
      component: () => import('@/views/course/addChapter'),
      name: 'bookAdpter',
      hidden: true,
      meta: { title: 'bookAdpter',icon:"book" }
    }

  ]
}
export default courseRouter
