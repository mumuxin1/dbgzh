<template>
  <div class="useNext">
    <mu-header class="muHeader" title="使用充电桩" :left="true" :back="true" :route="route"></mu-header>
    <div class="content">
      <div class="tit">请扫描设备二维码</div>
      <div class="getcode" :class="getCode === null ? 'fullInput': ''">
        <input type="text" :placeholder="placeholde" v-model="getCode" @blur="blur">
        <img src="@/assets/dian_my_shiyong_saoyisao@3x.png" alt="" @click="scanCode">
      </div>
      <div class="tit">当前设备编号:</div>
      <div class="getcode">
        {{sn}}
      </div>
    </div>
    
    <span  class="span" v-if="chargeSt">充电中...</span>
    <div class="wave1" @click="useing" v-if="chargeSt">
      停止使用
    </div>
    <div class="wave" @click="useing" v-if="!chargeSt">
      开始使用
    </div>
  </div>
</template>
<script>
  import muheader from "@/components/header";
  import {
    MessageBox
  } from 'element-ui'
  import wx from 'weixin-js-sdk'
  import {
    STROAGE
  } from "@/utils/muxin";
  import api from "@/api/api";
  export default {
    name: "useNext",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        getCode: '', // 
        selText: '', // 下拉选择neirong
        chargeSt: 0,
        route: '',
        placeholde: '扫描二维码或输入编码'
      };
    },
    created() {
      this.data_Init()
      // 查询设备开关状态
      this.queryDeviceStatus(this.sn)
      // 处理websocket消息
      this.webSocketCallback()
    },
    methods: {
      data_Init() {
        this.route = location.href.split('=')[1] || ''
        let sn = STROAGE({
          type: "getItem",
          key: "Sn"
        });
        if (sn) {
          this.sn = sn
        }
      },
      blur() {
        // console.log('sss')
        // 校验sn
        this.checkSn(this.getCode)
      },
      scanCode() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
           let sn = res.resultStr.split('/').pop()
            this.checkSn(sn)
          }
        });
      },
      useing() {
        if (this.chargeSt) {
          let options = {
            title: '',
            message: '是否停止充电？',
            showCancelButton: true,
            center: true
          }
          MessageBox(options).then(
            (actions) => {
              if (actions === 'confirm') {
                // 关闭充电桩
                this.turnOff(this.sn)
              }
            }
          ).catch(
            () => {
              console.log('取消')
            })
        } else {
          // 打开充电桩
          this.turnOn(this.sn)
        }
      },
      // 校验sn
      async checkSn(sn) {
        let res = await api.checkSn({
          query: {
            sn: sn
          }
        });
        if (res.code === 0) {
          this.sn = sn
          STROAGE({
          type: "setItem",
          key: "Sn",
          item: sn
        });
        } else {
         this.getCode = null
        this.placeholde = res.message
        }
      },
      // 打开充电桩
      async turnOn(sn) {
        let res = await api.turnOn({
          query: {
            sn: sn
          }
        });
        if (res.code === 0) {
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
          // this.$parent.requestCallback({
          //   message: res.message,
          //   type: 'error',
          //   center: true,
          //   offset: 200
          // })
        }
      },
      // 关闭充电桩
      async turnOff(sn) {
        let res = await api.turnOff({
          query: {
            sn: sn
          }
        });
        if (res.code === 0) {
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
        }
      },
      // 查询设备开关状态
      async queryDeviceStatus(sn) {
        let res = await api.queryDeviceStatus({
          query: {
            sn: sn
          }
        });
        if (res.code === 0) {
          // ...
        } else {
          this.getCode = null
          this.placeholde = res.message
          this.$parent.requestCallback({
            message: res.message,
            type: 'error',
            center: true,
            offset: 200
          })
        }
      },
      webSocketCallback() {
        this.$parent.webSocketCallback = res => {
          if (res.data === 'ping') return false;
          let data = JSON.parse(res);
          switch (data.cmd) {
            case '0001':
              if (data.result === '00') {
                this.chargeSt = 1;
              }
              break;
            case '0002':
              if (data.result === '00') {
                this.chargeSt = 0;
              }
              break;
            case '0005':
              if (data.data.deviceStatus === 0) {
                this.chargeSt = 0
              } else if (data.data.deviceStatus === 1) {
                this.chargeSt = 1
              }
              break
            default:
              break;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .useNext {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    .content {
      height: auto;
      background: white;
      margin: vw(30); // overflow-y: scroll;
      margin-bottom: 0;
      padding: vw(25) vw(30);
      padding-bottom: 0;
      position: relative;
      .tit {
        text-align: left;
        margin-bottom: vw(24);
        color: #333333;
      }
      .getcode {
        width: 100%;
        background: #f6f6f6;
        padding: 0 vw(32);
        display: flex;
        justify-content: space-between;
        height: vw(90);
        align-items: center;
        margin-bottom: vw(32);
        input {
          flex: 1;
          height: vw(90);
          line-height: vw(90)
        }
        img {
          width: vw(44);
          height: vw(44);
        }
      }
      .state {
        display: flex;
        justify-content: space-around;
        margin-bottom: vw(32);
        span {
          width: vw(186);
          height: vw(64);
          line-height: vw(64);
          border: vw(1) solid #e5e5e5;
        }
        .active {
          color: $fontColor;
          border-color: $fontColor;
        }
      }
    }
    .wave {
      width: vw(280);
      height: vw(280);
      line-height: vw(280);
      align-self: center;
      background: url('../../../assets/dianbtn.png');
      background-size: cover;
      // margin-top: vw(192);
      color: white;
      position: absolute;
      top: 55%;
    }
    .wave1 {
      width: vw(280);
      height: vw(280);
      line-height: vw(280);
      align-self: center;
      background: url('../../../assets/bgUseing.png');
      background-size: cover;
      color: white;
      position: absolute;
      top: 55%;
    }
    .span {
      // margin-top: vw(172);
      // margin-bottom: vw(20);
      position: absolute;
      top: 49%;
      left: 45%;
    }
    .button {
      height: vw(90);
      line-height: vw(90);
      margin: vw(32) vw(30);
      color: white;
    }
    .fullInput ::placeholder {
      color: red;
    }
  }
</style>