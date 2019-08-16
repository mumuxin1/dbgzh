<template>
  <div id="app">
    <transition name="fade-effect" mode="in-out">
      <keep-alive :include="['devicesDetails', 'applicationEquiment', 'step1']">
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
  export default {
    name: 'app',
    components: {},
    async created() {},
    mounted() {
      // this.socket_init()
      this.map_Init()
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
      map_Init () {
        
      },
      socket_init() {
        this.webSocket = websocket()
        this.webSocket.onmessage = (message) => {
          console.log(message.data)
          this.webSocketData = message.data
          this.webSocketCallback(message.data)
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
