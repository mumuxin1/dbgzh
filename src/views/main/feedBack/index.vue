<template>
  <div class="feedBack">
    <mu-header class="muHeader" title="意见反馈" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="tit">请选择你想反馈的问题点</div>
      <div class="radio">
        <div class="sel" @click="selACtives(item)" v-for="item in selOptions" :key="item.index">
          <img src="@/assets/dianbo_guzhang_select_press@2x.png" alt="" v-if="selACtive === item.index">
          <img src="@/assets/dianbo_guzhang_select_normal@3x.png" alt="" v-else>
          <span>{{item.des}}</span>
        </div>
      </div>
      <div class="tit">请补充详细问题和意见</div>
      <div class="text">
        <textarea class="tx" placeholder="请输入不少于10个字的描述" maxlength="140" v-model="text"></textarea>
        <div class="des">/140</div>
      </div>
      <div class="tit">请提供相关问题的截图或图片</div>
       <mu-uploadPicture :url.sync="url" ref="upload" @geturl="geturl"></mu-uploadPicture>
    </div>
    <!-- <div class="button-g button" @click="submitF">提交</div> -->
    <div @click="submitF" v-if="!loading">
    <div class="button-g button">提交</div>

      <!-- <el-tooltip :content="tipContent" placement="top" class="button-g button" :disabled="disabled">
        <el-button>提交</el-button>
      </el-tooltip> -->
    </div>
    <el-button type="primary" :loading="true" class="button button-g" v-else>提交中...</el-button>
  </div>
</template>
<script>
  import api from "@/api/api";
  import uploadPic from "../../../components/uploadPicture";

  import {
    STROAGE
  } from '@/utils/muxin'
  import muheader from "../../../components/header";
  export default {
    name: "dealWithResult",
    components: {
      "mu-header": muheader,
      "mu-uploadPicture": uploadPic
    },
    data() {
      return {
        getCode: "", //
        addPhoto: true,
        tempFilePaths: [1],
        text: "",
        selACtive: '',
        selOptions: [{
            index: 0,
            des: '功能异常:功能故障或不可用'
          }, {
            index: 1,
            des: '产品建议:用的不爽，我有建议'
          },
          {
            index: 2,
            des: '终端异常:隐私、欺诈等'
          },
          {
            index: 3,
            des: '其他意见'
          }
        ],
        tipContent: '', // 提示消息
        disabled: true,
        file: null,
        loading: false,
        tempFilePaths: [],
        httpFilePaths: [], // 图片上传服务器返回地址
        url: process.env.VUE_APP_BASE_API + '/v1.0/upload_profile_photo'
      };
    },
    methods: {
      selACtives(item) {
        this.selACtive = item.index
        this.text = item.des
      },
      
      submitF() {
        if (this.selACtive === '') {
          this.$parent.requestCallback({
        message: 'err',
        type: 'warning',
        center: true,
        offset: 450
      })
        }
        // if (this.selACtive === '') {
        //   this.disabled = false
        //   this.tipContent = '请选择反馈问题点'
        //   return false
        // }
        if (this.text.length < 10) {
          this.disabled = false
          this.tipContent = '请输入意见描述(不少于10个字)'
          return false
        }
        this.loading = true
        this.disabled = true
        this.$refs.upload.uploadImgs()
      },
      geturl (arrImg) {
        console.log(arrImg, 'ooo')
        this.opinionFeedback(arrImg)
      },
      // 意见反馈上报
      async opinionFeedback(arrImg) {
        let res = await api.opinionFeedback({
          method: 'POST',
          query: {
            "fbContent": this.text,
            "fbImages": arrImg.toString(',') || ''
          }
        });
        if (res.code === 200) {
          this.$router.go(-1)
          this.loading = false
        } else {}
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../styles/theme.scss";
  .feedBack {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    color: $fontColor1;
    position: absolute;
    .content {
      height: 100%;
      background: white;
      margin: vw(30); // overflow-y: scroll;
      margin-bottom: 0;
      padding: vw(25) vw(30);
      overflow-y: scroll;
      position: relative;
      top: 8%;
      .tit {
        text-align: left;
        color: #333333;
        font-weight: bold;
        margin-bottom: vw(32)
      }
      .radio {
        widows: 100%;
        display: flex;
        flex-direction: column; // align-items: center;
        // margin-bottom: vw(32);
        .sel {
          display: flex;
          margin-bottom: vw(32);
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
      position: relative;
      bottom: 0;
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