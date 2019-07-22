import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'personInfo',
    //   component: () => import(/* webpackChunkName: "about" */ '@/views/main/person/personInfo.vue')
    // },
    // {
    //   path: '/',
    //   name: 'login',
    //   component: () => import(/* webpackChunkName: "about" */ '@/views/login/login.vue')
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/',
      name: 'myCharePile',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/myChargePile.vue')
    }
  ]
})
