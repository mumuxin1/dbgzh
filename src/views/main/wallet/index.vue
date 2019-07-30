<template>
  <div class="wallet">
    <mu-header class="muHeader" title="我的钱包" :left="true" :back="true"></mu-header>
    <div class="flex top">
      <span>昨日收益</span>
      <span class="balance"><font class="bold">357.87</font>元
  </span>
      <span>累计收益31480.5元</span>
    </div>
    <div class="content">
      <ul class="mu-list">
        <!-- <li class="noicon"> 
            <span></span>
            <span></span>
          </li> -->
        <li class="r-icon" @click="menu(1)">
          <span class="flex2">提现</span>
          <div class="right flex8">
            <span>可提现2890.2元</span>
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
          </div>
        </li>
        <div class="line"></div>
        <li class="r-icon" @click="menu(2)">
          <span class="flex2">提现记录</span>
          <div class="right flex8">
            <span>xx</span>
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
          </div>
        </li>
        <div class="line"></div>
        <li class="r-icon">
          <span class="flex2">冻结金额</span>
          <div class="right flex8">
            <span>0.00元</span>
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
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
    <p>
      <font style="color:red">*</font>钱包余额为可提现+提现中+冻结金额之和</p>
    <p>
      <font style="color:red">*</font>冻结金额为月结金额之和，到期会自动解冻到可提现金额</p>
  </div>
</template>
<script>
  import muheader from "@/components/header";
  import {
    STROAGE
  } from "@/utils/muxin";
  import api from "@/api/api";
  import wx from 'weixin-js-sdk'
  export default {
    name: "wallet",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        getCode: "", //
        selText: "", // 下拉选择neirong
        placeholde: '扫描二维码或输入编码'
      };
    },
    created() {
      // this.wxConfig()  
    },
    methods: {
      useing() {
        this.checkSn();
      },
      menu (index) {
        switch (index) {
          case 1:
            this.$router.push('/withdraw')
            break;
          case 2:
            this.$router.push('/withdrawRecord')
            break;
          default:
            break;
        }
      },
      //, 校验sn
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
          this.getCode = ''
          this.placeholde = '无效sn,请重新输入或者检查二维码是否正确'
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .wallet {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    color: $fontColor1;
    .top {
      align-items: center;
      color: $fontColor3;
      padding: vw(96) 0;
      background: $bgPageColor3;
      flex-direction: column;
      background: url('../../../assets/wallet.png') no-repeat;
      background-size: cover;
      .balance {
        margin-top: vw(32);
        margin-bottom: vw(48);
      }
    }
    .content {
      background: white;
      margin: vw(30); // overflow-y: scroll;
      margin-bottom: 0;
      padding: vw(25) 0;
      padding-bottom: 0;
    }
    p {
      width: 100%;
      text-align: left;
      padding: 0 vw(32);
      font-size: vw(24);
      color: $fontColor2;
      line-height: vw(32);
      margin-top: vw(32);
    }
  }
</style>