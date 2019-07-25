import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/personInfo',
      name: 'personInfo',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/person/personInfo.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ '@/views/login/login.vue')
    },
    {
      path: '/myChargePile',
      name: 'myChargePile',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/myChargePile.vue')
    },
    {
      path: '/chargeDevices',
      name: 'chargeDevices',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/chargeDevices.vue')
    },
    {
      path: '/devicesDetails',
      name: 'devicesDetails',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/devicesDetails.vue')
    },
    {
      path: '/faultReport',
      name: 'faultReport',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/faultReport.vue')
    },
    {
      path: '/applicationEquiment',
      name: 'applicationEquiment',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/applicationDevice/applicationEquiment.vue')
    },
    {
      path: '/chargeType',
      name: 'chargeType',
      component: () => import(/* webpackChunkName: "about" */ '@/views/main/chargePile/applicationDevice/chargeType.vue')
    },
    {
      path: '/reviewProgress',
      name: 'reviewProgress',
      component: () => import('@/views/main/chargePile/applicationDevice/reviewProgress.vue')
    },
    {
      path: '/step1',
      name: 'step1',
      component: () => import('@/views/main/chargePile/applyOwner/step1.vue')
    },
    // 使用电桩
    {
      path: '/useing',
      name: 'useing',
      component: () => import('@/views/main/useCharge/useing.vue')
    },
    {
      path: '/transactionInfo',
      name: 'transactionInfo',
      component: () => import('@/views/main/transactionInfo/index.vue')
    },
    {
      path: '/applicationRecord',
      name: 'applicationRecord',
      component: () => import('@/views/main/applicationRecord/index.vue')
    }
  ]
})
