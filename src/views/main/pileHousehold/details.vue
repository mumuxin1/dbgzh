<template>
  <div class="houseHoldDetails">
    <mu-header class="muHeader" title="桩户详情" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="txone">
          <span>桩户名称</span>
          <input class="liInput" type="text" v-model="houseHoldDetails.bsName">
        </li>
        <!-- <li class="txone">
              <span class="">桩主联系方式</span>
              <input class="liInput" type="number">
            </li>-->
        <li class="txone">
          <span class="">桩户联系方式</span>
          <input class="liInput" type="number" v-model="houseHoldDetails.phone">
        </li>
        <!-- <li @click="openLocation">
          <span>地址</span>
          <div class="rticon">
            <span>请选择</span>
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
          </div>
        </li> -->
         <li class="txone">
          <span class="">地址</span>
          <input class="liInput" type="text" v-model="houseHoldDetails.address">
        </li>
        <li class="txone">
          <span class="">营业时间</span>
          <div class="selTime">
            <div class="editor">
              <el-time-picker v-model="startTime" placeholder="00:00" :editable="false" value-format="00:00" :picker-options="{
                        start: '00:00',
                        end: '23:59',
                        format: 'HH:mm'
                      }"></el-time-picker>
            </div>
            <span class="span">至</span>
            <div class="editor">
              <el-time-picker v-model="endTime" placeholder="00:00" :editable="false" value-format="00:00" :picker-options="{
                        start: '00:00',
                        end: '23:59',
                        format: 'HH:mm'
                      }"></el-time-picker>
            </div>
          </div>
        </li>
        <li class="txone">
          <span class="">营业固话</span>
          <input class="liInput" type="text" v-model="fixedTelephone">
        </li>
        <li class="txone">
          <span class="">泊位费价格</span>
          <span class="color_99">{{parkFee}}元</span>
        </li>
        <li class="txone">
          <span class="">电费价格</span>
          <span class="color_99">{{elerFee}}元</span>
        </li>
      </ul>
    </div>
    <div class="navsButton" @click="save">保存</div>
  </div>
</template>
<script>
  import muheader from "../../../components/header";
  import wx from "weixin-js-sdk";
  import api from "@/api/api";
  import {
    STROAGE,
    timeFormat,
    NAVIGATOR
  } from "@/utils/muxin";
  import {
    constants
  } from "fs";
  export default {
    name: "houseHoldDetails",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        houseHoldDetails: {},
        reName: "", // 修改名称
        startTime: new Date(2019, 1, 10, 0, 0),
        endTime: new Date(2019, 7, 10, 23, 59),
        startTime2: "", // 开始时间请求参数
        endTime2: "",
        fixedTelephone: "", // 固话
        openTime: "", // 开放时间
        bsId: ''
      };
    },
    created() {
      this.data_Init();
      // 查询桩户详情
      this.queryBsInfo(this.bsId)
    },
    filters: {
      moneyFormat: params => {
        return (params / 100).toFixed(2);
      }
    },
    computed: {
      parkFee() {
        if (this.houseHoldDetails.dbBaseStationCharging) {
          return (this.houseHoldDetails.dbBaseStationCharging.parkFee / 100).toFixed(2);
        }
      },
      elerFee() {
        if (!this.houseHoldDetails.dbBaseStationCharging) return ''
        let a = this.houseHoldDetails.dbBaseStationCharging.chFee
        return (a / 100).toFixed(2)
      }
    },
    methods: {
      openLocation() {
        wx.getLocation({
          type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            wx.openLocation({
              latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
              longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
              name: "", // 位置名
              address: "", // 地址详情说明
              scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
              infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
            });
          }
        });
      },
      data_Init() {
        this.bsId = location.href.split('=')[1]
        let houseHoldDetails = JSON.parse(
          STROAGE({
            type: "getItem",
            key: "HouseHoldDetails"
          })
        );
        if (houseHoldDetails) {
          this.houseHoldDetails = houseHoldDetails;
          if (this.houseHoldDetails.dbBaseStationCharging) {
            this.fixedTelephone = this.houseHoldDetails.dbBaseStationCharging.fixedTelephone
          } else {
            this.fixedTelephone = 'this.houseHoldDetails.dbBaseStationCharging.fixedTelephone'
          }
        }
        console.log(this.fixedTelephone);
      },
      save() {
        // this.userName = "";
        this.startTime2 = timeFormat(this.startTime, ":", "00:00");
        this.endTime2 = timeFormat(this.endTime, ":", "00:00");
        this.openTime = this.startTime2 + "-" + this.endTime2;
        console.log(this.openTime);
        this.updateBsInfo();
      },
      // 更新桩户详情
      async updateBsInfo() {
        let res = await api.updateBsInfo({
          method: "POST",
          query: {
            bsId: this.houseHoldDetails.bsId,
            bsName: this.houseHoldDetails.bsName,
            phone: this.houseHoldDetails.phone,
            address: "广东省天河区中山大道广海大厦222",
            businessHours: this.openTime,
            fixedTelephone: this.houseHoldDetails.dbBaseStationCharging
              .fixedTelephone
          }
        });
        if (res.code === 200) {
          this.$router.go(-2);
        }
      },
      // 查询桩户详情
      async queryBsInfo(bsId) {
        let res = await api.queryBsInfo({
          query: {
            bsId: bsId
          }
        });
        if (res.code === 0) {
          STROAGE({
            type: "setItem",
            key: "HouseHoldDetails",
            item: res.result
          });
          this.houseHoldDetails = res.result
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../styles/theme.scss";
  .houseHoldDetails {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    color: #333333;
    .content {
      background: white;
      margin: vw(32);
      margin-bottom: 0;
      overflow-y: scroll;
      border-radius: vw(7);
      ul {
        width: 100%;
        height: auto;
        padding: 0 vw(32);
        background: white;
        flex-direction: column;
        position: relative;
        li {
          width: 100%;
          height: vw(120);
          display: flex;
          text-align: left;
           font-size: vw(28);
          justify-content: space-between;
          align-items: center;
          border-bottom: vw(1) solid #e5e5e5;
        }
        .selTime {
          display: flex;
          justify-content: flex-end;
          flex: 1;
          align-items: center;
          .editor {
            width: vw(132);
            height: vw(64);
            position: relative;
          }
          .span {
            margin: 0 vw(26);
            align-self: center;
          }
          /deep/ {
            .el-date-editor {
              width: vw(140);
            }
            .el-input__inner {
              padding: 0;
              text-align: center;
            }
            .el-input__prefix {
              .el-input__inner {
                padding: 0;
              }
              display: none;
            }
          }
        }
        .liInput {
          border: 0;
          height: vw(120);
          line-height: vw(120);
          text-align: right;
          flex: 1;
            font-size: vw(28);

        }
        .rticon {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: vw(120);
          flex: 1;
          span {
            margin-right: vw(16);
            align-self: center;
          }
          img {
            width: vw(16);
            height: vw(28);
          }
          input {
            width: vw(200);
            height: vw(120); 
            text-align: right;
          }
        }
      }
    }
    .navsButton {
      width: 92%;
      height: vw(90);
      line-height: vw(90);
      color: white;
      background: #56baf9;
      border-radius: vw(5);
      margin: 0 vw(32);
      margin-top: vw(30);
    }
  }
</style>