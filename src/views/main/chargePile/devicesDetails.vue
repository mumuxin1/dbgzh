<template>
  <div class="devicesDetails">
    <mu-header class="muHeader" title="设备详情" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="txtwo">
          <span class="">{{deviceDetails.cpName}}</span>
          <div class="riText">
            <span class="active" v-if="deviceDetails.shelfStatus === 1">上架</span>
            <span class="defaut" v-else>下架</span>
            <span class="active" v-if="deviceDetails.deviceStatus === 1">在线</span>
            <span class="defaut" v-else>离线</span>
          </div>
        </li>
        <li class="txone">
          <span>型号</span>
          <span class="color_99">{{deviceDetails.deviceModelName}}</span>
        </li>
        <li class="txone">
          <span class="">编号</span>
          <span class="color_99">{{deviceDetails.sn}}</span>
        </li>
        <li class="txone">
          <span class="">泊位费</span>
          <span class="color_99">{{deviceDetails.dbBillingStrategy.parkFee | moneyFormat}}元</span>
        </li>
        <li class="txone">
          <span class="">电费</span>
          <span class="color_99">{{deviceDetails.dbBillingStrategy.electricityFee | moneyFormat}}元</span>
        </li>
        <li class="txone">
          <span class="">是否可预约</span>
          <div class="rieditor">
            <el-select v-model="selApointTx" placeholder="请选择" class="select_element">
              <el-option
                v-for="item in selApoints"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </li>
        <li class="txone">
          <span class="">修改设备名称</span>
          <div class="rieditor">
            <el-input placeholder="请输入设备名称" v-model="reName" class="input_element"></el-input>
          </div>
        </li>
        <li class="txone">
          <span class="">开放时间设置</span>
          <div class="selTime">
            <div class="editor">
              <el-time-picker
                v-model="startTime"
                placeholder="任意时间点"
                editable="editable"
                value-format="HH:mm"
              ></el-time-picker>
            </div>
            <span class="span">至</span>
            <div class="editor">
              <el-time-picker v-model="endTime" placeholder="任意时间点"></el-time-picker>
            </div>
          </div>
        </li>
        <!-- <li class="txone">
          <span class="">故障上报</span>
          <div class="riIcon">
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
          </div>
        </li>-->
        <li class="txone">
          <span class="">设备状态</span>
          <div class="rieditor">
            <el-select v-model="statusApointTx" placeholder="请选择" class="select_element">
              <el-option
                v-for="item in statusApoints"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </li>
        <div class="navsButton" @click="save">保存</div>
      </ul>
    </div>
  </div>
</template>
<script>
import muheader from "../../../components/header";
import api from "@/api/api";
import { STROAGE, timeFormat } from "@/utils/muxin";

export default {
  name: "devicesDetails",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      deviceDetails: {},
      selApointTx: "", // 下拉选择是否可以预约
      selApoints: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 2,
          label: "否"
        }
      ],
      statusApointTx: "", // 下拉选择是否上架
      statusApoints: [
        {
          value: 1,
          label: "上架"
        },
        {
          value: 2,
          label: "下架"
        }
      ],
      reName: "", // 修改名称
      startTime: "",
      endTime: "",
      startTime2: "", // 开始时间请求参数
      endTime2: "",
      editable: false // 时间不可编辑
    };
  },
  created() {
    // 查询充电桩设备列表
    this.queryDevicesList(bsId);
    this.data_Init();
  },
  filters: {
    moneyFormat: params => {
      return (params / 100).toFixed(2);
    }
  },
  methods: {
    data_Init() {
      let deviceDetails = JSON.parse(
        STROAGE({
          type: "getItem",
          key: "DevicesDetails"
        })
      );
      if (deviceDetails) {
        this.deviceDetails = deviceDetails;
      }
    },
    save() {
      // this.userName = "";
      console.log(this.selApointTx);
      this.startTime2 = timeFormat(this.startTime, "-", "00:00:00");
      this.endTime2 = timeFormat(this.endTime, "-", "00:00:00");

      console.log(this.startTime);
      if (
        this.selApointTx === "" ||
        this.statusApointTx === "" ||
        this.reName === "" ||
        this.startTime === "" ||
        this.endTime === ""
      )
        return false;
      this.upDateDevicesDetails();
    },
    // 更新设备详情
    async upDateDevicesDetails() {
      let res = await api.upDateDevicesDetails({
        method: "POST",
        query: {
          sn: this.deviceDetails.sn,
          bookStatus: this.selApointTx,
          cpName: this.reName,
          openStartTime: this.startTime2,
          openEndTime: this.endTime2,
          shelf_status: this.statusApointTx
        }
      });
      if (res.code === 200) {
        this.$router.go(-2);
      }
    },
    // 查询充电桩设备列表
    async queryDevicesList(bsId) {
      let res = await api.queryDevicesList({
        query: {
          bsId: bsId,
          column: "createTime",
          order: "desc",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          shelfStatus: "",
          deviceStatus: ""
        }
      });
      if (res.code === 0) {
        STROAGE({
          type: "setItem",
          key: "DevicesList",
          item: res.result.records
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/theme.scss";
.devicesDetails {
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(30);
  background: #f6f6f6;
  color: #333333;
  .sel {
    width: 100%;
    height: vw(128);
    background: white;
    padding: vw(32) vw(17);
    display: flex;
    .el-input__inner {
      height: vw(64) !important;
    }
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
        span {
          align-content: center;
        }
        .color_99 {
          color: #999999;
        }
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
      .txtwo {
        span {
          align-self: center;
          &:first-child {
            flex: 4;
            align-self: center;
          }
        }
        .riText {
          display: flex;
          flex: 6;
          height: vw(64);
          align-self: center;
          span {
            width: vw(160);
            height: vw(64);
            line-height: vw(64);
            text-align: center;
            color: #999999;
            border: vw(1) solid #999999;
            border-radius: vw(4);
            &:first-child {
              margin-right: vw(24);
            }
          }
          .active {
            color: #56baf9;
          }
        }
      }
      .riIcon {
        width: vw(32);
        height: vw(48);
        padding: vw(10) vw(8);
        img {
          width: vw(16);
          height: vw(28);
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
    }
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