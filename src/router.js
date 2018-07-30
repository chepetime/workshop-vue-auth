import Vue from 'vue'
import Router from 'vue-router'

import { routes } from './routes'

Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) return savedPosition;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 200)
  })
};

let router = new Router({
  mode: 'history',
  routes: routes,
  scrollBehavior
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({ path: '/login', params: { nextUrl: to.fullPath } })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next()
        } else {
          next({ name: 'dashboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next({ name: 'dashboard' })
    }
  } else {
    next()
  }
})

export default router
