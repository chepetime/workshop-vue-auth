/**
 * Project Routes
 *
 * Each route needs to be defined here and
 * in the Laravel Web Routes.
 *
 * Each route points to a Component, which
 * consumes required data from the store
 *
 */

// Components or Views
import Home from '@/views/Home.vue'
import Login from '@/views/Login'
import Register from '@/views/Register'
import UserBoard from '@/views/UserBoard'
import Admin from '@/views/Admin'

// Routes
export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },

  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guest: true
    }
  },

  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      guest: true
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: UserBoard,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      is_admin: true
    }
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

];

// EOF
