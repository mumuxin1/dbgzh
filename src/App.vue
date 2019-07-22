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
export default {
  name: 'app',
  components: {
    
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
