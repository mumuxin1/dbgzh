<template>
  <div class="transactionInfo">
    <mu-header class="muHeader" title="交易查询" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="topNav">
        <div class="sel">
          <span>站点名称</span>
          <el-select v-model="selText" placeholder="请选择站点" class="select_element" @change="change">
            <el-option
              v-for="item in chargeList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </div>
        <div class="selectDate">
          <div class="block" size="large">
            <el-date-picker
              v-model="startTime"
              align="left"
              type="date"
              :editable="false"
              placeholder=""
              @change="getStartTime(startTime)"
            ></el-date-picker>
          </div>
          <span>至</span>
          <div class="block">
            <el-date-picker
              v-model="endTime"
              align="left"
              type="date"
              :editable="false"
              placeholder=""
              @change="getEndTime(endTime)"
            ></el-date-picker>
          </div>
        </div>
        <!-- <div class="selTime">
                <div class="rieditor">
                  <el-time-picker v-model="startTime" placeholder="">
                  </el-time-picker>
                </div>
                <span class="span">至</span>
                <div class="rieditor">
                  <el-time-picker v-model="endTime" placeholder="">
                  </el-time-picker>
                </div>
        </div>-->
      </div>
      <div class="headTit">
        <div class="cow">
          <span>{{(orderList[0]? orderList[0].totalFee/100 : 0)}}元</span>
          <span>{{(orderList[0]? orderList[0].orderNum : 0)}}</span>
        </div>
        <div class="cow">
          <span>交易总金额(元)</span>
          <span>交易总笔数(笔)</span>
        </div>
      </div>
      <div class="nav">
        <span :class="orderType === 1 ? 'navActived' : ''" @click="tabNav(1)">交易成功</span>
        <span :class="orderType === 2 ? 'navActived' : ''" @click="tabNav(2)">使用中</span>
        <span :class="orderType === 3 ? 'navActived' : ''" @click="tabNav(3)">预约中</span>
      </div>
      <div class="list" :class="orderList.length > 0? '' : 'fullbg'">
        <ul v-for="item in orderList" :key="item.index">
          <li>
            <span class="color_99">站点名称</span>
            <span class="color_99">{{item.bsName}}</span>
            <div class="liButton" v-if="orderType === 1">交易成功</div>
            <div class="liButton gre" v-if="orderType === 2">使用中</div>
            <div class="liButton blu" v-if="orderType === 3">预约中</div>
          </li>
          <li>
            <span class="">订单编号</span>
            <span>{{item.orderNo}}</span>
          </li>
          <li>
            <span class="">设备编号</span>
            <span>{{item.sn}}</span>
          </li>
          <li v-if="orderType !== 3">
            <span class="">起始时间</span>
            <span>{{item.actualStartTime}}</span>
          </li>
          <li v-if="orderType === 3">
            <span class="">起始时间</span>
            <span>{{item.bookStartTime}}</span>
          </li>
          <li v-if="orderType === 1">
            <span class="">使用时长</span>
            <span>{{item.sn}}</span>
          </li>
          <li v-if="orderType !== 3">
            <span class="">充电时长</span>
            <span>{{item.sn}}</span>
          </li>
          <li v-if="orderType === 1">
            <span class="">消费金额</span>
            <span>{{item.actualFee|moneyFormat}}</span>
          </li>
          <li v-if="orderType !== 1">
            <span class="">预约时长</span>
            <span>{{item.actualFee}}</span>
          </li>
          <li v-if="orderType === 2">
            <span class="">使用时长</span>
            <span>{{item.actualFee}}</span>
          </li>
          <li v-if="orderType === 2">
            <span class="">已缴金额</span>
            <span>{{item.depositFee|moneyFormat}}￥</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import muheader from "../../../components/header";
