import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from '@/views/Login'
import Register from '@/views/Register'
import UserBoard from '@/views/UserBoard'
import Admin from '@/views/Admin'

Vue.use(Router)

let router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }
    },

    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true }
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: UserBoard,
      meta: { requiresAuth: true }
    },

    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true, is_admin: true }
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import ( /* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
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
