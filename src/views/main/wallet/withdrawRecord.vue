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
      <ul v-for="item in withdrawList" :key="item.index">
        <li class="w3 left">{{item.createTime}}</li>
        <li class="w3">微信钱包</li>
        <li class="w2">{{item.actualFee}} </li>
        <li class="w2">{{item.reviewStatus === 1? '成功': '失败'}}</li>
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
      withdrawList: []
    };
  },
  created() {
    this.queryWithdrawList()
  },
  methods: {
    // 查询提现记录
      async queryWithdrawList() {
        let res = await api.queryWithdrawList({
          query: {
            column: "createTime",
            order: "desc",
            pageNo: '',
            pageSize: ''
          }
        });
        if (res.code === 0) {
          this.$router.push('/withdrawRecord')
          this.withdrawList = res.result.records
          STROAGE({
            type: "setItem",
            key: "WithdrawList",
            item: res.result.records
          });
        } else {
          // ...
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