import { STROAGE, timeFormat } from "@/utils/muxin";
import api from "@/api/api";
export default {
  name: "transactionInfo",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      selText: "", // sousuoneirong
      chargeList: "", // 下拉选择站点
      deviceList: [],
      bsId: "",
      startTime: "",
      endTime: "",
      pageNo: "",
      pageSize: "",
      orderList: [], // 订单列表详情
      orderType: 1 // 2 使用中 3预约
    };
  },
  created() {
    this.data_Init();
  },
  filters: {
    moneyFormat: params => {
      return (params / 100).toFixed(2);
    }
  },
  methods: {
    data_Init() {
      let chargeList = JSON.parse(
        STROAGE({
          type: "getItem",
          key: "ChargeList"
        })
      );
      if (chargeList) {
        this.chargeList = chargeList.map(el => ({
          value: el.index,
          label: el.bsName,
          bsId: el.bsId
        }));
      }
      // 查询订单列表
      this.queryOrderList();
      console.log(this.chargeList, "sddds");
    },
    change(e) {
      // 查询设备列表
      this.bsId = this.chargeList.find(el => {
        return el.label === e;
      }).bsId;
      // 查询订单列表
      if (this.bsId) {
        console.log(this.bsId);
        this.queryOrderList();
      } else {
        console.log("查询订单列表参数bsId", this.bsId);
      }
    },
    tabNav(item) {
      this.orderType = item;
      // switch (item) {
      //   case 1:
      //     break;
      //   default:
      //     break;
      // }
      // 查询订单列表
      this.queryOrderList();
    },
    getStartTime(e) {
      if (e) {
        this.startTime = timeFormat(e, "-", "yyyy-mm-dd") + " 00:00:00";
      } else {
        this.startTime = "";
      }
      if (this.endTime !== "") {
        // 查询订单列表
        this.queryOrderList();
      }
    },
    getEndTime(e) {
      if (e) {
        this.endTime = timeFormat(e, "-", "yyyy-mm-dd") + " 00:00:00";
      } else {
        this.endTime = "";
      }
      if (this.startTime !== "") {
        // 查询订单列表
        this.queryOrderList();
      }
    },
    async queryOrderList() {
      let res = await api.queryOrderList({
        query: {
          column: "createTime",
          order: "desc",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          type: this.orderType,
          bsId: this.bsId,
          startTime: this.startTime,
          endTime: this.endTime
        }
      });
      if (res.code === 0) {
        this.orderList = res.result.records;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/theme.scss";
.transactionInfo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(30);
  color: $fontColor1;
  background: $bgPageColor1;
  .content {
    width: 100%;
    height: 92%;
    padding: 0 vw(32);
    .topNav {
      width: 100%;
      border-radius: vw(10);
      background: $bgPageColor2;
      margin: vw(32) 0;
      padding: vw(32);
    }
    .sel {
      width: 100%;
      height: vw(64);
      display: flex;
      align-items: center;
      margin-bottom: vw(32);
      span {
        flex: 3;
        text-align: left;
      }
      .el-input__inner {
        height: vw(64) !important;
      }
      .select_element {
        flex: 7;
        .el-input--suffix {
          height: vw(64) !important;
          padding: 0 vw(20);
        }
      }
      .input_element {
        flex: 1;
      }
    }
    .selectDate {
      width: 100%;
      height: vw(64);
      display: flex; // margin-bottom: vw(40);
      .block {
        flex: 1;
        width: 49%;
        height: 100%; // padding-left: vw(35);
        background: #f5f5f5; // border: vw(1) solid #d1d1d1;
        display: flex;
        .el-date-editor {
          width: 98%;
          height: 100%;
          font-size: vw(24);
          .el-input__inner {
            background: #f5f5f5;
            height: vw(61);
            line-height: vw(61);
            margin-top: vw(1);
            margin-right: vw(1); // margin-left: vw(5)
            padding-left: vw(40);
          }
          .el-input__prefix {
            position: absolute;
            top: vw(-15);
            right: vw(100);
            margin: 0;
          }
          .el-icon-date:before {
            color: #2d9efd;
          }
        }
      }
      span {
        line-height: vw(64);
        margin: 0 vw(9);
      }
    }
    .selTime {
      display: flex;
      flex: 1;
      background: $bgPageColor2;
      .span {
        margin: 0 vw(25);
        align-self: center;
      }
    }
    .rieditor {
      width: vw(273);
      height: vw(64);
      position: relative;
    }
    .headTit {
      width: 100%;
      height: auto;
      padding: vw(32) 0;
      margin-bottom: vw(32);
      background: $bgPageColor3;
      color: $fontColor3;
      border-radius: vw(10);
      .cow {
        width: 100%;
        &:first-child {
          margin-bottom: vw(20);
        }
        display: flex;
        span {
          flex: 1;
        }
      }
    }
    .nav {
      width: 100%;
      height: vw(94);
      display: flex;
      align-items: center;
      border-radius: 0 vw(10);
      background: $bgPageColor2;
      border-bottom: vw(2) solid $borderColor1;
      color: $fontColor2;
      span {
        flex: 1;
        height: vw(94);
        line-height: vw(94);
        &:nth-child(2) {
          border-left: vw(1) solid $borderColor1;
          border-right: vw(1) solid $borderColor1;
        }
      }
    }
    .navActived {
      background: $bgPageColor3;
      color: $fontColor3;
    }
    .list {
      height: 60%;
      overflow-y: scroll;
      font-size: vw(28);
      color: $fontColor2;
    }
    ul {
      width: 100%;
      height: 50%;
      padding: vw(15) vw(32);
      background: white;
      display: flex;
      flex-direction: column;
      margin-bottom: vw(32);
      border-radius: vw(7);
      position: relative;
      .color_99 {
        color: #333333 !important;
      }
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
        align-items: center;
        text-align: left;
        span {
          &:first-child {
            flex: 3;
          }
          &:nth-child(2) {
            flex: 5;
          }
        }
      }
      .liButton {
        width: vw(110);
        height: auto;
        right: vw(32);
        position: absolute;
        height: vw(40);
        line-height: vw(40);
        // margin-top: vw(15);
        border: vw(1) solid $borderColor1; // border-radius: vw(4);
        font-size: vw(24);
        text-align: center;
      }
      .gre {
        color: #8ee750;
        border-color: #8ee750;
      }
      .blu {
        color: #56baf9;
        border-color: #56baf9;
      }
    }
  }
  .fullbg {
    background: url("../../../assets/full.png") no-repeat center;
    background-size: 50%;
  }
}
</style>