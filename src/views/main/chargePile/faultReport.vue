<template>
  <div class="faultReport">
    <mu-header class="muHeader" title="故障上报" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="tit">设备编号</div>
      <div class="getcode" :class="!codeErr? 'fullInput': ''">
        <!-- <input type="text" :placeholder="placeholde" v-model="getCode" @blur="blur">
        <img src="@/assets/dian_my_shiyong_saoyisao@3x.png" alt="" @click="scanCode"> -->
        {{getCode}}
      </div>
      <div class="tit">请描述设备具体故障</div>
      <div class="text">
        <textarea class="tx" placeholder="请描述设备具体故障" maxlength="140" v-model="text"></textarea>
        <div class="des">{{text.length}}/140</div>
      </div>
      <div class="tit">请上传图片</div>
      <mu-uploadPicture :url.sync="url" ref="upload" @geturl="geturl"></mu-uploadPicture>

    </div>
    <!-- <div class="button-g button" @click="submitF">提交</div> -->
    <!-- <div @click="submitF" v-if="!loading">
      <el-tooltip :content="tipContent" placement="top" class="button-g button" :disabled="disabled">
        <el-button>提交</el-button>
      </el-tooltip>
    </div>
    <el-button type="primary" :loading="true" class="button button-g" v-else>提交中...</el-button> -->
    <mu-LoadToast @submit="submitF" class="button" :content="content" :loading="loading" :tipContent="tipContent"></mu-LoadToast>
  </div>
</template>
<script>
  import wx from "weixin-js-sdk";
  import api from "@/api/api";
  import {
    STROAGE
  } from '@/utils/muxin'
  import uploadPic from "@/components/uploadPicture";
  import muheader from "../../../components/header";
  import muLoadToast from '../../../components/loadToast/loadToast'
import { clearTimeout } from 'timers';

  export default {
    name: "faultReport",
    components: {
      "mu-header": muheader,
      "mu-uploadPicture": uploadPic,
      "mu-LoadToast": muLoadToast

    },
    data() {
      return {
        getCode: "", //
        codeErr: true,
        addPhoto: true,
        tempFilePaths: [1],
        text: "",
        placeholde: "扫描二维码或输入编码",
        tipContent: '',
        content: '提交',
        file: null,
        loading: false,
        tempFilePaths: [],
        httpFilePaths: [], // 图片上传服务器返回地址
        url: 'http://47.112.22.47:8082/shared-admin/v1.0/upload_profile_photo'
      };
    },
    created() {
      this.getCode = location.href.split('=')[1]
    },
    methods: {
      geturl (arrImg, type) {
        if (type) return
        this.deviceFeedback(arrImg)
      },
      submitF(type) {
        
        let falg = this.textDectorers();
        if(type = 'hideToast') {
          setTimeout(() => {
            this.tipContent = ''
            
          }, 1000);
        }
        if (!falg) return false;
        this.loading = true;
        // new Promise((resolve, reject) => {
        // let falg = this.tempFilePaths.length
        this.content = '提交中'
        this.$refs.upload.uploadImgs()
      },
      
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true;
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
      // 检测输入桩主信息
      textDectorers() {
        if(!this.getCode) {
           this.tipContent = '请输入正确设备编号'
          return false;
        }
        if (!this.text) {
          this.tipContent = '请输入故障描述'
          return false;
        }
        
        return true;
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
          this.deviceFeedback(arrImg);
          }
        }
      },
      // 设备故障上报
      async deviceFeedback(arrImg) {
        let res = await api.deviceFeedback({
          method: 'POST',
          query: {
            sn: this.getCode,
            fbContent: this.text,
            fbImages: arrImg.toString(',') || ''
          }
        });
        if (res.code === 200) {
          this.loading = false
          this.content = '提交'
          this.$parent.requestCallback({
            message: '提交成功',
            type: 'success',
            center: true,
            offset: 450,
            duration: 600
          })
          setTimeout(() => {
            this.$router.go(-1)
            clearTimeout()
          }, 600);
        } else {}
      },
      // 校验sn
      async checkSn() {
        let res = await api.checkSn({
          query: {
            sn: this.getCode
          }
        });
        if (res.code === 0) {
          STROAGE({
            type: "setItem",
            key: "Sn",
            item: this.getCode
          });
          this.codeErr = true
        } else {
          this.getCode = "";
          this.codeErr = false
          this.placeholde = res.message;
        }
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
      margin: vw(30); // overflow-y: scroll;
      margin-bottom: 0;
      padding: vw(25) vw(30);
      .tit {
        text-align: left;
        margin-bottom: vw(24);
        color: #333333;
      }
      .getcode {
        width: 100%;
        background: #f6f6f6;
        padding: 0 vw(32);
        display: flex;
        justify-content: space-between;
        height: vw(90);
        align-items: center;
        margin-bottom: vw(32);
        input {
          flex: 1;
          height: vw(90);
          line-height: vw(90);
        }
        img {
          width: vw(44);
          height: vw(44);
        }
      }
      .text {
        padding: vw(32);
        background: #f6f6f6;
        width: 100%;
        height: vw(300);
        display: flex;
        flex-direction: column;
        margin-bottom: vw(32);
        .tx {
          background: transparent;
          flex: 1;
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
          display: block;
          background: greenyellow;
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
  }
  .button {
    height: vw(90);
    line-height: vw(90);
    // margin: vw(48) vw(30);
    color: white;
  }
  .fullInput ::placeholder {
    color: red;
  
  }
</style>