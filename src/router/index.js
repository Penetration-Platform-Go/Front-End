import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/userInfo',
    component: Layout,
    children: [{
      path: '/',
      name: 'userinfo',
      component: () => import('@/views/user/index')
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { roles: ['editor', 'admin'] },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/editor/index'),
        meta: { title: 'Dashboard', icon: 'dashboard', roles: ['editor'] }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        meta: { title: 'Dashboard', icon: 'dashboard', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    name: 'Project',
    meta: { title: 'Project', icon: 'example', roles: ['editor', 'admin'] },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Query', icon: 'table', roles: ['editor'] }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/admin'),
        meta: { title: 'Project', icon: 'table', roles: ['admin'] }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Create', icon: 'form', roles: ['editor'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'User',
    meta: { title: 'User', icon: 'peoples', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'self',
        name: 'self',
        component: () => import('@/views/user/index'),
        meta: { title: 'Self', icon: 'user', roles: ['admin', 'editor'] }
      },
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/user/user'),
        meta: { title: 'User', icon: 'users', roles: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
