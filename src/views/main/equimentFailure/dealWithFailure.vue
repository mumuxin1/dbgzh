<template>
  <div class="dealWithFailure">
    <mu-header class="muHeader" title="故障详情" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
       
        <li>
          <span class="">站点名称</span>
          <span>xxxxx</span>

          <!-- <div class="liButton" v-if="item.status === 1">审核中</div> -->
        </li>
        <div class="line"></div>
        <li>
          <span class="">设备编号</span>
          <span>xxxxx</span>
         
        </li>
        <div class="line"></div>
        <li>
          <span class="">所住地址</span>
          <span>xxxxx</span>
          
        </li>
        <div class="line"></div>
        <li>
          <span class="">客户名称</span>
          <span>xxxxx</span>
          
        </li>
        <div class="line"></div>
        <li>
          <span class="">反馈时间</span>
          <span>xxxxx</span>
          
        </li>
        <div class="line"></div>
        <span class="des">反馈图片</span>
        <div class="upImg">
          <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index">
            <img :src="item" alt="" class="img">
            <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
          </div>
          <!-- <img src="@/assets/dianbo_shenqing_add@3x.png" alt="" class="selImg" @click="chooseImg" v-if="addPhoto"> -->
          <input type="file" multiple accept='image/*' class="selImg" v-on:change="uploadFile($event)" ref="upImg">
        </div>
        <div class="btn">
          <span>取消</span>
          <span @click="dealWith">处理</span>
        </div>
        
      </ul>
      <div class="dotted-line">
      </div>
      <ul class="other">
         <li>
          <span class="bold">处理人</span>
          <span>xxxxx</span>

          <!-- <div class="liButton" v-if="item.status === 1">审核中</div> -->
        </li>
        <div class="line"></div>
        <li>
          <span class="bold">处理时间</span>
          <span>xxxxx</span>
         
        </li> 
        <li class="detail">
          <span class="bold">具体情况</span>
          <span class="wrap">xxxxdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffx</span>
        </li>
        <div class="upImg">
          <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index">
            <img :src="item" alt="" class="img">
            <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
          </div>
          <!-- <img src="@/assets/dianbo_shenqing_add@3x.png" alt="" class="selImg" @click="chooseImg" v-if="addPhoto"> -->
          <input type="file" multiple accept='image/*' class="selImg" v-on:change="uploadFile($event)" ref="upImg">
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
        chargeData: [],
        selText: [],
        selOptions: [{
            value: 1,
            label: "是"
          },
          {
            value: 2,
            label: "否"
          }
        ],
        selText2: [],
        selOptions2: [{
            value: 1,
            label: "提供场地申请合作"
          },
          {
            value: 2,
            label: "投资合作"
          }
        ],
        startTime: "", // 选择开始时间
        endTime: "", // 选择结束时间
        openTime: "", // 请求参数 开放时间
        userName: "", // 姓名
        num: "", //现有总表容量
        phone: "", // 电话
        power: "", //入户总线电压
        startTime2: "",
        endTime2: "",
        tempFilePaths: [],
        addPhoto: true,
        text: "",
        placeholde: "扫描二维码或输入编码",
        disabled: false,
        address: ""
      };
    },
    created() {
      this.data_Init();
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
        let chargeList = STROAGE({
          type: "getItem",
          key: "ChargeList"
        });
        if (chargeList) {
          this.chargeData = JSON.parse(chargeList);
        }
        console.log(this.chargeData);
      },
      
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true;
      },
      dealWith() {
        console.log(1)
        this.$router.push('/dealWithResult')
      },
      // 检测输入桩主信息
      textDectorers() {
        let falg;
        this.startTime2 = timeFormat(this.startTime, "-", "00:00");
        this.endTime2 = timeFormat(this.endTime, "-", "00:00");
        this.openTime = this.startTime2 + "-" + this.endTime2;
        if (!this.address) {
          this.address = null;
          return false;
        }
        if (!this.userName) {
          this.userName = null;
          return false;
        }
        if (!this.phone) {
          this.phone = null;
          return false;
        }
        if (!this.openTime) {
          return false;
        }
        if (!this.num) {
          this.num = null;
          return false;
        }
        if (!this.power) {
          this.power = null;
          return false;
        }
        if (!this.selText) {
          return false;
        }
        if (!this.selText2) {
          return false;
        }
        console.log('ddd')
        falg = true;
        if (falg) {
          return true;
        }
      },
      async applicationOwner() {
        let res = await api.applicationOwner({
          method: "POST",
          query: {
            address: "xxx",
            realName: this.userName,
            phone: this.phone,
            openTime: this.openTime,
            tableCapacity: this.num,
            voltage: this.power,
            groundWireStatus: this.selText,
            cooperationType: this.selText2,
            imgs: "img/demo.jpg,img/demo2.png"
          }
        });
        if (res.code === 200) {
          this.$router.push("/reviewProgress");
        }
      },
      // 查询微信JSSDK权限验证配置参数
      async signature(url) {
        let res = await api.signature({
          query: {
            url: url
          }
        });
        if (res.code === 0) {
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.result.appId, // 必填，公众号的唯一标识
            timestamp: res.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
            signature: res.result.signature, // 必填，签名
            jsApiList: ['openLocation', 'getLocalImgData', 'scanQRCode', 'chooseImage', 'uploadImage', 'downloadImage'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function() {})
          wx.error(function(res) {
            console.log(res)
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          // console.log('有效sn')
        } else {
          // console.log('无效sn')
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
        .line{
          width: 100%;
          height: vw(2);
          // margin: vw(1) 0;
          background: $borderColor1;
        }
        li {
          width: 100%;
          height: vw(120);
          display: flex;
          text-align: left;
          color: #333333;
          align-items: center;
          :nth-child(1){
            flex: 2;
          }
          :nth-child(2){
            color: $fontColor2;
            margin-left: vw(32);
            flex: 8;
          }
        }
        
        .btn{
          width: 100%;
          display: flex;
          justify-content: center;
          margin: vw(45) 0;
          span{
            width: vw(144);
            height: vw(64);
            line-height: vw(64);
            border-radius: vw(4);
          }
          :nth-child(1){
            margin-right: vw(183);
            background: $bgPageColor1;
            color:$fontColor2;
          }
             :nth-child(2){
            background: $bgPageColor3;
            color:$fontColor3;
          }
        }
      }
     .other{
       border-top: vw(1) dotted #e5e5e5;
       .detail{
         min-height: vw(120);
         padding: vw(45) 0;
       }
       .wrap{
            word-break: break-all;
       }
       .status{
         width: vw(115);
         height: vw(115);
        margin-bottom: vw(45);
        align-self: center;
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
        margin-bottom: vw(32);
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