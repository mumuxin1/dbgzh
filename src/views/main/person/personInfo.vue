<template>
  <div class="personInfo">
    <mu-header class="muHeader" title="我的充电桩" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="top">
        <div class="headerPic">
          <img :src="userInfo.userInfo.avatar" alt="">
        </div>
        <div class="info">
          <!-- <div class="cow">
            <span class="tit">昵称</span>
            <span class="txt">{{userInfo.userInfo.avatar.realname}}</span>
          </div> -->
          <div class="cow">
            <span class="tit">号码</span>
            <span class="txt">{{userInfo.userInfo.phone}}</span>
          </div>
          <div class="cow">
            <span class="tit">姓名</span>
            <span class="txt">{{userInfo.userInfo.realname}}</span>
          </div>
        </div>
      </div>
      <div class="list" @click="$router.push('/login')">
        <div class="tit">切换账号</div>
        <div class="icon">
          <img src="@/assets/dianbo_public_right@3x.png" alt="">
        </div>
      </div>
      <div class="footnav">
        <div class="lis">
          <img src="@/assets/dian_my_chongdianzhuang@3x.png" alt="">
          <span>使用充电桩</span>
        </div>
        <div class="lis" @click="menu(2)">
          <img src="@/assets/dian_my_dianzhan@3x.png" alt="">
          <span>我的电站</span>
        </div>
        <div class="lis">
          <img src="@/assets/dian_my_chaxun@3x.png" alt="">
          <span>交易查询</span>
        </div>
        <div class="lis" v-if="userInfo.userInfo.userType === 1">
          <img src="@/assets/dian_my_qianbao@3x.png" alt="">
          <span>我的钱包</span>
        </div>
        <div class="lis">
          <img src="@/assets/dian_my_zhuanghu@3x.png" alt="">
          <span>桩户信息</span>
        </div>
        <div class="lis" v-if="userInfo.userInfo.userType === 1">
          <img src="@/assets/dian_my_jilu@3x.png" alt="">
          <span>申请记录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import muheader from "../../../components/header";
import {STROAGE} from '@/utils/muxin'
import api from '@/api/api'
export default {
  name: "personInfo",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      userInfo: '',
      pageNo: 1,
      pageSize: 10
    };
  },
  created() {
    this.data_Init()
  },
  methods: {
    data_Init () {
      let userInfo = STROAGE({
      type: 'getItem',
      key: 'UserInfo'
    })
    userInfo = JSON.parse(userInfo)
    this.userInfo = userInfo
    this.pageSize =  Math.ceil(this.$parent.clientHeight / 220)
    console.log(this.pageSize)
    },
    menu (id) {
      switch (id) {
        case 1:
          
          break;
        case 2:
          // 我的电站
          this.queryChargList()
          this.$router.push('/myChargePile')
          break;
        default:
          break;
      }
    },
    del() {
      // this.userName = "";
    },
    // 查询我的电站列表
    async queryChargList () {
      let res = await api.queryChargeList({
        query: {
          column: 'createTime',
          order: 'desc',
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      })
      if (res.code === 0) {
        STROAGE({
          type: 'setItem',
          key: 'ChargeList',
          item: res.result.records
        })
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
  font-size: vw(28);
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
      margin-bottom: vw(30);
      background: #56baf9;
      position: relative;
      align-items: center;
      .headerPic {
        width: vw(132);
        height: 100%;
        display: flex;
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
          .tit{
            margin-right: vw(20)
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
      display: flex;
      // justify-content: space-around;
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
}
</style>