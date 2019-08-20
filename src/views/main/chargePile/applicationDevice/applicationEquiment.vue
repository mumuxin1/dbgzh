<template>
  <div class="applicationEquiment">
    <mu-header class="muHeader" title="申请设备" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="tit">泊位信息</li>
        <li class="txFull">
          <span>合作类型</span>
          <el-select v-model="selText" placeholder="请选择" class="select_element">
            <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li class="txone" @click="deviceType">
          <span>设备类型</span>
          <input type="text" class="inputs" placeholder="选择设备类型" v-model="selDevices.deviceModelName">
          <img src="@/assets/dianbo_shenqing_shuaixuan@3x.png" alt="" class="img">
        </li>
        <li class="txone">
          <span>设备数量</span>
          <input type="number" class="inputs" placeholder="请输入数量" v-model="deviceNum">
          <span class="span">台</span>
        </li>
        <span class="des"><font style="fontWeight: bold">图片信息</font>(至少1张,至多4张)</span>
        <span class="des">请选择充电点环境照片</span>
        <mu-uploadPicture :url.sync="url" ref="upload" @geturl="geturl" :maxLength="4"></mu-uploadPicture>
        <p class="txdes">自用设备：只能被指定用户/车牌使用，平台显示在总数中 ，不能预定不能扫码，商户可修改状态
        </p>
      </ul>
    </div>
    <!-- <div class="button-g button" @click="submit">
            提交申请
          </div> -->
    <!-- <div @click="submit" v-if="!loading">
        <el-tooltip :content="tipContent" placement="top" class="button-g button" :disabled="disabled">
          <el-button>提交申请</el-button>
        </el-tooltip>
      </div>
      <el-button type="primary" :loading="true" class="button button-g" v-else>申请中...</el-button> -->
    <mu-LoadToast @submit="submit" class="button" :content="content" :loading="loading" :tipContent="tipContent"></mu-LoadToast>
  </div>
</template>
<script>
  import {
    STROAGE
  } from '@/utils/muxin'
  import muheader from "@/components/header";
  import muLoadToast from '@/components/loadToast/loadToast'
  import uploadPic from "@/components/uploadPicture";
  import api from '@/api/api'
  import {
    async
  } from 'q';
  import {
    clearTimeout
  } from 'timers';
