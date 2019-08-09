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
            <input type="text" placeholder="请输入" v-model="address">
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
              <el-time-picker v-model="startTime" placeholder="00:00" :editable="false" value-format="HH-mm" :picker-options="{
                                start: '00:00',
                                end: '23:59',
                                format: 'HH:mm'
                              }"></el-time-picker>
            </div>
            <span class="span">至</span>
            <div class="rieditor">
              <el-time-picker v-model="endTime" placeholder="00:00" :editable="false" value-format="HH-mm" :picker-options="{
                                start: '00:00',
                                end: '23:59',
                                format: 'HH:mm'
                              }"></el-time-picker>
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
          <div class="uploadImg" v-for="(item, index) in tempFilePaths" :key="item.index">
            <img :src="item" alt="" class="img">
            <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(index)">
          </div>
          <div class="selImg" v-if="tempFilePaths.length < 4">
            <input type="file" multiple accept='image/*' @change="uploadFile($event)" ref="upImg">
          </div>
          <!-- <img src="@/assets/dianbo_shenqing_add@3x.png" alt="" class="selImg" @click="chooseImg" v-if="addPhoto"> -->
        </div>
      </ul>
      <div @click="next" v-if="!loading">
        <el-tooltip content="请输入完整信息" placement="top" class="button-g button" :disabled="disabled">
          <el-button>下一步</el-button>
        </el-tooltip>
      </div>
      <el-button type="primary" :loading="true" class="button button-g" v-else>申请中...</el-button>
    </div>
  </div>
