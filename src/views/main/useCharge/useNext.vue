<template>
  <div class="useNext">
    <mu-header class="muHeader" title="使用充电桩" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="tit">请扫描设备二维码</div>
      <div class="getcode">
        <input type="text" :placeholder="placeholde" v-model="getCode" @blur="blur">
        <img src="@/assets/dian_my_shiyong_saoyisao@3x.png" alt="" @click="scanCode">
      </div>
      <div class="tit">充电桩状态</div>
      <div class="state">
        <span>上架</span>
        <span>下架</span>
        <span>离线</span>
      </div>
    </div>
    <div class="wave" @click="useing" v-if="!chargeSt">
      开始使用
    </div>
    <span v-if="chargeSt" class="span">充电中...</span>
    <div class="wave1" @click="useing" v-if="chargeSt">
      停止使用
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
        placeholde: '扫描二维码或输入编码'
      };
    },
    created() {
      this.data_Init()
      // 查询设备开关状态
      this.queryDeviceStatus()
      // 处理websocket消息
      this.webSocketCallback()
    },
    methods: {
      data_Init() {
        let sn = STROAGE({
          type: "getItem",
          key: "Sn"
        });
        if (sn) {
          this.getCode = sn
        }
      },
      blur() {
        // console.log('sss')
        // 校验sn
        this.checkSn()
      },
      scanCode() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            this.getCode = res.resultStr.split('/').pop()
            this.checkSn()
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
                this.turnOff()
              }
            }
          ).catch(
            () => {
              console.log('取消')
            })
        } else {
          // 打开充电桩
          this.turnOn()
        }
      },
      // 校验sn
      async checkSn() {
        let res = await api.checkSn({
          query: {
            sn: this.getCode
          }
        });
        if (res.code === 0) {
          STROAGE({
          type: "setItem",
          key: "Sn",
          item: this.getCode
        });
        } else {
         this.getCode = ''
        this.placeholde = '无效sn,请重新输入或者检查二维码是否正确'
        }
      },
      // 打开充电桩
      async turnOn() {
        let res = await api.turnOn({
          query: {
            sn: '93D342A061E40BA0'
          }
        });
        if (res.code === 0) {
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
        }
      },
      // 关闭充电桩
      async turnOff() {
        let res = await api.turnOff({
          query: {
            sn: '93D342A061E40BA0'
          }
        });
        if (res.code === 0) {
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
        }
      },
      // 查询设备开关状态
      async queryDeviceStatus() {
        let res = await api.queryDeviceStatus({
          query: {
            sn: '93D342A061E40BA0'
          }
        });
        if (res.code === 0) {
          // ...
        } else {
          this.getCode = ''
          this.placeholde = '无效sn,请重新输入或者检查二维码是否正确'
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
      margin-top: vw(192);
      color: white;
    }
    .wave1 {
      width: vw(280);
      height: vw(280);
      line-height: vw(280);
      align-self: center;
      background: url('../../../assets/bgUseing.png');
      background-size: cover;
      color: white;
    }
    .span {
      margin-top: vw(172);
      margin-bottom: vw(20)
    }
    .button {
      height: vw(90);
      line-height: vw(90);
      margin: vw(32) vw(30);
      color: white;
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
      position: relative;
      top: vw(-45);
      left: vw(-222);
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