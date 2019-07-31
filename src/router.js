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
      path: '/',
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
      path: '/useNext',
      name: 'useNext',
      component: () => import('@/views/main/useCharge/useNext.vue')
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
    },
    {
      path: '/pileHousehold',
      name: 'pileHousehold',
      component: () => import('@/views/main/pileHousehold/index.vue')
    },
    {
      path: '/houseHoldDetails',
      name: 'houseHoldDetails',
      component: () => import('@/views/main/pileHousehold/details.vue')
    },
    {
      path: '/equimentFailure',
      name: 'equimentFailure',
      component: () => import('@/views/main/equimentFailure/index.vue')
    },
    {
      path: '/dealWithFailure',
      name: 'dealWithFailure',
      component: () => import('@/views/main/equimentFailure/dealWithFailure.vue')
    },
    {
      path: '/dealWithResult',
      name: 'dealWithFailure',
      component: () => import('@/views/main/equimentFailure/dealWithResult.vue')
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('@/views/main/wallet/index.vue')
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () => import('@/views/main/wallet/withdraw.vue')
    },
    {
      path: '/withdrawRecord',
      name: 'withdrawRecord',
      component: () => import('@/views/main/wallet/withdrawRecord.vue')
    },
    {
      path: '/withdrawSuccess',
      name: 'withdrawRecord',
      component: () => import('@/views/main/wallet/withdrawSuccess.vue')
    },
    {
      path: '/feedBack',
      name: 'feedBack',
      component: () => import('@/views/main/feedBack/index.vue')
    }
  ]
})
