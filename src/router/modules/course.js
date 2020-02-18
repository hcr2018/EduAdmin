/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const courseRouter =
{
  path: '/course',
  component: Layout,
  redirect: '/courseList',
  children: [
    {
      path: 'courseList',
      component: () => import('@/views/course/courseList'),
      name: 'course',
      meta: { title: 'courseList', icon: 'education' }
    }
  ]
}
export default courseRouter
