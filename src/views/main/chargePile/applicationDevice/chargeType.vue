<template>
  <div class="chargeType">
    <mu-header class="muHeader" title="电桩类型" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="line"></div>
      <div class="tit">
        <span>筛选类型</span>
        <el-select v-model="selText" placeholder="全部电桩类型" class="select_element" @change="change">
          <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="list">
        <div class="left">
          <img src="@/assets/dianbo_shenqing_shebei_pic01@3x.png" alt="">
        </div>
        <div class="right">
          <span>7KW 220V 交流 壁挂式标准
  版 单桩</span>
          <div class="liButton">
            申请
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import muheader from "@/components/header";
  import {
    STROAGE
  } from '@/utils/muxin'
  import api from '@/api/api'
  export default {
    name: "chargeType",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        selText: [],
        selOptions: [{
          value: 1,
          label: '提供场地申请合作'
        }, {
          value: 2,
          label: '下架'
        }]
      };
    },
    created() {
      this.data_Init()
    },
    methods: {
      data_Init() {
        let userInfo = STROAGE({
          type: 'getItem',
          key: 'UserInfo'
        })
        userInfo = JSON.parse(userInfo)
        this.userInfo = userInfo
        this.pageSize = Math.ceil(this.$parent.clientHeight / 220)
        console.log(this.pageSize)
      },
      menu(id) {
        switch (id) {
          case 1:
            break;
          case 2:
            // 我的电站
            this.queryChargList()
            this.$router.push('/myChargePile')
            break;
          default:
            break;
        }
      },
      del() {
        // this.userName = "";
      },
      // 查询我的电站列表
      async queryChargList() {
        let res = await api.queryChargeList({
          query: {
            column: 'createTime',
            order: 'desc',
            pageNo: this.pageNo,
            pageSize: this.pageSize
          }
        })
        if (res.code === 0) {
          STROAGE({
            type: 'setItem',
            key: 'ChargeList',
            item: res.result.records
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .chargeType {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(28);
    background: #f6f6f6;
    color: #333333;
    .content {
      flex: 1;
      background: white;
      padding: 0 vw(32);
      margin: vw(32);
      position: relative;
      .line {
        width: 100%;
        height: vw(1);
        background: #e5e5e5;
        position: absolute;
        top: vw(120);
        left: 0;
      }
      .tit {
        width: 100%;
        height: vw(120);
        display: flex;
        justify-content: space-between;
        align-items: center; // margin-left: -5%;
      }
      .list{
        width: 100%;
        height: vw(200);
        margin-top: vw(32);
        display: flex;
        justify-content: space-between;
        .left{
          width: vw(200);
          height: vw(200);
          margin-right: vw(32);
          img{
            width: vw(200);
            height: vw(200);
          }
        }
        .right{
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          border-bottom: vw(1) solid #e5e5e5;
          span{
            line-height: vw(48);
            text-align: left;
          }
          .liButton{
            width: vw(132);
            height: vw(64);
            line-height: vw(64);
            color: white;
            background: #56baf9;
            border-radius: vw(4)
          }
        }
      }
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