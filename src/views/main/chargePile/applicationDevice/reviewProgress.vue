<template>
  <div class="reviewProgress">
    <mu-header class="muHeader" title="申请审核" :left="true" :back="true"></mu-header>
    <div class="content">
      <img src="@/assets/dianbo_public_success@3x.png" alt="">
      <span>提交申请成功</span>
      <p>
        后台正在审核，请您耐心等待 审核通过会安排工作人员线下安装设备
      </p>
      <div class="progres">
        <div class="step">
          <div class="box"></div>
          <span>添加设备</span>
        </div>
        
        <div class="step margin200">
           <div class="line1 line"></div>
          <div class="box"></div>
          <span>审核中</span>
      <div class="line2 line"></div>

        </div>
        <div class="step">
          <div class="box"></div>
          <span>添加设备</span>
        </div>
       

      </div>
      

    </div>
  </div>
</template>
<script>
  import muheader from "@/components/header";
  import {
    STROAGE
  } from '@/utils/muxin'
  import api from '@/api/api'
  export default {
    name: "reviewProgress",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
      };
    },
    created() {
      this.data_Init()
    },
    methods: {
      data_Init() {
        let userInfo = STROAGE({
          type: 'getItem',
          key: 'UserInfo'
        })
        userInfo = JSON.parse(userInfo)
        this.userInfo = userInfo
        this.pageSize = Math.ceil(this.$parent.clientHeight / 220)
        console.log(this.pageSize)
      },
      menu(id) {
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
      async queryChargList() {
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
  @import "@/styles/theme.scss";
  .reviewProgress {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    color: #333333;
    .content {
      height: auto;
      background: white;
      padding: vw(96) vw(32);
      margin: vw(32);
      position: relative;
      align-items: center;
      display: flex;
      flex-direction: column;

      img {
        width: vw(160);
        height: vw(160);
      }
      span {
        font-weight: vw(32);
        font-weight: bold;
        margin-top: vw(32)
      }
      p {
        width: vw(516);
        height: auto;
        margin: 0 auto;
        line-height: vw(48);
        color: #999999;
        margin-top: vw(48);
      }
      .progres {
        display: flex;
        margin-top: vw(95);
        font-size: vw(28);
        .step {
          // width: vw(120);
          display: flex;
          flex-direction: column;
          align-items: center;
          .box {
            width: vw(48);
            height: vw(48);
            border-radius: 50%;
            background: #cccccc;
          }
          span {
            color: #cccccc;
            margin-top: vw(23);
          }
        }
        .margin200{
          margin: 0 vw(150);
        position: relative;
         .line{
          width: vw(200);
          height: vw(2);
          background: #cccccc;
          top: vw(25);
          position: absolute;
          z-index: 999;
        }
        .line{
          right: vw(65);
        }
        .line2{
          left: vw(65)
        }
        }
      }
      
    }
  }
</style>