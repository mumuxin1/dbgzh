<template>
  <div class="faultReport">
    <mu-header class="muHeader" title="使用充电桩" :left="true" :back="true"></mu-header>
    
    <div class="content">
      <div class="tit">请扫描设备二维码</div>
      <div class="getcode">
        <input type="text" placeholder="扫描二维码或输入编码" v-model="getCode">
        <img src="@/assets/dian_my_shiyong_saoyisao@3x.png" alt="">
      </div>
      <div class="tit">充电桩状态</div>
      <div class="state">
        <span>上架</span>
        <span>下架</span>
        <span>离线</span>
      </div>
    </div>
    <div class="wave">
      开始使用
    </div>
    <div class="button-g button">开始使用</div>
  </div>
</template>
<script>
  import muheader from "@/components/header";
  export default {
    name: "faultReport",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        getCode: '', // 
        
        selText: '' // 下拉选择neirong
      };
    },
    methods: {
      del() {
        // this.userName = "";
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .faultReport {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;

    .content {
      height: auto;
      background: white;
      margin: vw(30);
      // overflow-y: scroll;
      margin-bottom: 0;
      padding: vw(25) vw(30);
      padding-bottom: 0;
      .tit{
        text-align: left;
        margin-bottom: vw(24);
        color: #333333; 
      }
      .getcode{
        width: 100%;
        background: #f6f6f6;
        padding: 0 vw(32);
        display: flex;
        justify-content: space-between;
        height: vw(90);
        align-items: center;
        margin-bottom: vw(32);
        input{
          flex: 1;
          height: vw(90);
          line-height: vw(90)
        }
        img{
          width: vw(44);
          height: vw(44);
        }
      }
      .state{
        display: flex;
        justify-content: space-around;
        margin-bottom: vw(32);
        span{
          width: vw(186);
          height: vw(64);
          line-height: vw(64);
          border: vw(1) solid #e5e5e5;
        }
        .active{
          color: $themeColor;
          border-color: $themeColor;
        }
      }
    }
    .wave{
      width: vw(280);
      height: vw(280);
      line-height: vw(280);
      align-self: center;
      background: url('../../../assets/dianbtn.png');
      background-size: cover;
      margin-top: vw(192);
      color: white;
    }
    .button{
      height: vw(90);
      line-height: vw(90);
      margin: vw(32) vw(30);
      color: white;
    }
  }
  /deep/ {
    // select
    .el-input__inner {
      height: vw(64);
      color: #333333;
      font-size: vw(28);
      padding-left: vw(20);
    }
    
    .el-input__suffix-inner {
      position: relative;
      top: vw(-12);
      right: vw(22);
    }
    // Input
    .input_element .el-input__inner{
      padding-left: vw(60);
      
    }
    .el-input__prefix{
      position: relative;
      top: vw(-45);
      left: vw(-222);
    }
  }
  .el-select-dropdown__item {
    height: vw(64) !important;
    line-height: vw(64) !important;
    span {
      display: block;
      height: vw(64) !important;
      line-height: vw(64) !important;
    }
  }
</style>