<template>
  <div id="app">
    <transition name="fade-effect" mode="in-out">
      <keep-alive :include="['home']">
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
    NAVIGATOR,
    STROAGE
  } from '@/utils/muxin'
  export default {
    name: 'app',
    components: {},
    async created() {
      console.log('ll')
      let res = await api.queryUserInfo()
      if (res.code === 0) {
        this.userType = res.result.userType
        this.$router.push('/personInfo')
      } else {
        this.$router.push('/login')
      }
    },
    mounted() {
      this.wxConfig()
      this.socket_init()
    },
    data() {
      return {
        clientHeight: document.body.clientHeight, // 页面可视区高度
        userType: '', // 1 桩主 2 桩户,
        bsId: '', // 充电站id
        sysUserId: '', // 充电站类型id
        webSocket: null,
        webSocketData: '',
        webSocketCallback: (res) => {}
      }
    },
    methods: {
      wxConfig() {
        let na = NAVIGATOR()
        if (na === 'Wechat') {} else {
          console.log('请在微信网页调试')
          let url = window.location.href.split('#')[0]
          // url = url.substr(0, url.length - 1)
          // 查询微信JSSDK权限验证配置参数
          this.signature(url)
        }
      },
      socket_init() {
        let userInfo = STROAGE({
          type: 'getItem',
          key: 'UserInfo'
        })
        this.userInfo = userInfo
        if (userInfo) {
          userInfo = JSON.parse(userInfo).userInfo
          let userId = userInfo.id
          let url = `//47.112.22.47:8082/shared-admin/websocket?userid=${userId}`
          // let url = `//192.168.1.132:8088/shared-admin/websocket?userid=${userId}`
          this.webSocket = websocket(url)
          this.webSocket.onmessage = (message) => {
            console.log(message.data)
            this.webSocketData = message.data
            this.webSocketCallback(message.data)
          }
        }
      },
      // 查询微信JSSDK权限验证配置参数
      async signature(url) {
        let res = await api.signature({
          query: {
            url: url
          }
        });
        if (res.code === 0) {
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.result.appId, // 必填，公众号的唯一标识
            timestamp: res.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
            signature: res.result.signature, // 必填，签名
            jsApiList: ['openLocation', 'getLocalImgData', 'scanQRCode'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function(){
          })
          wx.error(function(res){
            console.log(res)
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
        }
      },
    }
  }
</script>

<style lang="scss">
  @import "./styles/rset.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #999999;
    width: 100%;
    height: 100%
  }
</style>
