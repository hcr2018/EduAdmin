/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const customRouter = {
  path: '/custom',
  component: Layout,
  redirect: 'noRedirect',
  name: 'custom',
  meta: {
    title: 'customManage',
    icon: 'peoples'
    , roles: [ 0]
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/custom/customList'),
      name: 'customList',
      meta: {
        title: 'customList',
        icon: 'student'

      }
    },
    {
      path: 'trackList',
      component: () => import('@/views/custom/trackList'),
      name: 'trackList',
      meta: {
        title: 'trackList',
        icon: 'zuji'

      }
    },
    {
      path: 'contractList',
      component: () => import('@/views/custom/contractList'),
      name: 'contractList',
      meta: {
        title: 'contractList',
        icon: 'contract'

      }
    },
    {
      path: 'sendSMS',
      component: () => import('@/views/business/sendSMS'),
      name: 'sendSMS',
      meta: {
        title: 'sendSMS',
        icon: 'email'
      }
    }

  ]
}
export default customRouter