</template>
<script>
  import {
    STROAGE,
    timeFormat
  } from "@/utils/muxin";
  import muheader from "@/components/header";
  import api from "@/api/api";
  import {
    Message
  } from 'element-ui';
  import {
    setTimeout
  } from 'timers';
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
        startTime: new Date(2019, 7, 10, 0, 0),
        endTime: new Date(2019, 7, 10, 23, 59),
        openTime: "", // 请求参数 开放时间
        userName: "", // 姓名
        num: "", //现有总表容量
        phone: "", // 电话
        power: "", //入户总线电压
        startTime2: "",
        endTime2: "",
        tempFilePaths: [],
        httpFilePaths: [], // 图片上传服务器返回地址
        addPhoto: true,
        text: "",
        disabled: false,
        address: "",
        file: [],
        loading: false,
        uploadCount: 0 // 上传图片成功计数
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
      uploadFile(e) {
        let file = e.target.files
        console.log(file)
        for (let i = 0; i < file.length; i++) {
          // 大于1M压缩
          if (file[i].size > 1 * 1024 * 1024) {
            this.fileResizetoFile(file[i], 0.4, (res) =>{
              console.log(res, 'kkk')
              let files = new window.File([res], 'image.png', {type: "image/jpeg"})
              this.file.push(files)
            })
          } else[
            this.file.push(file[i])
          ]
          let s = file[i]
          let binaryData = [];
          binaryData.push(file[i]);
          let src
          if (window.createObjectURL != undefined) { //basic
            src = window.createObjectURL(new Blob(binaryData, {
              type: "application/zip"
            }))
            // 　　url = window.createObjectURL(file);
            　　
          } else if (window.URL != undefined) { //mozilla(firefox)兼容火狐
            // 　　url = window.URL.createObjectURL(file);
            src = window.URL.createObjectURL(new Blob(binaryData, {
              type: "application/zip"
            }))　　
          } else if (window.webkitURL != undefined) { //webkit or chrome
            　　
            // url = window.webkitURL.createObjectURL(file);
            src = window.webkitURL.createObjectURL(new Blob(binaryData, {
              type: "application/zip"
            }))　　
          }
          this.tempFilePaths.push(src)
        }
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
      del(index) {
        console.log(index)
        this.tempFilePaths.splice(index, 1);
        this.file.splice(index, 1);
        this.addPhoto = true;
      },
      next() {
        this.uploadCount = 0
        let falg = this.textDectorers();
        if (!falg) return false;
        this.disabled = true;
        // new Promise((resolve, reject) => {
        // let falg = this.tempFilePaths.length
        this.loading = true
        if (this.tempFilePaths.length > 0) {
          this.file.forEach((el, index) => {
            var params = new FormData();
            params.append('file', this.file[index]);
            setTimeout(() => {
              this.uploadImages(params, index)
              clearTimeout()
            }, 300);
          })
        } else {
          this.applicationOwner();
        }
        // }).then((a) => {
        //   console.log(this.httpFilePaths, 'kkkkkkkkkkkkkk')
        // })
        // this.applicationOwner();
      },
      // 检测输入桩主信息
      textDectorers() {
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
        return true;
      },
      async uploadImages(params, index) {
        let res = await api.uploadProfile({
          method: 'myupload',
          query: {
            file: params
          }
        })
        if (res.errCode === 5001) {
          let options = {
            message: '上传图片出错!' + res.err,
            type: 'error',
            center: true,
            offset: 200
          }
          Message(options)
          this.loading = false
        }
        if (res.code === 200) {
          this.uploadCount++
            console.log(res.result.headUrl)
          console.log(index)
          this.httpFilePaths.push(res.result.headUrl)
          if (this.uploadCount === this.tempFilePaths.length) {
            console.log(this.uploadCount, this.tempFilePaths.length)
            console.log('success', this.httpFilePaths)
            this.applicationOwner();
          }
        } else {}
      },
      async applicationOwner() {
        let res = await api.applicationOwner({
          method: "POST",
          query: {
            address: this.address,
            realName: this.userName,
            phone: this.phone,
            openTime: this.openTime,
            tableCapacity: this.num,
            voltage: this.power,
            groundWireStatus: this.selText,
            cooperationType: this.selText2,
            imgs: this.httpFilePaths.toString(',') || ''
          }
        });
        if (res.code === 200) {
          this.loading = true
          this.$router.push("/reviewProgress?route=allpyOwner");
        }
      },
     
      // 压缩图片
      fileResizetoFile(file, quality, fn) {
        /**
         * filetoDataURL(file,fn) 会将 File（Blob）类型文件转变为dataURL字符串,其中 file 参数传入一个File（Blob）类型文件;fn为回调方法，包含一个dataURL字符串的参数
         */
        function filetoDataURL(file, fn) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            fn(e.target.result);
          };
          reader.readAsDataURL(file);
        };
        /**
         * dataURLtoImage(dataurl,fn) 会将一串dataURL字符串转变为Image类型文件,其中dataurl参数传入一个dataURL字符串,fn为回调方法，包含一个Image类型文件的参数
         */
        function dataURLtoImage(dataurl, fn) {
          var img = new Image();
          img.onload = function() {
            fn(img);
          };
          img.src = dataurl;
        };
        /**
         * canvasResizetoDataURL(canvas,quality) 会将一个Canvas对象压缩转变为一个dataURL字符串,其中canvas参数传入一个Canvas对象;quality参数传入一个0-1的number类型，表示图片压缩质量;
         */
        function canvasResizetoFile(canvas, quality, fn) {
          canvas.toBlob(function(blob) {
            fn(blob);
          }, 'image/jpeg', quality);
        };
        /**
         * imagetoCanvas(image)会将一个Image对象转变为一个Canvas类型对象，其中image参数传入一个Image对象
         */
        function imagetoCanvas(image) {
          var cvs = document.createElement("canvas");
          var ctx = cvs.getContext('2d');
          cvs.width = image.width;
          cvs.height = image.height;
          ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
          return cvs;
        };
        filetoDataURL(file, function(dataurl) {
          dataURLtoImage(dataurl, function(image) {
            canvasResizetoFile(imagetoCanvas(image), quality, fn);
          })
        })
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
        width: 102%;
        height: vw(150);
        flex-wrap: wrap;
        display: flex;
        margin-bottom: vw(32);
        margin-left: vw(-10);
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
          background: url('../../../../assets/uploadImg.png') no-repeat;
          background-size: cover;
          input {
            opacity: 0;
            width: 100%;
            height: 100%;
          }
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
        .nomarRi {
          margin-right: 0;
        }
      }
    }
    .button {
      width: 92%;
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
      width: 92% !important;
    }
    .el-button {
      padding: 0;
      height: vw(90) !important;
      line-height: vw(90) !important;
    }
    .is-loading {
      background: $bgPageColor3 !important;
      font-size: 18px !important;
      color: $fontColor3 !important;
    }
  }
</style>