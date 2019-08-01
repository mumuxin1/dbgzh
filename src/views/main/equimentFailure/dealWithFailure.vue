<template>
  <div class="dealWithFailure">
    <mu-header class="muHeader" title="故障详情" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li>
          <span class="">站点名称</span>
          <span>{{failureEquDetails.bsName}}</span>
          <!-- <div class="liButton" v-if="item.status === 1">审核中</div> -->
        </li>
        <div class="line"></div>
        <li>
          <span class="">设备编号</span>
          <span>{{failureEquDetails.sn}}</span>
        </li>
        <div class="line"></div>
        <li>
          <span class="">安装位置</span>
          <span>{{failureEquDetails.installationLocation}}</span>
        </li>
        <div class="line"></div>
        <li>
          <span class="">客户名称</span>
          <span>{{failureEquDetails.nickName}}</span>
        </li>
        <div class="line"></div>
        <li>
          <span class="">反馈时间</span>
          <span>{{failureEquDetails.createTime}}</span>
        </li>
        <div class="line"></div>
        <span class="des">反馈图片</span>
        <div class="upImg">
          <div class="uploadImg" v-for="items in fbImg" :key="items.index">
            <img :src="items" alt="" class="img">
            <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(items.index)">
          </div>
          <!-- <img src="@/assets/dianbo_shenqing_add@3x.png" alt="" class="selImg" @click="chooseImg" v-if="addPhoto"> -->
          <!-- <input type="file" multiple accept='image/*' class="selImg" v-on:change="uploadFile($event)" ref="upImg"> -->
        </div>
        <div class="btn" v-if="failureEquDetails.dealStatus === 1 || failureEquDetails.dealStatusdealResult === 2" >
          <span>取消</span>
          <span @click="dealWith">处理</span>
        </div>
      </ul>
      <div class="dotted-line">
      </div>
      <ul class="other" v-if="failureEquDetails.dealStatus === 3">
        <li>
          <span class="bold">处理人</span>
          <span>{{failureEquDetails.dealUserName}}</span>
          <!-- <div class="liButton" v-if="item.status === 1">审核中</div> -->
        </li>
        <div class="line"></div>
        <li>
          <span class="bold">处理时间</span>
          <span>{{failureEquDetails.dealTime}}</span>
        </li>
        <li class="detail">
          <span class="bold">具体情况</span>
          <span class="wrap">{{failureEquDetails.dealRemark}}</span>
        </li>
          <div class="upImg">
            <div class="uploadImg" v-for="items in dealImg" :key="items.index">
              <img :src="items" alt="" class="img">
              <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(items.index)">
            </div>
          </div>
          <img src="@/assets/dianbo_guzhang_yichuli@3x.png" alt="" class="status">
        </ul>
      </div>
    </div>
</template>
<script>
  import {
    STROAGE,
    timeFormat
  } from "@/utils/muxin";
  import muheader from "@/components/header";
  import wx from "weixin-js-sdk";
  import api from "@/api/api";
  export default {
    name: "dealWithFailure",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        failureEquDetails: {},
        fbId: null,
        selText: [],
        openTime: "", // 请求参数 开放时间
        userName: "", // 姓名
        num: "", //现有总表容量
        phone: "", // 电话
        power: "", //入户总线电压
        tempFilePaths: [],
        addPhoto: true,
        text: "",
        disabled: false,
        address: "",
        dealImg: [],
        fbImg: []
      };
    },
    created() {
      this.data_Init();
      // 查询故障设备详情
      this.queryFailureEquInfo(this.fbId)
    },
    filters: {
      moneyFormat: params => {
        return (params / 100).toFixed(2);
      }
    },
    methods: {
      fileChange(e) {
        console.log(e)
      },
      async uploadFile(e) {},
      data_Init() {
        this.fbId = location.href.split('=')[1]
        let failureEquDetails = STROAGE({
          type: "getItem",
          key: "FailureEquDetails"
        });
        if (failureEquDetails) {
          this.failureEquDetails = JSON.parse(failureEquDetails);
          this.dealImg = this.failureEquDetails.dealImgs.split(',') || []
          this.fbImg = this.failureEquDetails.fbImages.split(',') || []
        }
        console.log(this.failureEquDetails);
      },
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true;
      },
      dealWith() {
        console.log(1)
        this.$router.push(`/dealWithResult?fbId=${this.fbId}`)
      },
      
      
      // 查询故障设备详情
      async queryFailureEquInfo(id) {
        let res = await api.queryFailureEquInfo({
          query: {
            fbId: id
          }
        });
        if (res.code === 0) {
          this.failureEquDetails = res.result
          this.dealImg = this.failureEquDetails.dealImgs.split(',') || []
          this.fbImg = this.failureEquDetails.fbImages.split(',') || []
          STROAGE({
            type: "setItem",
            key: "FailureEquDetails",
            item: res.result
          });
          this.$router.push('/dealWithFailure')
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .dealWithFailure {
    width: 100%;
    height: 100%;
    font-size: vw(28);
    background: #f6f6f6;
    #upload_file {
      width: 100%;
      height: 50px;
      background: red;
    }
    .content {
      margin: vw(30);
      overflow-y: scroll;
      height: 90%;
      ul {
        width: 100%;
        height: auto;
        padding: 0 vw(32);
        background: white;
        display: flex;
        flex-direction: column;
        border-radius: vw(7);
        .tit {
          font-size: vw(30);
          color: #333333;
          font-weight: bold;
        }
        .line {
          width: 100%;
          height: vw(2); // margin: vw(1) 0;
          background: $borderColor1;
        }
        li {
          width: 100%;
          height: vw(120);
          display: flex;
          text-align: left;
          color: #333333;
          align-items: center;
           :nth-child(1) {
            flex: 2;
          }
           :nth-child(2) {
            color: $fontColor2;
            margin-left: vw(32);
            flex: 8;
          }
        }
        .btn {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: vw(45) 0;
          span {
            width: vw(144);
            height: vw(64);
            line-height: vw(64);
            border-radius: vw(4);
          }
           :nth-child(1) {
            margin-right: vw(183);
            background: $bgPageColor1;
            color: $fontColor2;
          }
           :nth-child(2) {
            background: $bgPageColor3;
            color: $fontColor3;
          }
        }
      }
      .other {
        border-top: vw(1) dotted #e5e5e5;
        display: flex;
        flex-direction: column;
        margin-top: vw(-8);
        .detail {
          min-height: vw(120);
          padding: vw(45) 0;
        }
        .wrap {
          word-break: break-all;
        }
        .status {
          width: vw(115);
          height: vw(115);
          margin-bottom: vw(45);
          align-self: center;
          margin-top: vw(32);
        }
      }
      .des {
        margin: vw(32) 0;
        text-align: left;
        color: $fontColor1;
      }
      .upImg {
        width: 100%;
        height: vw(150);
        flex-wrap: wrap;
        display: flex;
        // margin-bottom: vw(32);
        img {
          width: vw(60);
          height: vw(48); // background: red;
          margin: vw(26);
        }
        .selImg {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: vw(150);
          height: vw(150);
          background: #f5f5f5;
          margin: 0;
          margin-right: vw(10);
        }
        .uploadImg {
          width: vw(150);
          height: vw(150);
          position: relative;
          margin-right: vw(7);
          .img {
            width: vw(150);
            height: vw(150);
            display: block; // background: greenyellow;
            margin: 0;
          }
          .del {
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
  }
</style>