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
      <div class="upImg">
        <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index">
          <img :src="item" alt="" class="img">
          <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
        </div>
        <img src="@/assets/dianbo_shenqing_add@3x.png" alt="" class="selImg" @click="chooseImg" v-if="addPhoto">
      </div>
    </div>
    <!-- <div class="button-g button" @click="submitF">提交</div> -->
    <div @click="submitF">
      <el-tooltip :content="tipContent" placement="top" class="button-g button" :disabled="disabled">
        <el-button>提交</el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
  import wx from "weixin-js-sdk";
  import api from "@/api/api";
  import {
    STROAGE
  } from '@/utils/muxin'
  import muheader from "../../../components/header";
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
        disabled: false
      };
    },
    methods: {
      selACtives(item) {
        this.selACtive = item.index
        this.text = item.des
      },
      chooseImg() {
        wx.chooseImage({
          count: 4, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            var localIds = res.localIds;
            res.localIds.forEach(element => {
              this.tempFilePaths.push(element);
            });
            if (this.tempFilePaths.length >= 3) {
              this.addPhoto = false;
            } else {
              this.addPhoto = true;
            } // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      },
      submitF() {
        if (this.selACtive === '') {
          this.disabled = false
          this.tipContent = '请选择反馈问题点'
          return false
        }
        if (this.text.length < 10) {
          this.disabled = false
          this.tipContent = '请输入意见描述(不少于10个字)'
          return false
        }
        this.disabled = true
        this.opinionFeedback(this.fbId);
      },
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true
      },
      // 意见反馈上报
      async opinionFeedback() {
        let res = await api.opinionFeedback({
          method: 'POST',
          query: {
            "fbContent": this.text,
            "fbImages": "img/demo.png,img/demo.jpg"
          }
        });
        if (res.code === 200) {
          this.$router.go(-1)
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
        } else {
          this.getCode = "";
          this.placeholde = "无效sn,请重新输入或者检查二维码是否正确";
        }
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
        width: 100%;
        height: vw(150);
        flex-wrap: wrap;
        display: flex;
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
  }
</style>