<template>
  <div class="personInfo">
    <mu-header class="muHeader" title="我的充电桩" :left="false" :back="true"></mu-header>
    <div class="content">
      <div class="top" @click="pageDebugs">
        <!-- @click="$router.push('/step1')" -->
        <div class="headerPic">
          <img :src="avatar" alt="">
        </div>
        <div class="info">
          <!-- <div class="cow">
                            <span class="tit">昵称</span>
                            <span class="txt">{{userInfo.userInfo.avatar.realname}}</span>
              </div>-->
          <div class="cow">
            <span class="tit">号码</span>
            <span class="txt">{{userInfo.phone}}</span>
          </div>
          <div class="cow">
            <span class="tit">姓名</span>
            <span class="txt">{{userInfo.realname}}</span>
          </div>
        </div>
      </div>
      <div class="list" @click="logOut">
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
        <div class="lis" v-if="userInfo.userType !==3 " @click="menu(4)">
          <img src="@/assets/dian_my_qianbao@3x.png" alt="">
          <span>我的钱包</span>
        </div>
        <div class="lis" @click="menu(5)">
          <img src="@/assets/dian_my_zhuanghu@3x.png" alt="">
          <span>桩户信息</span>
        </div>
        <div class="lis" v-if="userInfo.userType !== 3" @click="menu(6)">
          <img src="@/assets/dian_my_jilu@3x.png" alt="">
          <span>申请记录</span>
        </div>
        <div class="lis" v-if="userInfo.userType !== 3" @click="menu(7)">
          <img src="@/assets/dian_my_guazhangweixiu@3x.png" alt="">
          <span>设备故障</span>
        </div>
        <div class="lis" v-if="userInfo.userType !== 3" @click="menu(8)">
          <img src="@/assets/dian_my_yijifanfankui@3x.png" alt="">
          <span>意见反馈</span>
        </div>
      </div>
      <div class="box"></div>
    </div>
  </div>
</template>
<script>
  import muheader from "../../../components/header";
  import {
    STROAGE
  } from "@/utils/muxin";
  import api from "@/api/api";
  import websocket from '@/utils/webSocket'
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
        pageSize: 10,
        pageDebug: 0,
        avatar: ''
      };
    },
    created() {
      this.data_Init();
      this.wxConfig()
      this.socket_init()
      console.log(this.$parent)
    },
    methods: {
      wxConfig() {
        let url = window.location.href.split('#')[0]
        // url = url.substr(0, url.length - 1)
        // 查询微信JSSDK权限验证配置参数
        this.signature(url)
      },
      pageDebugs() {
        this.pageDebug++
          console.log(this.pageDebug)
        if (this.pageDebug > 3) {
          this.$router.push('/step1')
          this.pageDebug = 0
        }
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
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.result.appId, // 必填，公众号的唯一标识
            timestamp: res.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
            signature: res.result.signature, // 必填，签名
            jsApiList: ['openLocation', 'getLocalImgData', 'scanQRCode', 'chooseImage'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function() {})
          wx.error(function(res) {
            console.log(res)
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
        }
      },
      socket_init() {
        let userInfo = STROAGE({
          type: 'getItem',
          key: 'UserInfo'
        })
        if (userInfo) {
          userInfo = JSON.parse(userInfo).userInfo
          let userId = userInfo.id
          let url = `//47.112.22.47:8082/shared-admin/websocket?userid=${userId}`
          // let url = `//192.168.1.132:8088/shared-admin/websocket?userid=${userId}`
          this.$parent.webSocket = websocket(url)
          this.$parent.webSocket.onmessage = (message) => {
            console.log(message.data)
            this.$parent.webSocketData = message.data
            this.$parent.webSocketCallback(message.data)
          }
        }
      },
      data_Init() {
        let userInfo = STROAGE({
          type: "getItem",
          key: "UserInfo"
        });
        console.log(userInfo, 'kskk')
        if (userInfo) {
          userInfo = JSON.parse(userInfo);
          this.userInfo = userInfo.userInfo;
          try {
            if (!this.userInfo.avatar) {
              this.avatar = 'http://file.startai.com.cn:3108/group1/M00/00/07/wKgQzV0S_uGAZkdAAAOrde8OqK8558.png';
            } else {
              this.avatar = this.userInfo.avatar
            }
          } catch (err) {
          }
        }
        this.pageSize = Math.ceil(this.$parent.clientHeight / 220);
        console.log(this.pageSize);
      },
      // 退出登录
      logOut() {
        this.$router.push("/");
        STROAGE({
          type: "clear"
        });
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
            this.$router.push('/wallet')
            //查询钱包信息
            this.queryUserWalletInfo()
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
          case 7:
            // 查询故障设备列表
            this.queryFailureEquList();
            this.$router.push("/equimentFailure");

            break;
          case 8:
            //意见反馈
            this.$router.push("/feedBack");
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
      // 查询故障设备列表
      async queryFailureEquList() {
        let res = await api.queryFailureEquList({
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
            key: "FailureEquList",
            item: res.result.records
          });

        }
      },
      // 查询当前后台用户是否存在正在控制的设备
      async checkUserControlStatus() {
        let res = await api.checkUserControlStatus();
        if (res.code === 0) {
          if (res.result.status === 1) {
            console.log('ss', res.result.status)
            this.$router.push("/useNext");
            STROAGE({
              type: "setItem",
              key: "Sn",
              item: res.result.sn
            });
          } else {
            this.$router.push("useing");
          }
        } else {
          //...
        }
      },
      // 查询钱包信息
      async queryUserWalletInfo() {
        let res = await api.queryUserWalletInfo();
        if (res.code === 0) {
          STROAGE({
            type: "setItem",
            key: "WalletInfo",
            item: res.result
          });
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
    font-size: vw(28); // .box{
    //   background: red;
    //   width: 185px;
    //   height: 50px;
    // }
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
        background: $bgPageColor3;
        align-items: center;
        margin-bottom: vw(32);
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
</style>