/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const customRouter = {
  path: '/custom',
  component: Layout,
  redirect: 'noRedirect',
  name: 'custom',
  meta: {
    title: 'customList',
    icon: 'table'
    
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/custom/customList'),
      name: 'customList',
      meta: {
        title: 'customList'
        
      }
    },
    {
      path: 'trackList',
      component: () => import('@/views/custom/trackList'),
      name: 'trackList',
      meta: {
        title: 'trackList'
        
      }
    },
    {
      path: 'sendSMS',
      component: () => import('@/views/business/sendSMS'),
      name: 'sendSMS',
      meta: {
        title: 'sendSMS',
        icon: 'lock'
        
        // if do not set roles, means: this page does not require permission
      }
    }

  ]
}
export default customRouter
