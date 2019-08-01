<template>
  <div class="dealWithResult">
    <mu-header class="muHeader" title="故障上报" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="tit">基本信息</div>
      <div class="radio">
        <div class="sel" @click="selACtive = 1">
          <img src="@/assets/dianbo_guzhang_select_normal@3x.png" alt="" v-if="selACtive === 0 || selACtive === ''">
          <img src="@/assets/dianbo_guzhang_select_press@2x.png" alt="" v-if="selACtive === 1">
          <span>已解决</span>
        </div>
        <div class="sel" @click="selACtive = 0">
          <img src="@/assets/dianbo_guzhang_select_normal@3x.png" alt="" v-if="selACtive === 1 || selACtive === ''">
          <img src="@/assets/dianbo_guzhang_select_press@2x.png" alt="" v-if="selACtive === 0">
          <span>未解决</span>
        </div>
      </div>
      <div class="tit">请描述设备具体故障</div>
      <div class="text">
        <textarea class="tx" placeholder="请输入你需要备注的信息" maxlength="140" v-model="text"></textarea>
        <div class="des">/140</div>
      </div>
      <div class="tit">请上传图片</div>
      <div class="upImg">
        <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index">
          <img :src="item" alt="" class="img">
          <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
        </div>
        <div class="selImg" v-if="tempFilePaths.length < 4">
          <input type="file" multiple accept='image/*' @change="uploadFile($event)" ref="upImg">
        </div>
      </div>
    </div>
    <!-- <div class="button-g button" @click="submitF">提交</div> -->
    <div @click="submitF" v-if="!loading">
      <el-tooltip :content="tipContent" placement="top" class="button-g button" :disabled="disabled">
        <el-button>提交</el-button>
      </el-tooltip>
    </div>
    <el-button type="primary" :loading="true" class="button button-g" v-else>提交中...</el-button>
  </div>
</template>
<script>
  import wx from "weixin-js-sdk";
  import api from "@/api/api";
  import {
    STROAGE
  } from '@/utils/muxin'
  import muheader from "../../../components/header";
  import {
    truncate
  } from 'fs';
  import {
    fbind
  } from 'q';
  export default {
    name: "dealWithResult",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        getCode: "", //
        addPhoto: true,
        tempFilePaths: [1],
        text: "",
        selACtive: '',
        tipContent: '', // 提示消息
        disabled: false,
        fbId: null,
        disabled: false,
        file: null,
        loading: false,
        tempFilePaths: [],
        httpFilePaths: [], // 图片上传服务器返回地址
      };
    },
    created() {
      this.fbId = location.href.split('=')[1]
    },
    methods: {
     
      submitF() {
        if (this.selACtive === '') {
          this.disabled = false
          this.tipContent = '请选择故障是否已解决'
          return false
        }
        if (this.text === "") {
          this.disabled = false
          this.tipContent = '请输入故障描述'
          return false
        }
        this.disabled = true;
        if (this.tempFilePaths.length > 0) {
          this.tempFilePaths.forEach((el, index) => {
            var params = new FormData();
            params.append('file', this.file[index]);
            this.uploadImages(params, index)
          })
        } else {
          // 设备故障上报
          this.postDealWithResult(this.fbId);
        }
      },
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true
      },
      uploadFile(e) {
        let file = e.target.files
        this.file = file
        for (let i = 0; i < file.length; i++) {
          console.log(file[i], '2222')
          let s = file[i]
          let binaryData = [];
          binaryData.push(file[i]);
          let src
          if (window.createObjectURL != undefined) {
            src = window.createObjectURL(new Blob(binaryData, {
              type: "application/zip"
            }))　　
          } else if (window.URL != undefined) { //mozilla(firefox)兼容火狐
            // 　　url = window.URL.createObjectURL(file);
            src = window.URL.createObjectURL(new Blob(binaryData, {
              type: "application/zip"
            }))　　
          } else if (window.webkitURL != undefined) { //webkit or chrome
            　　
            // url = window.webkitURL.createObjectURL(file);
            src = window.webkitURL.createObjectURL(new Blob(binaryData, {
              type: "application/zip"
            }))　　
          }
          this.tempFilePaths.push(src)
        }
      },
      async uploadImages(params, index) {
        let res = await api.uploadProfile({
          method: 'myupload',
          query: {
            file: params
          }
        })
        this.loading = true
        if (res.code === 200) {
          console.log(res.result.headUrl)
          this.httpFilePaths.push(res.result.headUrl)
          if (index === this.tempFilePaths.length - 1) {
            // 设备故障上报
            // 设备故障上报
            this.postDealWithResult(this.fbId);
          }
        }
      },
      // 设备故障上报
      async postDealWithResult(fbId) {
        this.loading = true
        let res = await api.postDealWithResult({
          method: 'POST',
          query: {
            "fbId": fbId,
            "dealResult": this.selACtive,
            "dealRemark": this.text,
            "dealImgs": this.httpFilePaths.toString(',') || ''
          }
        });
        if (res.code === 0) {
          // ...
          this.loading = false
          this.$router.go(-2)
        } else {}
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../styles/theme.scss";
  .dealWithResult {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    color: $fontColor1;
    .content {
      height: auto;
      background: white;
      margin: vw(30); // overflow-y: scroll;
      margin-bottom: 0;
      padding: vw(25) vw(30);
      .tit {
        text-align: left;
        color: #333333;
        font-weight: bold;
        margin-bottom: vw(32)
      }
      .radio {
        widows: 100%;
        height: vw(40);
        display: flex;
        align-items: center;
        margin-bottom: vw(32);
        .sel {
          display: flex;
          margin-right: vw(32);
          img {
            width: vw(40);
            height: vw(40);
            margin-right: vw(24)
          }
        }
      }
      .text {
        padding: vw(32);
        background: #f6f6f6;
        width: 100%;
        height: vw(242);
        display: flex;
        flex-direction: column;
        margin-bottom: vw(32);
        .tx {
          background: transparent;
          flex: 1;
          font-size: vw(28)
        }
        .des {
          align-self: flex-end;
        }
      }
      .upImg {
        width: 102%;
        height: vw(150);
        flex-wrap: wrap;
        display: flex;
        margin-bottom: vw(32);
        margin-left: vw(-10);
        img {
          width: vw(60);
          height: vw(48); // background: red;
          margin: vw(26);
        }
        .selImg {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: vw(150);
          height: vw(150);
          background: #f5f5f5;
          margin: 0;
          margin-right: vw(10);
          background: url('../../../assets/uploadImg.png') no-repeat;
          background-size: cover;
          input {
            opacity: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      .uploadImg {
        width: vw(150);
        height: vw(150);
        position: relative;
        margin-right: vw(7);
        .img {
          width: vw(150);
          height: vw(150);
          display: block; // background: greenyellow;
          margin: 0;
        }
        .del {
          width: vw(46);
          height: vw(46);
          position: absolute;
          top: 0;
          right: 0;
          margin: 0;
        }
      }
    }
    .button {
      height: vw(90);
      line-height: vw(90);
      margin: vw(48) vw(30);
      color: white;
    }
    .el-button--default {
      width: 92% !important;
    }
    .el-button {
      padding: 0;
      height: vw(90) !important;
      line-height: vw(90) !important;
    }
    .is-loading {
      background: $bgPageColor3 !important;
      color: $fontColor3 !important;
      font-size: 18px !important;
    }
  }
</style>