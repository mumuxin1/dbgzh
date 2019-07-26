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
        <li @click="openLocation">
          <span>地址</span>
          <div class="rticon">
            <span>请选择</span>
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
          </div>
        </li>
        <li class="txone">
          <span class="">营业时间</span>
          <div class="selTime">
            <div class="editor">
              <el-time-picker v-model="startTime" placeholder="00:00"></el-time-picker>
            </div>
            <span class="span">至</span>
            <div class="editor">
              <el-time-picker v-model="endTime" placeholder="00:00"></el-time-picker>
            </div>
          </div>
        </li>
        <li class="txone">
          <span class="">营业固话</span>
          <input
            class="liInput"
            type="text"
            v-model="houseHoldDetails.dbBaseStationCharging.fixedTelephone"
          >
        </li>
        <li class="txone">
          <span class="">泊位费价格</span>
          <span class="color_99">{{houseHoldDetails.dbBaseStationCharging.parkFee | moneyFormat}}元</span>
        </li>
        <li class="txone">
          <span class="">电费价格</span>
          <span class="color_99">{{houseHoldDetails.dbBaseStationCharging.chFee | moneyFormat}}元</span>
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
import { STROAGE, timeFormat, NAVIGATOR } from "@/utils/muxin";
import { constants } from "fs";
export default {
  name: "houseHoldDetails",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      houseHoldDetails: {},
      reName: "", // 修改名称
      startTime: "",
      endTime: "",
      startTime2: "", // 开始时间请求参数
      endTime2: "",
      fixedTelephone: "", // 固话
      openTime: "" // 开放时间
    };
  },
  created() {
    this.data_Init();
    this.wxConfig();
  },
  filters: {
    moneyFormat: params => {
      return (params / 100).toFixed(2);
    }
  },
  methods: {
    wxConfig() {
      let na = NAVIGATOR();
      console.log(na);
      if (na === "Wechat") {
      } else {
        console.log("请在微信网页调试");
        let url = location.href.split("#")[0];
        // url = url.substr(0, url.length - 6)
        // 查询微信JSSDK权限验证配置参数
        this.signature(url);
      }
    },
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
            scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
          });
        }
      });
    },
    // 查询微信JSSDK权限验证配置参数
    async signature(url) {
      let res = await api.signature({
        query: {
          url: url
        }
      });
      if (res.code === 0) {
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.result.appId, // 必填，公众号的唯一标识
          timestamp: res.result.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
          signature: res.result.signature, // 必填，签名
          jsApiList: ["openLocation", "getLocalImgData", "scanQRCode"] // 必填，需要使用的JS接口列表
        });
        wx.ready(function() {});
        wx.error(function(res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
        // console.log('有效sn')
      } else {
        // console.log('无效sn')
      }
    },
    data_Init() {
      let houseHoldDetails = JSON.parse(
        STROAGE({
          type: "getItem",
          key: "HouseHoldDetails"
        })
      );
      if (houseHoldDetails) {
        this.houseHoldDetails = houseHoldDetails;
        // this.fixedTelephone = parseInt(this.houseHoldDetails.dbBaseStationCharging.fixedTelephone)
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
      }
      .liInput {
        border: 0;
        height: vw(120);
        line-height: vw(120);
        text-align: right;
        flex: 1;
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
          font-size: vw(28);
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
  } // Input
  .input_element .el-input__inner {
    padding-left: vw(60);
  }
  .el-input__prefix {
    position: absolute;
    top: vw(20); // right: vw(180);
    left: vw(-10);
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