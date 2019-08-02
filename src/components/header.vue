<template>
  <div class="header">
    <div class="statusBar"></div>
    <div class="betw">
      <div class="head-left" v-if="left">
        <slot name="setLeft"></slot>
        <div class="back" v-if="back" @click="goBack">
          <img src="../assets/dianbo_nav_back@3x.png">
        </div>
        <div class="text" v-if="leftText" @click="goBackHander">{{leftText}}</div>
      </div>
      <div class="head-right" v-if="right">
        <slot name="setRight"></slot>
        <div class="icon" v-if="icon" @click="$router.back()">
          <!-- <img src="../assets/切换账号@3x.png"> -->
        </div>
      </div>
    </div>
    <div class="head-center" v-if="title">
      {{title}}
      <slot name="title"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: "Muheader",
    props: {
      left: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      right: {
        type: Boolean,
        default: false
      },
      back: {
        type: Boolean,
        default: true
      },
      icon: {
        type: Boolean,
        default: false
      },
      leftText: {
        type: String,
        default: ""
      },
      route: {
        type: String,
        default: ""
      }
    },
    methods: {
      goBack() {
        if (this.route === 'allpyOwner') {
          this.$router.go(-2)
        } else {
          this.$router.go(-1)
        }
      }
    },
  };
</script>
<style lang="scss" scoped>
  @import "../styles/theme.scss";
  .header {
    width: 100%;
    height: vw(85);
    position: relative;
    background: $bgPageColor3;
  }
  .betw {
    width: 100%;
    height: vw(85);
    padding: 0 vw(30);
    display: flex;
    position: absolute;
    justify-content: space-between;
    top: 0;
    z-index: 2;
    .head-left .back {
      height: vw(85);
      display: flex;
      img {
        width: vw(44);
        height: vw(42);
        align-self: center;
      }
    }
    .head-right {
      display: flex;
      .icon {
        display: flex;
        img {
          width: vw(42);
          height: vw(42);
          align-self: center;
        }
      }
    }
  }
  .head-center {
    width: 100%;
    height: vw(85);
    position: absolute;
    top: 0;
    line-height: vw(85);
    color: white;
    font-size: vw(36);
  }
</style>