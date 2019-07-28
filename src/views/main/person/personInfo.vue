<template>
  <div class="personInfo">
    <mu-header class="muHeader" title="我的充电桩" :left="false" :back="true"></mu-header>
    <div class="content">
      <div class="top">
        <div class="headerPic" @click="$router.push('/step1')">
          <img :src="userInfo.userInfo.avatar" alt="">
        </div>
        <div class="info">
          <!-- <div class="cow">
                    <span class="tit">昵称</span>
                    <span class="txt">{{userInfo.userInfo.avatar.realname}}</span>
          </div>-->
          <div class="cow">
            <span class="tit">号码</span>
            <span class="txt">{{userInfo.userInfo.phone}}</span>
          </div>
          <div class="cow">
            <span class="tit">姓名</span>
            <span class="txt">{{userInfo.userInfo.realname}}</span>
          </div>
        </div>
      </div>
      <div class="list" @click="$router.push('/login')">
        <div class="tit">切换账号</div>
        <div class="icon">
          <img src="@/assets/dianbo_public_right@3x.png" alt="">
        </div>
      </div>
      <div class="footnav">
        <div class="lis" @click="menu(1)">
          <img src="@/assets/dian_my_chongdianzhuang@3x.png" alt="">
          <span>使用充电桩</span>
        </div>
        <div class="lis" @click="menu(2)">
          <img src="@/assets/dian_my_dianzhan@3x.png" alt="">
          <span>我的电站</span>
        </div>
        <div class="lis" @click="menu(3)">
          <img src="@/assets/dian_my_chaxun@3x.png" alt="">
          <span>交易查询</span>
        </div>
        <div class="lis" v-if="userInfo.userInfo.userType !==3 " @click="menu(4)">
          <img src="@/assets/dian_my_qianbao@3x.png" alt="">
          <span>我的钱包</span>
        </div>
        <div class="lis" @click="menu(5)">
          <img src="@/assets/dian_my_zhuanghu@3x.png" alt="">
          <span>桩户信息</span>
        </div>
        <div class="lis" v-if="userInfo.userInfo.userType !== 3" @click="menu(6)">
          <img src="@/assets/dian_my_jilu@3x.png" alt="">
          <span>申请记录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import muheader from "../../../components/header";
import { STROAGE } from "@/utils/muxin";
import api from "@/api/api";
import wx from "weixin-js-sdk";
const defauImg = require("../../../assets/dian_my_userpic@3x.png");
export default {
  name: "personInfo",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      userInfo: "",
      pageNo: 1,
      pageSize: 10
    };
  },
  created() {
    this.data_Init();
  },
  methods: {
    data_Init() {
      let userInfo = STROAGE({
        type: "getItem",
        key: "UserInfo"
      });
      userInfo = JSON.parse(userInfo);
      this.userInfo = userInfo;
      if (!this.userInfo.userInfo.avatar) {
        this.userInfo.userInfo.avatar = defauImg;
      }
      this.pageSize = Math.ceil(this.$parent.clientHeight / 220);
      console.log(this.pageSize);
    },
    menu(id) {
      switch (id) {
        case 1:
          // 使用电桩
          // 查询当前后台用户是否存在正在控制的设备
          this.checkUserControlStatus();
          break;
        case 2:
          // 我的电站
          // 查询我的电站列表
          this.queryChargList();
          this.$router.push("/myChargePile");
          break;
        case 3:
          // 交易查询
          // 查询我的电站列表
          this.queryChargList();
          this.$router.push("/transactionInfo");
          break;
        case 4:
          wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            }
          });
          break;
        case 5:
          // 桩户信息
          // 查询桩户信息
          this.queryChargList();
          this.$router.push("/pileHousehold");
          break;
        case 6:
          // 申请记录
          // 查询申请记录
          this.queryApplyList();
          this.$router.push("/applicationRecord");
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
          column: "createTime",
          order: "desc",
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      });
      if (res.code === 0) {
        STROAGE({
          type: "setItem",
          key: "ChargeList",
          item: res.result.records
        });
      }
    },
    // 查询申请记录
    async queryApplyList() {
      let res = await api.queryApplyList({
        query: {
          column: "createTime",
          order: "desc",
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      });
      if (res.code === 0) {
        STROAGE({
          type: "setItem",
          key: "ApplyList",
          item: res.result.records
        });
      }
    },
    // 查询当前后台用户是否存在正在控制的设备
    async checkUserControlStatus() {
      let res = await api.checkUserControlStatus();
      if (res.code === 0) {
        this.$router.push("/useNext");
      } else {
        this.$router.push("useing");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/theme.scss";
.personInfo {
  // background: url("../../assets/背景@3x.png") no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(28);
  .content {
    flex: 1;
    background: #f6f6f6;
    padding: vw(30);
    .top {
      width: 100%;
      height: vh(332);
      border-radius: vw(10);
      padding: 0 vw(36);
      display: flex;
      margin-bottom: vw(30);
      background: #56baf9;
      position: relative;
      align-items: center;
      .headerPic {
        width: vw(132);
        height: 100%;
        display: flex;
        img {
          width: vw(132);
          height: vw(132);
          margin-left: vw(63);
          align-self: center;
          border: vw(4) solid white;
          border-radius: 50%;
          margin: 0;
        }
      }
      .info {
        flex: 1;
        margin-left: vw(62);
        color: white;
        .cow {
          width: 100%;
          text-align: left;
          height: vw(56);
          line-height: vw(56);
          .tit {
            margin-right: vw(20);
          }
        }
      }
    }
    .list {
      width: 100%;
      padding: 0 vw(30);
      height: vw(120);
      line-height: vw(120);
      display: flex;
      background: white;
      margin-bottom: vw(30);
      justify-content: space-between;
      border-radius: vw(5);
      .tit {
        flex: 1;
        height: vw(120);
        line-height: vw(120);
        text-align: left;
      }
      .icon {
        width: vw(60);
        height: vw(120);
        margin-bottom: vw(30);
        img {
          width: vw(16);
          height: vw(30);
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    .footnav {
      width: 100%;
      display: flex; // justify-content: space-around;
      background: white;
      border-radius: vw(10);
      flex-wrap: wrap;
      padding-bottom: vw(45);
      .lis {
        width: 33%;
        height: vw(100);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: vw(44);
        img {
          width: vw(48);
          height: vw(48);
        }
        span {
          color: #333333;
          margin-top: vw(20);
        }
      }
    }
    .disabled {
      height: vw(87);
      line-height: vw(87);
    }
    .disabled {
      color: #999999;
      background: #e5e5e5;
    }
  }
}
</style>