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
        <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index" >
          <img :src="item" alt="" class="img">
          <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
        </div>
        <img
          src="@/assets/dianbo_shenqing_add@3x.png"
          alt=""
          class="selImg"
          @click="chooseImg"
          v-if="addPhoto"
        >
      </div>
    </div>
    <div class="button-g button" @click="submitF">提交</div>
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
      selACtive: ''
    };
  },
  methods: {
    blur() {
      // 校验sn
      this.checkSn();
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
      if (this.getCode !== "" && this.text !== "") {
        // 设备故障上报
        this.deviceFeedback();
      }
    },
    del (index) {
      this.tempFilePaths.splice(index, 1);
      this.addPhoto = true
    },
    // 设备故障上报
    async deviceFeedback() {
      let res = await api.deviceFeedback({
        method: 'POST',
        query: {
          sn: this.getCode,
          fbContent: this.text,
          fbImages: "demo.jpg,demo2.jpg"
        }
      });
      if (res.code === 0) {
        // ...
      } else {
      }
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
    .radio{
      widows: 100%;
      height: vw(40);
      display: flex;
      align-items: center;
      margin-bottom: vw(32);
      .sel{
        display: flex;
        margin-right: vw(32);
        img{
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
        height: vw(48);
        // background: red;
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
          display: block;
          // background: greenyellow;
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
  } // Input
  .input_element .el-input__inner {
    padding-left: vw(60);
  }
  .el-input__prefix {
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