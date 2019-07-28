<template>
  <div class="faultReport">
    <mu-header class="muHeader" title="故障上报" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="tit">请扫描设备二维码</div>
      <div class="getcode">
        <input type="text" :placeholder="placeholde" v-model="getCode" @blur="blur">
        <img src="@/assets/dian_my_shiyong_saoyisao@3x.png" alt="" @click="scanCode">
      </div>
      <div class="tit">请描述设备具体故障</div>
      <div class="text">
        <textarea class="tx" placeholder="请描述设备具体故障" maxlength="140" v-model="text"></textarea>
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
  name: "faultReport",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      getCode: "", //
      addPhoto: true,
      tempFilePaths: [1],
      text: "",
      placeholde: "扫描二维码或输入编码"
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
    scanCode() {
      console.log("asss");
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: res => {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          this.getCode = res.resultStr.split("/").pop();
          this.checkSn();
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