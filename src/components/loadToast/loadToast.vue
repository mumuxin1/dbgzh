<template>
  <div class="mxlt" >
    <div class="button" @click="submit">
      <img src="../../assets/5-121204193934-50.gif" alt="" v-if="loading" class="loading">
      <div class="tx">{{content}}</div>
      <div class="btToast" v-if="tipContent !== ''">
        {{tipContent}}
        <div class="sanjiao"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "Muheader",
    props: {
      loading: {
        type: Boolean,
        default: true
      },
      content: {
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
      tipContent: {
        type: String,
        default: ""
      },
      route: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        show: true
      }
    },
    methods: {
      submit () {
        this.$emit('submit')
      }
    },
    watch: {
      tipContent (newval) {
        if (newval !== '') {
          setTimeout(() => {
            this.show = false
          }, 1500);
        }
      }
    },
  };
</script>
<style lang="scss" scoped>
  @import "../../styles/theme.scss";
  .mxlt {
    width: 100%;
    height: vw(90);
    .button{
      height: vw(90);
      line-height: vw(90);
      margin: vw(32) vw(30);
      color: white;
      background: $bgPageColor3;
      display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .loading{
      width: vw(24);
      height: vw(24);
      margin-right: vw(12)
    }
    }
.btToast{
  position: absolute;
  top: vh(-90);
  min-width: vw(300);
  height: vh(60);
  line-height: vh(60);
  background: #000;
  opacity: .7;
  color: white;
  padding: 0 vw(25);
  border-radius: vw(10);
  font-size: vw(24);
  .sanjiao{
        width: 0px;                 /*  宽高设置为0，很重要，否则达不到效果 */
				height: 0px;
				border: vh(20) solid #000;
				border-bottom-color: transparent;    /* 设置透明背景色 */
				border-left-color: transparent;
        border-right-color: transparent;
        left: 45%;
        position: absolute;
        bottom: vh(-35)
  }
}
  }
</style>