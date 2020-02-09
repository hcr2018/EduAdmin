/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = 
{
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'system',
  meta: {
    title: 'system',
    icon: 'skill'
    
  },
  children: [
    {
      path: 'setting',
      component: () => import('@/views/system/setting'),
      name: 'setting',
      meta: {
        title: 'setting',
        icon: 'edit'
        
      }
    },
    {
      path: 'platform',
      component: () => import('@/views/system/platform'),
      name: 'setPlatform',
      meta: {
        title: 'platform',
        icon: 'tree-table'
        
        // if do not set roles, means: this page does not require permission
      }
    }
  ]
}
export default systemRouter
