<template>
  <div class="myChargPile">
    <mu-header class="muHeader" title="我的电站" :left="true" :back="true"></mu-header>
    <div class="content" :class="chargeData.length > 0? '' : 'fullbg'">
      <ul v-for="item in chargeData" :key="item.index" @click="details(item.bsId)">
        <li class="tit">{{item.bsName}}</li>
        <li class="txFull">
          <span>电桩地址</span>
          <div class="text">
            {{item.address}}
          </div>
        </li>
        <li class="txone">
          <span>开放时间</span><span>{{item.dbBaseStationCharging.businessHours}}</span>
        </li>
        <li class="txone" v-if="$parent.userType !== 3">
          <span>累计收益</span><span>{{item.allIncome|moneyFormat}}元</span>
        </li>
        <div class="navsButton" v-if="$parent.userType !== 3" @click.stop="application(item.bsId)">
          申请新设备
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
  import {
    STROAGE
  } from '@/utils/muxin'
  import muheader from "../../../components/header";
  import api from '@/api/api'
  export default {
    name: "myChargPile",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        chargeData: []
      };
    },
    created() {
      // 查询我的电站列表
      this.queryChargList();
      this.data_Init()
    },
    filters: {
      moneyFormat: (params) => {
        return (params / 100).toFixed(2)
      }
    },
    methods: {
      data_Init() {
        let chargeList = STROAGE({
          type: 'getItem',
          key: 'ChargeList'
        })
        if (chargeList) {
          this.chargeData = JSON.parse(chargeList)
        }
        console.log(this.chargeData)
      },
      // 电桩详情
      details(bsId) {
        // 查询充电桩设备列表
        this.queryDevicesList(bsId)
        this.$router.push('/chargeDevices')
      },
      application(bsId) {
        console.log(this)
        this.$parent.bsId = bsId
        this.$router.push('/applicationEquiment')
      },
      // 查询充电桩设备列表
      async queryDevicesList(bsId) {
        let res = await api.queryDevicesList({
          query: {
            bsId: bsId,
            column: 'createTime',
            order: 'desc',
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            shelfStatus: '',
            deviceStatus: ''
          }
        })
        if (res.code === 0) {
          STROAGE({
            type: 'setItem',
            key: 'DevicesList',
            item: res.result.records
          })
        }
      },
      // 查询我的电站列表
      async queryChargList() {
        let res = await api.queryChargeList({
          query: {
            column: "createTime",
            order: "desc",
            pageNo: this.pageNo,
            pageSize: this.pageSize
          }
        });
        if (res.code === 0) {
          this.chargeData = res.result.records
        }
      },
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../styles/theme.scss";
  .myChargPile {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    .content {
      flex: 1;
      background: #f6f6f6;
      padding: vw(30);
      overflow-y: scroll;
      ul {
        width: 100%;
        height: auto;
        padding: vw(32);
        background: white;
        display: flex;
        flex-direction: column;
        margin-bottom: vw(32);
        border-radius: vw(7);
        .tit {
          font-size: vw(32);
          color: #333333;
          font-weight: bold;
          margin-bottom: vw(20);
        }
        li {
          width: 100%;
          height: vw(59);
          display: flex;
          text-align: left;
          font-size: vw(30);
          color: #999999;
        }
        .txFull {
          span {
            flex: 2.5;
            margin-right: vw(30);
            line-height: vw(59);
          }
          .text {
            align-self: center;
            flex: 7.5
          }
        }
        .txone {
          span {
            text-align: left;
            line-height: vw(59);
            &:nth-child(1) {
              margin-right: vw(30);
              flex: 2.5;
            }
            &:nth-child(2) {
              flex: 7.5;
            }
          }
        }
        .navsButton {
          width: 100%;
          height: vw(90);
          line-height: vw(90);
          color: white;
          background: #56baf9;
          border-radius: vw(5);
          margin-top: vw(30);
        }
      }
    }
    .fullbg {
  background: url('../../../assets/full.png') no-repeat center;
  background-size: 50%;
}
  }
</style>