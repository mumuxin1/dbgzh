<template>
  <div class="pileHousehold">
    <mu-header class="muHeader" title="桩户信息" :left="true" :back="true"></mu-header>
    <div class="content" :class="chargeList.length > 0? '' : 'fullbg'">
      <ul v-for="item in chargeList" :key="item.index" @click="details(item.bsId)">
        <li>
          <span class="">桩户名称</span>
          <span>{{item.bsName}}</span>
        </li>
        <li>
          <span class="">联系方式</span>
          <span>{{item.phone}}</span>
        </li>
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
  name: "pileHousehold",
  components: {
    "mu-header": muheader,
  },
  data() {
    return {
      selText: "", // sousuoneirong
      applyList: "", // 下拉选择站点
      chargeList: [],
      bsId: "",
      pageNo: "",
      pageSize: "",
      orderList: [], // 订单列表详情
      orderType: 1, // 2 使用中 3预约
    };
  },
  created() {
    this.data_Init();
  },
  mounted() {
    // 查询我的电站列表
    this.queryChargList();
  },
  methods: {
    data_Init() {
      let chargeList = JSON.parse(
        STROAGE({
          type: "getItem",
          key: "ChargeList"
        })
      );
      if (chargeList) {
        this.chargeList = chargeList;
      }
      console.log(this.chargeList);
    },
    details(bsId) {
      let url = location.href .split('#')[0]
      // 查询桩户详情
      this.queryBsInfo(bsId);
      // location.href = url + '#/houseHoldDetails'+ '?bsid=' + bsId
      this.$router.push("/houseHoldDetails"+ '?bsid=' + bsId);
    },
    // 查询申请记录
    async queryApplyList() {
      let res = await api.queryOrderList({
        query: {
          column: "createTime",
          order: "desc",
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      });
      if (res.code === 0) {
        this.orderList = res.result.records;
      }
    },
    // 查询桩户详情
    async queryBsInfo(bsId) {
      let res = await api.queryBsInfo({
        query: {
          bsId: bsId
        }
      });
      if (res.code === 0) {
        STROAGE({
          type: "setItem",
          key: "HouseHoldDetails",
          item: res.result
        });
      }
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
        this.chargeList = res.result.records;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/theme.scss";
.pileHousehold {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(30);
  color: $fontColor1;
  background: $bgPageColor1;
  .content {
    width: 100%;
    // height: 92%;
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
        justify-content: space-between;
        span {
          &:first-child {
            text-align: left;
            color: $fontColor1;
          }
          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }
  .fullbg {
  background: url('../../../assets/full.png') no-repeat center;
  background-size: 50%;
}
}
</style>