/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const customRouter = {
  path: '/custom',
  component: Layout,
  redirect: 'noRedirect',
  name: 'customList',
  meta: {
    title: 'customList',
    icon: 'table'
  },
  children: [
    {
      path: 'customList',
      component: () => import('@/views/custom/customList'),
      name: 'customList',
      meta: { title: 'customList' }
    },
    {
      path: 'trackList',
      component: () => import('@/views/custom/customList'),
      name: 'trackList',
      meta: { title: 'trackList' }
    } 

  ]
}
export default customRouter 
