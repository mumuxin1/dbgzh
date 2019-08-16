<template>
  <div class="applicationRecord">
    <mu-header class="muHeader" title="申请记录" :left="true" :back="true"></mu-header>
    <div class="content" :class="applyList.length > 0? '' : 'fullbg'">
      <ul v-for="item in applyList" :key="item.index">
        <li>
          <span class="color_99">{{item.bsName}}</span>
          <div class="liButton" v-if="item.status === 1">审核中</div>
        </li>
        <li>
          <span class="">设备型号</span>
          <span>{{item.deviceModelName}}</span>
        </li>
        <li>
          <span class="">申请数量</span>
          <span>{{item.deviceNum}}</span>
        </li>
        <div class="navButton" @click="cancelApply(item.id)" v-if="item.status === 1">撤销申请</div>
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
      applyList: "", // 下拉选择站点
      deviceList: [],
      bsId: "",
      pageNo: "",
      pageSize: "",
      orderList: [], // 订单列表详情
      orderType: 1 // 2 使用中 3预约
    };
  },
  created() {
    this.data_Init();
    // 查询申请记录
    this.queryApplyList();
  },
  filters: {
    moneyFormat: params => {
      return (params / 100).toFixed(2);
    }
  },
  methods: {
    data_Init() {
      let applyList = JSON.parse(
        STROAGE({
          type: "getItem",
          key: "ApplyList"
        })
      );
      if (applyList) {
        this.applyList = applyList;
      }
      console.log(this.applyList);
    },
    cancelApply(id) {
      // 撤销申请
      let options = {
        title: "确认要撤销申请吗？",
        message: "撤销后不可恢复，需要重新申请",
        showCancelButton: true,
        center: true
      };
      MessageBox(options)
        .then(actions => {
          if (actions === "confirm") {
            this.cancelUserApply(id);
          }
        })
        .catch(() => {
          console.log("取消");
        });
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
        this.applyList = res.result.records;
        STROAGE({
          type: "setItem",
          key: "ApplyList",
          item: res.result.records
        });
      }
    },
    // 撤销申请
    async cancelUserApply(id) {
      let res = await api.cancelUserApply({
        query: {
          id: id
        }
      });
      if (res.code === 200) {
        // 查询申请记录
        this.queryApplyList();
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
        height: vw(59);
        display: flex;
        align-items: center;
        text-align: left;
        &:first-child {
          height: vw(90);
          span {
            font-weight: bold;
            color: $fontColor1;
          }
        }
        span {
          text-align: left;
          &:first-child {
            flex: 1.5;
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
      .navButton {
        width: 100%;
        height: vw(90);
        line-height: vw(90);
        background: $bgPageColor3;
        color: $fontColor3;
        margin-top: vw(30);
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