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
  import muheader from "../../../components/header";
  import uploadPic from "@/components/uploadPicture";
  import muLoadToast from '../../../components/loadToast/loadToast'

  import {
    truncate
  } from 'fs';
  import {
    fbind
  } from 'q';
  export default {
    name: "dealWithResult",
    components: {
      "mu-header": muheader,
      "mu-uploadPicture": uploadPic,
      "mu-LoadToast": muLoadToast

    },
    data() {
      return {
        getCode: "", //
        addPhoto: true,
        tempFilePaths: [1],
        text: "",
        selACtive: '',
        tipContent: '', // 提示消息
        content: '提交',
        disabled: false,
        fbId: null,
        disabled: false,
        file: null,
        loading: false,
        tempFilePaths: [],
        httpFilePaths: [], // 图片上传服务器返回地址
        url: process.env.VUE_APP_BASE_API + '/v1.0/upload_profile_photo'
      };
    },
    created() {
      this.fbId = location.href.split('=')[1]
    },
    methods: {
      geturl (arrImg) {
        this.postDealWithResult(this.fbId, arrImg);
      },
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
        this.content = '提交中...';
        this.loading = true;
        this.$refs.upload.uploadImgs()
        
      },
      // 设备故障上报
      async postDealWithResult(fbId, arrImg) {
        this.loading = true
        let res = await api.postDealWithResult({
          method: 'POST',
          query: {
            "fbId": fbId,
            "dealResult": this.selACtive,
            "dealRemark": this.text,
            "dealImgs": arrImg.toString(',') || ''
          }
        });
        if (res.code === 0) {
          // ...
          this.$parent.requestCallback({
            message: '提交成功',
            type: 'success',
            center: true,
            offset: 450,
            duration: 600
          })
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