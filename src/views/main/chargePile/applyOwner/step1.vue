<template>
  <div class="step1">
    <mu-header class="muHeader" title="申请桩主" :left="false" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="tit">基本信息</li>
        <li class="selAdres">
          <span>地址</span>
          <div class="rticon">
            <span>请选择</span>
            <img src="@/assets/dianbo_public_right@3x.png" alt="">
          </div>
        </li>
        <li class="selAdres">
          <span>姓名</span>
          <div class="rticon">
            <input type="text" placeholder="请输入" v-model="userName">
          </div>
        </li>
        <li class="selAdres">
          <span>联系电话</span>
          <div class="rticon">
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
          <div class="rticon">
            <input type="number" placeholder="请输入" v-model="num">
          </div>
        </li>
        <li class="selAdres">
          <span>入户总线电压</span>
          <div class="rticon">
            <input type="number" placeholder="请输入" v-model="power">
          </div>
        </li>
        <li class="txFull">
          <span>是否有地线接</span>
          <el-select v-model="selText" placeholder="请选择" class="select_element">
            <el-option
              v-for="item in selOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li class="txFull">
          <span>合作类型</span>
          <el-select v-model="selText2" placeholder="请选择" class="select_element">
            <el-option
              v-for="item in selOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <span class="des mar48">
          <font style="fontWeight:bold;fontSize:16px">图片信息</font>(至少3张)
        </span>
        <span class="des">请选择充电 环境照片</span>
        <div class="upImg">
        <div class="uploadImg" v-for="item in tempFilePaths" :key="item.index" >
          <img :src="item" alt="" class="img">
          <img src="@/assets/gfun_close1@3x.png" alt="" class="del" @click="del(item.index)">
        </div>
        <img
          src="@/assets/dianbo_shenqing_add@3x.png"
          alt=""
          class="selImg"
          @click="chooseImg"
          v-if="addPhoto"
        >
      </div>
      </ul>
      <div class="button-g button" @click="next">下一步</div>
    </div>
  </div>
</template>
<script>
import { STROAGE, timeFormat } from "@/utils/muxin";
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
      selOptions: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 2,
          label: "否"
        }
      ],
      selText2: [],
      selOptions2: [
        {
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
      placeholde: "扫描二维码或输入编码"
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
          if (this.tempFilePaths.length >= 3) {
            this.addPhoto = false;
          } else {
            this.addPhoto = true;
          } // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        }
      });
    },
    del (index) {
      this.tempFilePaths.splice(index, 1);
      this.addPhoto = true
    },
    // 电桩详情
    next() {
      // 查询充电桩设备列表
      this.startTime2 = timeFormat(this.startTime, "-", "00:00");
      this.endTime2 = timeFormat(this.endTime, "-", "00:00");
      this.openTime = this.startTime2 + "-" + this.endTime2;
      let flag = this.userName && this.phone && this.openTime && this.num && this.power && this.selText && this.selText2
      if (flag) {
        this.applicationOwner();
      }
      // this.applicationOwner();
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
          span {
            margin-right: vw(16);
            align-self: center;
          }
          img {
            width: vw(16);
            height: vw(28);
          }
          input {
            width: vw(200);
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
        height: vw(48);
        // background: red;
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
          display: block;
          // background: greenyellow;
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

}
</style>