<template>
  <div class="applicationEquiment">
    <mu-header class="muHeader" title="申请设备" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="tit">泊位信息</li>
        <li class="txFull">
          <span>合作类型</span>
          <el-select v-model="selText" placeholder="请选择" class="select_element">
            <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li class="txone" @click="deviceType">
          <span>设备类型</span>
          <input type="text" class="inputs" placeholder="选择设备类型" v-model="selDevices.deviceModelName">
          <img src="@/assets/dianbo_shenqing_shuaixuan@3x.png" alt="" class="img">
        </li>
        <li class="txone">
          <span>设备数量</span>
          <input type="number" class="inputs" placeholder="请输入数量" v-model="deviceNum">
          <span class="span">台</span>
        </li>
        <span class="des"><font style="fontWeight: bold">图片信息</font>(至少3张)</span>
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
    <div class="button-g button" @click="submit">
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
import { async } from 'q';
  export default {
    name: "applicationEquiment",
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
          label: '投资'
        }],
        selDevices: [],
        deviceNum: ''
      };
    },
    created() {
      this.data_Init()
    },
    methods: {
      data_Init() {
        // 。。。
        let selDevices = STROAGE({
        type: 'getItem',
        key: 'selDevicesType'
      })
      if (selDevices) {
        this.selDevices =JSON.parse(selDevices)
      }
      },
      deviceType () {
        this.$router.push('chargeType')
        // 查询申请设备类型
        this.queryDeviceApplyList()
      },
      submit () {
        // 申请设备
        this.applicationEquiment(this.$parent.bsId)
      },
      // 申请设备
      async applicationEquiment(bsId) {
        let res = await api.applicationEquiment({
          method: 'POST',
          query: {
            bsId: bsId,
            merchantCooperation: this.selText,
            deviceModel: this.selDevices.id,
            deviceNum: this.deviceNum,
            parkImgs: 'img/demo.png'
          }
        })
        if (res.code === 200) {
          this.$router.push('/reviewProgress')
        }
      },
      // 查询申请设备类型
      async  queryDeviceApplyList () {
        let res = await api.queryDeviceApplyList({
          query: {
            column: 'createTime',
            order: 'desc',
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            hangType: ''
          }
        })
        if (res.code === 0) {
          STROAGE({
            type: 'setItem',
            key: 'DevicesTypeList',
            item: res.result.records
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .applicationEquiment {
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
        padding-bottom: vw(32);
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
            padding: 0 vw(32);
            
          }
          .span{
              width: vw(48);
              text-align: center;
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