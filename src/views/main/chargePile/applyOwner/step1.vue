<template>
  <div class="step1">
    <mu-header class="muHeader" title="申请桩主" :left="false" :back="true"></mu-header>
    <!-- <input id="upload_file" type="file" accept='image/*' name="file"  @change="fileChange($event)"/> -->
    <!-- <input type="file"  id="upload_file" multiple accept='image/*'> -->
    <div class="content">
      <ul>
        <li class="tit">基本信息</li>
        <!-- <li class="selAdres">
              <span>地址</span>
              <div class="rticon">
                <span>请选择</span>
                <img src="@/assets/dianbo_public_right@3x.png" alt="">
              </div>
            </li>-->
        <li class="selAdres">
          <span>地址</span>
          <div class="rticon" :class="address === null ? 'fullInput': ''">
            <!-- <input type="text" placeholder="请输入" v-model="address"> -->
            <!-- <input type="file" placeholder="请输入" v-model="address"> -->
          </div>
        </li>
        <li class="selAdres">
          <span>姓名</span>
          <div class="rticon" :class="userName === null ? 'fullInput': ''">
            <input type="text" placeholder="请输入" v-model="userName">
          </div>
        </li>
        <li class="selAdres">
          <span>联系电话</span>
          <div class="rticon" :class="phone === null ? 'fullInput': ''">
            <input type="number" placeholder="请输入" v-model="phone">
          </div>
        </li>
        <li class="txone">
          <span>开放时间</span>
          <div class="selTime">
            <div class="rieditor">
              <el-time-picker v-model="startTime" placeholder="00:00" :editable="false"></el-time-picker>
            </div>
            <span class="span">至</span>
            <div class="rieditor">
              <el-time-picker v-model="endTime" placeholder="00:00" :editable="false"></el-time-picker>
            </div>
          </div>
        </li>
        <li class="selAdres">
          <span>现有总表容量</span>
          <div class="rticon" :class="num === null ? 'fullInput': ''">
            <input type="number" placeholder="请输入" v-model="num">
          </div>
        </li>
        <li class="selAdres">
          <span>入户总线电压</span>
          <div class="rticon" :class="power === null ? 'fullInput': ''">
            <input type="number" placeholder="请输入" v-model="power">
          </div>
        </li>
        <li class="txFull">
          <span>是否有地线接</span>
          <el-select v-model="selText" placeholder="请选择" class="select_element">
            <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li class="txFull">
          <span>合作类型</span>
          <el-select v-model="selText2" placeholder="请选择" class="select_element">
            <el-option v-for="item in selOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <span class="des mar48">
              <font style="fontWeight:bold;fontSize:16px">图片信息</font>(至少3张)
            </span>
        <span class="des">请选择充电 环境照片</span>
        <div class="upImg">
          <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index">
            <img :src="item" alt="" class="img">
            <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
          </div>
          <!-- <img src="@/assets/dianbo_shenqing_add@3x.png" alt="" class="selImg" @click="chooseImg" v-if="addPhoto"> -->
          <input type="file" multiple accept='image/*' class="selImg" v-on:change="uploadFile($event)" ref="upImg">
        </div>
      </ul>
      <div @click="next">
        <el-tooltip content="请输入完整信息" placement="top" class="button-g button" :disabled="disabled">
          <el-button>下一步</el-button>
        </el-tooltip>
      </div>
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
    name: "step1",
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
      this.wxConfig()
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
      async uploadFile(e) {
        let _this = this
        console.log(e.path[0].files)
        // var reader = new FileReader();
        // // // reader.readAsDataURL(e.path[0].files[0]);//发起异步请求
        // reader.readAsArrayBuffer(e.path[0].files[0])
        // reader.onload = async function() {
        //   //读取完成后，数据保存在对象的result属性中
        //   // _this.tempFilePaths.push(this.result)
        //   console.log(this.result)
        //   console.log(new Blob([this.result]))
        //   let res = await api.uploadProfile({
        //     method: 'myupload',
        //     query: {
        //       file: this.result
        //     }
        //   })
        // }
        var params = new FormData();
        params.append('file', e.path[0].files[0]);
        console.log(params.get('file'))
        let res = await api.uploadProfile({
          method: 'myupload',
          query: {
            file: params
          }
        })
        // var oReq = new XMLHttpRequest();
        // oReq.open("POST", process.env.VUE_APP_BASE_API + '/v1.0/upload_profile_photo');
        // oReq.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        // oReq.send(params);
        // let res = await api.uploadProfile({
        //   method: 'POST',
        //   query: {
        //     file: this.tempFilePaths[0]
        //   }
        // })
        // console.log(res)
      },
      wxConfig() {
        let url = window.location.href.split('#')[0]
        // url = url.substr(0, url.length - 1)
        // 查询微信JSSDK权限验证配置参数
        this.signature(url)
      },
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
      chooseImg() {
        wx.chooseImage({
          count: 4, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            var localIds = res.localIds;
            res.localIds.forEach(element => {
              this.tempFilePaths.push(element);
            });
            console.log(this.tempFilePaths)
            if (this.tempFilePaths.length >= 3) {
              this.addPhoto = false;
            } else {
              this.addPhoto = true;
            } // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      },
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true;
      },
      next() {
        // 检测输入庄主信息
        // wx.uploadImage({
        //     localId: '', // 需要上传的图片的本地ID，由chooseImage接口获得
        //     isShowProgressTips: 1, // 默认为1，显示进度提示
        //     success: function(res) {
        //       var serverId = res.serverId; // 返回图片的服务器端ID
        //       console.log(serverId)
        //     }
        //   });
        this.tempFilePaths.forEach(el => {
          wx.uploadImage({
            localId: el, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function(res) {
              var serverId = res.serverId; // 返回图片的服务器端ID
              console.log(serverId)
              wx.downloadImage({
                serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                  var localId = res.localId; // 返回图片下载后的本地ID
                }
              });
            }
          });
        })
        // let falg = this.textDectorers();
        // if (!falg) return false;
        this.disabled = true;
        // this.applicationOwner();
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
  .step1 {
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
        margin-bottom: vw(32);
        border-radius: vw(7);
        .tit {
          font-size: vw(30);
          color: #333333;
          font-weight: bold;
        }
        li {
          width: 100%;
          height: vw(120);
          display: flex;
          text-align: left;
          color: #333333;
          align-items: center;
        }
        .txFull {
          border-bottom: vw(1) solid #e5e5e5;
          .select_element {
            width: vw(344);
            height: vw(64);
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
            flex: 7.5;
          }
        }
        .txone {
          display: flex;
          justify-content: space-between;
          border-bottom: vw(1) solid #e5e5e5;
          .selTime {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            .span {
              margin: 0 vw(25);
              align-self: center;
            }
            /deep/ {
              .el-date-editor {
                width: vw(140);
              }
              .el-input__inner {
                padding: 0;
                text-align: center;
              }
              .el-input__prefix {
                .el-input__inner {
                  padding: 0;
                }
                display: none;
              }
            }
          }
          .rieditor {
            width: vw(134);
            height: vw(64);
            position: relative;
          }
          .span {
            text-align: left;
            align-self: center;
          }
        }
        .selAdres {
          display: flex;
          justify-content: space-between;
          border-bottom: vw(1) solid #e5e5e5;
          .rticon {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: vw(120);
            flex: 1;
            margin-left: vw(50);
            span {
              margin-right: vw(16);
              align-self: center;
            }
            img {
              width: vw(16);
              height: vw(28);
            }
            input {
              flex: 1;
              height: vw(120);
              font-size: vw(28);
              text-align: right;
            }
          }
        }
      }
      .des {
        margin-bottom: vw(32);
        color: #333333;
        text-align: left;
      }
      .mar48 {
        margin-top: vw(48);
      }
      .bold {
        font-weight: bold;
      }
      .txdes {
        font-size: vw(24);
        color: #999999;
        line-height: vw(46);
        text-align: left;
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
    .button {
      width: 94%;
      height: vw(90);
      line-height: vw(90);
      color: white;
      background: #56baf9;
      border-radius: vw(5);
      margin-top: vw(30);
      margin: 0 auto;
    }
    .fullInput ::placeholder {
      color: red;
    }
    .el-button--default {
      width: 94% !important;
    }
    .el-button {
      padding: 0;
    }
  }
</style>