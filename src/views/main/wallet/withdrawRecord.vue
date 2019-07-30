<template>
  <div class="withdrawRecord">
    <mu-header class="muHeader" title="提现记录" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="w3 bold left">时间</li>
        <li class="w3 bold">渠道</li>
        <li class="w2 bold">提现金额</li>
        <li class="w2 bold"><span>状态</span></li>
      </ul>
      <div class="line"></div>
      <ul>
        <li class="w3 left">2019.07.12 07:47:39</li>
        <li class="w3">微信钱包</li>
        <li class="w2">470.2 </li>
        <li class="w2">成功</li>
      </ul>
    </div>
  </div>
</template>
<script>
import muheader from "@/components/header";
import { STROAGE } from "@/utils/muxin";
import api from "@/api/api";
import wx from "weixin-js-sdk";
export default {
  name: "withdrawRecord",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      getCode: "", //
      selText: "", // 下拉选择neirong
      placeholde: "扫描二维码或输入编码"
    };
  },
  created() {
    // this.wxConfig()
  },
  methods: {
    // 校验sn
    async checkSn() {
      let res = await api.checkSn({
        query: {
          sn: this.getCode
        }
      });
      if (res.code === 0) {
        this.$router.push("/useNext");
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
@import "@/styles/theme.scss";
.withdrawRecord {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(30);
  background: #f6f6f6;
  color: $fontColor1;
  .content {
    background: white;
    margin: vw(30); // overflow-y: scroll;
    margin-bottom: 0;
    padding: vw(25) 0;
    padding-bottom: 0;
    ul{
      padding: 0 vw(32);
      display: flex;
       height: vw(120);
      &:first-child{
          height: vw(90);
          li{
  color: $fontColor1;
          }
      }
      li{
        // height: vw(120);
        align-self: center;
        color: $fontColor2;
        text-align: center;
        word-wrap:break-word;
      }
      .left{
        text-align: left;
      }
    }
  }
}
</style>