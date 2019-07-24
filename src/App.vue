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
  export default {
    name: 'app',
    components: {
    },
    // async created() {
    //   console.log( 'll')

    //   let res = await api.queryUserInfo()
    //   console.log(res, 'kkkk')
    //   if (res.code === 0) { 
    //     this.userType = res.result.userType
    //     this.$router.push('/personInfo')
    //   } else {
    //     this.$router.push('/login')
    //   }
    // },
    data() {
      return {
        clientHeight: document.body.clientHeight, // 页面可视区高度
        userType: '',  // 1 桩主 2 桩户,
        bsId: '', // 充电站id
        sysUserId: '' // 充电站类型id
      }
    },
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
