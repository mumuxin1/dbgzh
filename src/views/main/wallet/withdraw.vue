<template>
  <div class="withdraw">
    <mu-header class="muHeader" title="提现" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul class="mu-list">
        <li class="noicon"> 
            <span>提现至</span>
            <span class="c9">微信钱包</span>
          </li><li class="noicon"> 
            <span>可提现金额<font style="color: #56baf9">2890.2</font>元</span>
            <span class="cb">全部提现</span>
          </li><li class="noicon"> 
            <span>提现金额</span>
            <div class="right w7">
              <input type="number" maxlength="4" class="w8">
              <img src="@/assets/dianbo_qianbao_delete@3x.png" alt="">
              <span>元</span>
            </div>
          </li>
        <!-- <li class="l-icon"> 
            <div class="right">
              <span>xx</span>
              <img src="@/assets/dianbo_public_right@3x.png" alt="">
            </div>
            <span></span>
          </li> -->
      </ul>
    </div>
    <div class="button-g button" @click="finish">提现</div>
  </div>
</template>
<script>
import muheader from "@/components/header";
import { STROAGE } from "@/utils/muxin";
import api from "@/api/api";
import wx from "weixin-js-sdk";
export default {
  name: "withdraw",
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
    finish () {
      this.$router.push('/withdrawSuccess')
    },
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
.withdraw {
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
    .c9{
  color: $fontColor2;
    }
    .cb{
  color: $fontColor;

    }
    .right{
      display: flex;
      margin-right: vw(24);
      margin-left: vw(40);
      border-bottom: vw(1) solid #f6f6f6;
      input{
        flex: 1;
        margin-right: vw(20);
      }
      img{
        width: vw(30);
        height: vw(30);
        margin-right: vw(40);
      }
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