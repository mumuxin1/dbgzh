<template>
  <div class="chargeDevices">
    <mu-header class="muHeader" title="电桩设备" :left="true" :back="true"></mu-header>
    <div class="sel">
      <el-select v-model="selText" placeholder="请选择" class="select_element" @change="change">
        <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="请输入设备编号" prefix-icon="el-icon-search" v-model="searText" class="input_element" @blur="blur">
      </el-input>
    </div>
    <div class="content" :class="deviceList.length > 0? '' : 'fullbg'">
      <div class="nums">设备总数: {{deviceList.length}}</div>
      <ul v-for="item in deviceList" :key="item.index" @click="details(item.sn)">
        <li class="txone">
          <span class="color_99">设备名称</span><span>{{item.cpName}}</span>
          <div class="liButton">
          </div>
        </li>
        <li class="txone">
          <span class="color_99">设备编号</span><span>{{item.sn}}</span>
        </li>
        <li class="txone">
          <span class="color_99">设备类型</span><span>{{item.type_dictText}}</span>
        </li>
        <li class="txFull">
          <span class="color_99">安装位置</span>
          <div class="text">
            {{item.installationLocation}}
          </div>
        </li>
        <div class="liButton" v-if="item.deviceStatus !== 3">
          <div class="btn gre" v-if="item.switchStatus === 1">
            已开启
          </div>
          <div class="btn gra" v-else>
            已关闭
          </div>
          <div class="btn org" v-if="item.idleState === 1">
            忙碌
          </div>
          <div class="btn blu" v-if="item.idleState === 2">
            空闲
          </div>
        </div>
        <div class="liButton" v-else>
          <div class="btn red" v-if="item.deviceStatus === 3">
            故障
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
  import muheader from "../../../components/header";
  import {
    STROAGE
  } from '@/utils/muxin'
  import api from '@/api/api'
  export default {
    name: "chargeDevices",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        searText: '', // sousuoneirong
        selOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 2,
          label: '下架'
        }, {
          value: 3,
          label: '离线'
        }],
        selText: '', // 下拉选择neirong
        deviceList: [],
        bsId: ''
      }
    },
    created() {
      this.data_Init()
      // 查询充电桩设备列表
      this.queryDevicesList('')
    },
    methods: {
      data_Init() {
        this.bsId = location.href.split('=')[1]
        let deviceList = JSON.parse(STROAGE({
          type: 'getItem',
          key: 'DevicesList'
        }))
        if (deviceList) {
          this.deviceList = deviceList
        }
      },
      change(e) {
        // 查询设备列表
        this.queryDevicesList(e)
      },
      blur() {
        // 查询设备列表
        this.queryDevicesList('', this.searText)
      },
      details(sn) {
        this.queryDevicesDetails(sn)
        // 查询设备详情
        this.$router.push(`/devicesDetails?sn=${sn}`)
      },
      async queryDevicesList(deviceStatus, sn) {
        let res = await api.queryDevicesList({
          query: {
            bsId: this.bsId,
            column: 'createTime',
            order: 'desc',
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            shelfStatus: '',
            deviceStatus: deviceStatus,
            sn: sn
          }
        })
        if (res.code === 0) {
          this.deviceList = res.result.records
          STROAGE({
            type: 'setItem',
            key: 'DevicesList',
            item: res.result.records
          })
        }
      },
      async queryDevicesDetails(sn) {
        let res = await api.queryDevicesDetails({
          query: {
            sn: sn
          }
        })
        if (res.code === 0) {
          STROAGE({
            type: 'setItem',
            key: 'DevicesDetails',
            item: res.result
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../styles/theme.scss";
  .chargeDevices {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    .sel {
      width: 100%;
      height: vw(128);
      background: white;
      padding: vw(32) vw(17);
      display: flex;
      // .el-input__inner {
      //   height: vw(64) !important;
      // }
      .select_element {
        width: vw(200);
        margin-right: vw(32);
        .el-input--suffix {
          height: vw(64) !important;
          padding: 0 vw(20);
        }
      }
      .input_element {
        flex: 1;
      }
    }
    .content {
      flex: 1;
      background: #f6f6f6;
      padding: vw(30);
      overflow-y: scroll;
      .nums {
        text-align: left;
        margin-bottom: vw(24);
        color: #333333;
      }
      ul {
        width: 100%;
        height: auto;
        padding: vw(14) vw(32);
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
          text-align: left;
          font-size: vw(30);
          color: #999999;
          justify-content: flex-start;
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
              width: 25%;
            }
            &:nth-child(2) {
             width: 55%;
             overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
        .liButton {
          width: vw(88);
          height: auto;
          right: vw(32);
          position: absolute;
          top: vw(-14);
          .btn {
            width: vw(88);
            height: vw(40);
            line-height: vw(40);
            margin-top: vw(32);
            border: vw(1) solid;
            border-radius: vw(4);
            font-size: vw(24);
          }
          .gre {
            color: #8ee750;
            border-color: #8ee750;
          }
          .org {
            color: #ffa958;
            border-color: #ffa958;
          }
          .gra {
            color: #cccccc;
            border-color: #cccccc;
          }
          .red {
            color: #ff5858;
            border-color: #ff5858;
          }
          .blu {
            color: #56baf9;
            border-color: #56baf9;
          }
        }
      }
    }.fullbg {
  background: url('../../../assets/full.png') no-repeat center;
  background-size: 50%;
  }
  
}
</style>