<template>
  <div class="faultReport">
    <mu-header class="muHeader" title="故障上报" :left="true" :back="true"></mu-header>
    
    <div class="content">
      <div class="tit">请扫描设备二维码</div>
      <div class="getcode">
        <input type="text" placeholder="扫描二维码或输入编码" v-model="getCode">
        <img src="" alt="">
      </div>
      <div class="tit">请描述设备具体故障</div>
      <div class="text">
        <textarea class="tx" placeholder="请描述设备具体故障" maxlength="140"></textarea>
        <div class="des">/140</div>
      </div>
      <div class="tit">请上传图片</div>
      <div class="upImg">
        <div class="selImg">
          <img src="" alt="">
          <span>添加图片</span>
        </div>
        <div class="uploadImg">
          <img src="" alt="" class="img">
          <img src="" alt="" class="del">
        </div>
      </div>
    </div>
    <div class="button-g button">提交</div>
  </div>
</template>
<script>
  import muheader from "../../../components/header";
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
  @import "../../../styles/theme.scss";
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
          background: red;
        }
      }
      .text{
        padding: vw(32);
        background: #f6f6f6;
        width: 100%;
        height: vw(300);
        display: flex;
        flex-direction: column;
        margin-bottom: vw(32);
        .tx{
          background: transparent;
          flex: 1;
        }
        .des{
          align-self:flex-end;
        }
      }
      .upImg{
        width: 100%;
        height: vw(150);
        flex-wrap: wrap;
        display: flex;
        img{
          width: vw(60);
          height: vw(48);
          background: red;
          margin: vw(26);
        }
        .selImg{
          display: flex;
        flex-direction: column;
        align-items: center;
          width: vw(150);
          height: vw(150);
          background: #f5f5f5;
        }
        .uploadImg{
          width: vw(150);
          height: vw(150);
          position: relative;
          margin-right: vw(7);
          .img{
            width: vw(150);
            height: vw(150);
            display: block;
            background: greenyellow;
            margin: 0;
          }
          .del{
            width: vw(46);
            height: vw(46);
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
          }
        }
      }
    }
    .button{
      height: vw(90);
      line-height: vw(90);
      margin: vw(48) vw(30);
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