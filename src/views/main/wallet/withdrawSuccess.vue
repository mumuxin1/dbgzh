<template>
  <div class="withdrawRecord">
    <mu-header class="muHeader" title="提现记录" :left="true" :back="true"></mu-header>
    <div class="content">
     <img src="@/assets/dianbo_public_success@3x.png" alt="">
     <span class="bold des">提现申请已提交，等待人工审核</span>
     <span>{{t}}</span>
     <span>预计到账时间：1~5个工作日</span>
    </div>
    <div class="button-g button" @click="$router.go(-2)">完成</div>

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
      t: "",
    };
  },
  created() {
    this.data_init()
  },
  methods: {
    data_init() {
      let url = location.href.split('=')[1]
      this.t = unescape(url)
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
    padding: vw(96) 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    img{
      width: vw(160);
height: vw(160);
    }
    span{
      line-height: vw(48);
      color: $fontColor2;
    }
    .des{
      margin-top: vw(32);
      color: $fontColor1;
      margin-bottom: vw(32);
      font-size: vw(32)
    }
    
  }
  .button{
    width: 92%;
    margin: vw(48) vw(32);
    height: vw(90);
    line-height: vw(90);
    color: $fontColor3;
  }
}
</style>