import { watch } from 'fs';
  export default {
    name: "applicationEquiment",
    components: {
      "mu-header": muheader,
      "mu-uploadPicture": uploadPic,
      "mu-LoadToast": muLoadToast
    },
    data() {
      return {
        selText: [],
        selOptions: [{
          value: 1,
          label: '提供场地申请合作'
        }, {
          value: 2,
          label: '投资'
        }],
        selDevices: [],
        deviceNum: '',
        tipContent: '',
        disabled: false,
        loading: false,
        content: '提交申请',
        tempFilePaths: [],
        httpFilePaths: [], // 图片上传服务器返回地址
        url:'http://47.112.22.47:8082/shared-admin/v1.0/upload_profile_photo',
        selectNum: 0 // 选则的图片数量
      };
    },
    created() {
      this.data_Init()
    },
    methods: {
      data_Init() {
        // 。。。
        let selDevices = STROAGE({
          type: 'getItem',
          key: 'selDevicesType'
        })
        if (selDevices) {
          this.selDevices = JSON.parse(selDevices)
        }
      },
      deviceType() {
        this.$router.push('chargeType')
        // 查询申请设备类型
        this.queryDeviceApplyList()
      },
      geturl(arrImg, type) {

        if (type === 'selectNum') {
          this.selectNum = arrImg
          return
        }
        console.log(arrImg, 'ooo')
        this.applicationEquiment(this.$parent.bsId, arrImg)
      },
      submit(type) {
        let falg = this.textDectorers();
        if(type = 'hideToast') {
          console.log('hjhjh')
          setTimeout(() => {
            this.tipContent = ''
            
          }, 1000);
        }
        if (!falg) return false;
        this.loading = true
        this.content = '提交中'
        this.$refs.upload.uploadImgs()
        this.disabled = true;
        // 申请设备
      },
      del(index) {
        this.tempFilePaths.splice(index, 1);
        this.addPhoto = true;
      },
      uploadFile(e) {
        let file = e.target.files
        this.file = file
        // let reader = new FileReader();
        // alert(file)
        for (let i = 0; i < file.length; i++) {
          console.log(file[i], '2222')
          // alert(file[i])
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
      // 检测输入桩主信息
      textDectorers() {
        if (!this.selText) {
          this.selText = null;
          this.tipContent = '请输入合作类型'
          return false;
        }
        if (!this.selDevices.deviceModelName) {
          this.tipContent = '请选择设备类型'
          return false;
        }
        if (!this.deviceNum) {
          // this.phone = null;
          this.tipContent = '请输入申请设备数量'
          return false;
        }
        if (this.deviceNum > 9999) {
          // this.phone = null;
          this.tipContent = '申请设备数量最多为9999台'
          return false;
        }
        console.log(this.tempFilePaths)
        if (this.selectNum < 1) {
          // this.phone = null;
          this.tipContent = '请至少上传1张图片'
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
        this.loading = true
        if (res.code === 200) {
          console.log(res.result.headUrl)
          console.log(index)
          this.httpFilePaths.push(res.result.headUrl)
          if (index === this.tempFilePaths.length - 1) {
            this.applicationEquiment(this.$parent.bsId, arrImg)
          }
        }
      },
      // 申请设备
      async applicationEquiment(bsId, arrImg) {
        let res = await api.applicationEquiment({
          method: 'POST',
          query: {
            bsId: bsId,
            merchantCooperation: this.selText,
            deviceModel: this.selDevices.id,
            deviceNum: this.deviceNum,
            parkImgs: arrImg.toString(',') || ''
          }
        })
        if (res.code === 200) {
          this.$parent.requestCallback({
            message: '提交成功',
            type: 'success',
            center: true,
            offset: 450,
            duration: 600
          })
          setTimeout(() => {
            this.$router.push('/reviewProgress?route=applyDevice')
            clearTimeout()
          }, 600);
        } else if (res.code === 500) {
          this.$parent.requestCallback({
            message: res.message,
            type: 'error',
            center: true,
            offset: 450,
            duration: 6000
          })
        }
      },
      // 查询申请设备类型
      async queryDeviceApplyList() {
        let res = await api.queryDeviceApplyList({
          query: {
            column: 'createTime',
            order: 'desc',
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            hangType: ''
          }
        })
        if (res.code === 0) {
          STROAGE({
            type: 'setItem',
            key: 'DevicesTypeList',
            item: res.result.records
          })
        }
      }
    },
    watch:{
      $route (newval, old) {
        console.log(newval)
        if (newval.name === 'applicationEquiment') {
          let selDevices = STROAGE({
          type: 'getItem',
          key: 'selDevicesType'
        })
        if (selDevices) {
          this.selDevices = JSON.parse(selDevices)
        }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .applicationEquiment {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    .content {
      margin: vw(30);
      overflow-y: scroll;
      height: auto;
      ul {
        width: 100%;
        height: auto;
        padding: 0 vw(32);
        padding-bottom: vw(32);
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
          height: vw(90);
          display: flex;
          text-align: left;
          font-size: vw(30);
          color: #333333;
          align-items: center;
          margin-bottom: vw(32);
          &:first-child {
            margin-bottom: 0;
          }
        }
        .txFull {
          .select_element {
            width: vw(470);
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
            flex: 7.5
          }
        }
        .txone {
          .inputs {
            width: vw(390);
            height: vw(64);
            line-height: vw(90);
            border: vw(1) solid #e5e5e5;
            border-radius: vw(5);
            margin-right: vw(32);
            padding: 0 vw(32);
          }
          .span {
            width: vw(48);
            text-align: center;
          }
          .img {
            width: vw(48);
            height: vw(48);
            align-self: center;
          }
          span {
            text-align: left;
            line-height: vw(59);
            &:nth-child(1) {
              margin-right: vw(30);
              flex: 2.5;
            }
            &:nth-child(2) {
              flex: 7.5;
            }
          }
        }
      }
      .des {
        margin-bottom: vw(32);
        color: #333333;
        text-align: left;
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
      }
      .uploadImg {
        width: vw(150);
        height: vw(150);
        position: relative;
        margin-right: vw(7);
        .img {
          width: vw(150);
          height: vw(150);
          display: block;
          background: greenyellow;
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
    } // .button {
    //   width: 94%;
    //   height: vw(90);
    //   line-height: vw(90);
    //   color: white;
    //   background: #56baf9;
    //   border-radius: vw(5);
    //   margin-top: vw(30);
    //   margin: 0 auto;
    // }
  }
</style>