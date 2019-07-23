<template>
  <div class="appicationEquiment">
    <mu-header class="muHeader" title="申请设备" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="tit">泊位信息</li>
        <li class="txFull">
          <span>合作类型</span>
          <el-select v-model="selText" placeholder="请选择" class="select_element" @change="change">
            <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li class="txone">
          <span>设备类型</span>
          <input type="text" class="inputs">
          <img src="@/assets/dianbo_shenqing_shuaixuan@3x.png" alt="" class="img">
        </li>
        <li class="txone">
          <span>设备数量</span>
          <input type="text" class="inputs">
          <span>台</span>
        </li>
       
        <span class="des">图片信息(至少3张)</span>
        <span class="des">请选择充电点环境照片</span>
         <div class="upImg">
        <div class="selImg">
          <img src="" alt="">
          <span>添加图片</span>
        </div>
        <div class="uploadImg">
          <img src="" alt="" class="img">
          <img src="" alt="" class="del">
        </div>
      </div>
        <p class="txdes">自用设备：只能被指定用户/车牌使用，平台显示在总数中 ，不能预定不能扫码，商户可修改状态
        </p>
      </ul>
    </div>
    <div class="button-g button">
      提交申请
    </div>
  </div>
</template>
<script>
  import {
    STROAGE
  } from '@/utils/muxin'
  import muheader from "@/components/header";
  import api from '@/api/api'
  export default {
    name: "appicationEquiment",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        chargeData: [],
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
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .appicationEquiment {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    .content {
      margin: vw(30);
      overflow-y: scroll;
      height: auto;
      ul {
        width: 100%;
        height: auto;
        padding: 0 vw(32);
        background: white;
        display: flex;
        flex-direction: column;
        margin-bottom: vw(32);
        border-radius: vw(7);
        .tit {
          font-size: vw(30);
          color: #333333;
          font-weight: bold;
        }
        li {
          width: 100%;
          height: vw(90);
          display: flex;
          text-align: left;
          font-size: vw(30);
          color: #333333;
          align-items: center;
          margin-bottom: vw(32);
          &:first-child {
            margin-bottom: 0;
          }
        }
        .txFull {
          .select_element {
            width: vw(470);
            height: vw(90);
            .el-input--suffix {
              height: vw(64) !important;
              padding: 0 vw(20);
            }
          }
          span {
            flex: 2.5;
            margin-right: vw(32);
          }
          .text {
            align-self: center;
            flex: 7.5
          }
        }
        .txone {
          .inputs {
            width: vw(390);
            height: vw(90);
            line-height: vw(90);
            border: vw(1) solid #e5e5e5;
            border-radius: vw(5);
            margin-right: vw(32);
          }
          .img {
            width: vw(48);
            height: vw(48);
            align-self: center;
          }
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
      }
      .des{
        margin-bottom: vw(32);
        color: #333333;
        text-align: left;
      }
      .bold{
        font-weight: bold;
      }
      .txdes{
        font-size: vw(24);
        color: #999999;
        line-height: vw(46);
        text-align: left;

      }
      .upImg{
        width: 100%;
        height: vw(150);
        flex-wrap: wrap;
        display: flex;
        margin-bottom: vw(32);
        img{
          width: vw(60);
          height: vw(48);
          background: red;
          margin: vw(26);
        }
        .selImg{
          display: flex;
        flex-direction: column;
        align-items: center;
          width: vw(150);
          height: vw(150);
          background: #f5f5f5;
        }
        .uploadImg{
          width: vw(150);
          height: vw(150);
          position: relative;
          margin-right: vw(7);
          .img{
            width: vw(150);
            height: vw(150);
            display: block;
            background: greenyellow;
            margin: 0;
          }
          .del{
            width: vw(46);
            height: vw(46);
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
          }
        }
      }
    
    }
    .button {
      width: 94%;
      height: vw(90);
      line-height: vw(90);
      color: white;
      background: #56baf9;
      border-radius: vw(5);
      margin-top: vw(30);
      margin:  0 auto;
    }
  }
  /deep/ {
    // select
    .el-input__inner {
      height: vw(90);
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