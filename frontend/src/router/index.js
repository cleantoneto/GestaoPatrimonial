import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta:{
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta:{
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta:{
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta:{
      requiresAuth: true
    } 
  },
  {
    path: '/newpatrimony',
    name: 'NewPatrimony',
    component: () => import(/* webpackChunkName: "newpatrimony" */ '../views/NewPatrimony.vue'),
    meta:{
      requiresAuth: true
    },
    
  },
  {
    path: '/editpatrimony/:id',
    name: 'EditPatrimony',
    component: () => import(/* webpackChunkName: "editpatrimony" */ '../views/EditPatrimony.vue'),
    meta:{
      requiresAuth: true
    }
    
  },
  {
    path: '/patrimony/:id',
    name: 'Patrimony',
    component: () => import(/* webpackChunkName: "patrimony" */ '../views/Patrimony.vue'),
    meta:{
      requiresAuth: false
    }
    
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.authenticated === false) {
      next({
          path: '/login',
          params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else {
      next()
  }
})