<template>
  <div class="withdraw">
    <mu-header class="muHeader" title="提现" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul class="mu-list">
        <li class="noicon"> 
            <span>提现至</span>
            <span class="c9">微信钱包</span>
          </li><li class="noicon"> 
            <span>可提现金额<font style="color: #56baf9"> {{walletInfo.balance| moneyForamt}} </font>元</span>
            <span class="cb" @click="all">全部提现</span>
          </li><li class="noicon"> 
            <span>提现金额</span>
            <div class="right w7">
              <input type="number" maxlength="4" class="w8" v-model="withdraw">
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
    <!-- <div class="button-g button" @click="finish">提现</div> -->
    <div @click="finish">
        <el-tooltip :content="tipContent" placement="top" class="button-g button" :disabled="disabled">
          <el-button>下一步</el-button>
        </el-tooltip>
      </div>
  </div>
</template>
<script>
import muheader from "@/components/header";
import { STROAGE, timeFormat } from "@/utils/muxin";
import api from "@/api/api";
import wx from "weixin-js-sdk";
export default {
  name: "withdraw",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      walletInfo: {},
      withdraw: '',
      tipContent: '请输入提现金额',
      disabled: false
    };
  },
  created() {
      this.data_Init();
    
  },
  filters: {
      moneyForamt: (a) => {
        if (a) {
          return (parseInt(a) / 100).toFixed(2)
        } else {
          return 0
        }
      }
    },
  methods: {
    data_Init() {
        let walletInfo = JSON.parse(
          STROAGE({
            type: "getItem",
            key: "WalletInfo"
          })
        );
        if (walletInfo) {
          this.walletInfo = walletInfo
        }
      },
    finish () {
      console.log(this.withdraw, this.walletInfo.balance)
      if (this.withdraw >( this.walletInfo.balance / 100)) {
        this.disabled = false
        this.tipContent = '提现金额大于余额，请重新输入'
        return false
      }
      if (this.withdraw === '') {
        this.disabled = false
        return false
      }
      this.disabled = true

      // 提现
      this.withdrawApply()
    },
    all () {
      if (this.walletInfo.balance) {
          this.withdraw =  (parseInt(this.walletInfo.balance) / 100).toFixed(2)
          console.log(typeof this.withdraw)
        } else {
          this.withdraw =  0
        }
    },
    // 提现
    async withdrawApply() {
      let res = await api.withdrawApply({
        method: 'POST',
        query: {
          "totalFee": parseFloat(this.withdraw),
	        "payMethod": 1
        }
      });
      if (res.code === 0) {
        let t = timeFormat(null, '-', 'yyyy-mm-dd 00:00:00')
        this.$router.push(`/withdrawSuccess?t=${t}你好}`)
      } else {
        //...
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