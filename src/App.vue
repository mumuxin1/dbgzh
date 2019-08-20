<template>
  <div id="app">
    <transition name="fade-effect" mode="in-out">
      <keep-alive :include="histroyReoute">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import api from '@/api/api'
  import wx from 'weixin-js-sdk'
  import websocket from '@/utils/webSocket'
  import {
    Message
  } from 'element-ui';
  import {
    NAVIGATOR,
    STROAGE
  } from '@/utils/muxin'
  import {
    Tree
  } from 'element-ui';
  import { mapActions, mapGetters } from 'vuex'
  import store from './store'
  export default {
    name: 'app',
    components: {},
    async created() {},
    mounted() {
      // this.socket_init()
      // store.dispatch('histroyReoute', {
      //   type: 'add',
      //   params: 'houseHoldDetails'
      // })
    },
    computed: {
      ...mapGetters(['histroyReoute'])
    },
    data() {
      return {
        clientHeight: document.body.clientHeight, // 页面可视区高度
        userType: '', // 1 桩主 2 桩户,
        bsId: '', // 充电站id
        selAdress: '',
        sysUserId: '', // 充电站类型id
        webSocket: null,
        webSocketData: '',

        webSocketCallback: (res) => {},
        requestCallback: (res) => {
          // console.log(res)
          if (res === 'close') {
            Message.close()
          } else {
            Message(res)
          }
        }
      }
    },
    methods: {
      ...mapActions(['histroyReoute']),
      socket_init() {
        this.webSocket = websocket()
        this.webSocket.onmessage = (message) => {
          console.log(message.data)
          this.webSocketData = message.data
          this.webSocketCallback(message.data)
        }
      }
    },
    watch: {
      $route (to, from) {
        if (to.path === '/pileHousehold' && from.path === '/houseHoldDetails') {
          store.dispatch('histroyReoute', {
            type: 'del',
            params: 'houseHoldDetails'
          })
        } else if (to.path === '/houseHoldDetails' && from.path === '/pileHousehold') {
          store.dispatch('histroyReoute', {
            type: 'add',
            params: 'houseHoldDetails'
          })
        } else if (to.path === '/applicationEquiment' && from.path === '/myChargePile') {
          store.dispatch('histroyReoute', {
            type: 'add',
            params: 'applicationEquiment'
          })
        } else if (to.path === '/myChargePile' && from.path === '/applicationEquiment') {
          store.dispatch('histroyReoute', {
            type: 'del',
            params: 'applicationEquiment'
          })
        } else if (to.path === '/step1') {
          store.dispatch('histroyReoute', {
            type: 'add',
            params: 'step1'
          })
        } else if (to.path === '/chargeDevices' && from.path === '/devicesDetails') {
          store.dispatch('histroyReoute', {
            type: 'del',
            params: 'devicesDetails'
          })
        } else if (to.path === '/devicesDetails' && from.path === '/chargeDevices') {
          store.dispatch('histroyReoute', {
            type: 'add',
            params: 'devicesDetails'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import"./styles/theme.scss";
  @import "./styles/rset.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #999999;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
