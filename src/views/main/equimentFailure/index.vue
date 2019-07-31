<template>
  <div class="applicationRecord">
    <mu-header class="muHeader" title="设备故障" :left="true" :back="true"></mu-header>
    <div class="content" :class="failureEquList.length > 0? '' : 'fullbg'">
      <ul v-for="item in failureEquList" :key="item.index" @click="details(item.fbId)">
        <li>
          <span class="">站点名称</span>
          <span>{{item.bsName}}</span>

          <div class="liButton red" v-if="item.dealStatus === 1">新故障</div>
          <div class="liButton blu" v-if="item.dealResult === 1">已解决</div>
          <div class="liButton" v-if="item.dealResult === 2">未解决</div>
        </li>
        <li>
          <span class="">设备编号</span>
          <span>{{item.sn}}</span>
        </li>
        <li>
          <span class="">安装位置</span>
          <span>{{item.installationLocation}}</span>
        </li>
        <li>
          <span class="">客户名称</span>
          <span>{{item.nickName}}</span>
        </li>
        <li>
          <span class="">反馈时间</span>
          <span>{{item.createTime}}</span>
        </li>
        <div class="navButton" @click="cancelApply(item.id)" v-if="item.dealResult !== 2">去处理</div>
      </ul>
    </div>
  </div>
</template>
<script>
import muheader from "../../../components/header";
import { MessageBox } from "element-ui";
import { STROAGE, timeFormat } from "@/utils/muxin";
import api from "@/api/api";
export default {
  name: "applicationRecord",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      selText: "", // sousuoneirong
      failureEquList: "", // 故障列表
      deviceList: [],
      bsId: "",
      startTime: "",
      endTime: "",
      pageNo: "",
      pageSize: "",
      applyList: []
    };
  },
  created() {
    this.data_Init();
    // 查询故障设备列表
    this.queryFailureEquList();
  },
  filters: {
    moneyFormat: params => {
      return (params / 100).toFixed(2);
    }
  },
  methods: {
    data_Init() {
      let failureEquList = JSON.parse(
        STROAGE({
          type: "getItem",
          key: "FailureEquList"
        })
      );
      if (failureEquList) {
        this.failureEquList = failureEquList;
      }
      console.log(this.failureEquList);
    },
    details (fbId) {
      // 查询故障设备详情

      this.queryFailureEquInfo(fbId)
      
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
        this.failureList = res.result.records;
        STROAGE({
          type: "setItem",
          key: "FailureEquList",
          item: res.result.records
        });
      }
    },
    // 查询故障设备详情
    async queryFailureEquInfo(fbId) {
      let res = await api.queryFailureEquInfo({
        query: {
          fbId: fbId
        }
      });
      if (res.code === 0) {
        STROAGE({
          type: "setItem",
          key: "FailureEquDetails",
          item: res.result
        });
        this.$router.push(`/dealWithFailure?fbId=${fbId}`)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/theme.scss";
.applicationRecord {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(30);
  color: $fontColor1;
  background: $bgPageColor1;
  .content {
    width: 100%;
    height: 92%;
    padding: 0 vw(32);
    overflow-y: scroll;
    padding-top: vw(32);
    ul {
      width: 100%;
      padding: vw(15) vw(32);
      background: white;
      display: flex;
      flex-direction: column;
      margin-bottom: vw(32);
      border-radius: vw(7);
      position: relative;
      color: $fontColor2;
      li {
        width: 100%;
        height: vw(60);
        display: flex;
        align-items: center;
        text-align: left;
        span {
          text-align: left;
          &:first-child {
            flex: 1.5;
            color: $fontColor1;
          }
          &:nth-child(2) {
            flex: 5;
          }
        }
      }
      .liButton {
        width: vw(88);
        right: vw(32);
        position: absolute;
        height: vw(40);
        line-height: vw(40);
        margin-top: vw(15);
        border: vw(1) solid $borderColor1; // border-radius: vw(4);
        font-size: vw(24);
        text-align: center;
      }
      .gre {
        color: #8ee750;
        border-color: #8ee750;
      }
      .blu {
        color: #56baf9;
        border-color: #56baf9;
      }
      .red{
        border-color: #ff5858;
        color: #ff5858;
      }
      .navButton {
        position: absolute;
        bottom: vw(20);
        right: vw(32);
        width: 19%;
        height: vw(64);
        line-height: vw(64);
        background: $bgPageColor3;
        color: $fontColor3;
        // margin-top: vw(30);
        border-radius: vw(10);
      }
    }
  }
  .fullbg {
    background: url("../../../assets/full.png") no-repeat center;
    background-size: 50%;
  }
}
</style>