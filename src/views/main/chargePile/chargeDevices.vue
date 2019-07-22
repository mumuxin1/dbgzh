<template>
  <div class="chargeDevices">
    <mu-header class="muHeader" title="电桩设备" :left="true" :back="true"></mu-header>
    <div class="sel">
      <el-select v-model="selText" placeholder="请选择" class="select_element">
        <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searText" class="input_element">
      </el-input>
    </div>
    <div class="content">
      <div class="nums">设备总数:</div>
      <ul>
        <li class="txone">
          <span class="color_99">设备名称</span><span>保利微座充电桩小白</span>
          <div class="liButton">
          </div>
        </li>
        <li class="txone">
          <span class="color_99">设备编号</span><span>2145879325213.60元</span>
        </li>
         <li class="txone">
          <span class="color_99">设备编号</span><span>2145879325213.60元</span>
        </li>
        <li class="txFull">
          <span class="color_99">电桩地址</span>
          <div class="text">
            深圳市宝安区西乡街道迪福路2号
          </div>
        </li>
        <div class="liButton">
          <div class="btn gre">
            已开启
          </div>
          <div class="btn org">
            忙碌
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
  import muheader from "../../../components/header";
  export default {
    name: "chargeDevices",
    components: {
      "mu-header": muheader
    },
    data() {
      return {
        searText: '', // sousuoneirong
        selOptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        selText: '' // 下拉选择neirong
      };
    },
    methods: {
      del() {
        // this.userName = "";
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../styles/theme.scss";
  .chargeDevices {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    .sel {
      width: 100%;
      height: vw(128);
      background: white;
      padding: vw(32) vw(17);
      display: flex;
      .el-input__inner {
        height: vw(64) !important;
      }
      .select_element {
        width: vw(200);
        margin-right: vw(32);
        .el-input--suffix {
          height: vw(64) !important;
          padding: 0 vw(20);
        }
      }
      .input_element {
        flex: 1;
      }
    }
    .content {
      flex: 1;
      background: #f6f6f6;
      padding: vw(30);
      overflow-y: scroll;
      .nums{
        text-align: left;
        margin-bottom: vw(24);
        color: #333333;
      }
      ul {
        width: 100%;
        height: auto;
        padding: vw(14) vw(32);
        background: white;
        display: flex;
        flex-direction: column;
        margin-bottom: vw(32);
        border-radius: vw(7);
        position: relative;
        .color_99{
          color: #333333 !important ;
        }
        .tit {
          font-size: vw(32);
          color: #333333;
          font-weight: bold;
          margin-bottom: vw(20);
        }
        li {
          width: 100%;
          height: vw(59);
          display: flex;
          text-align: left;
          font-size: vw(30);
          color: #999999;
        }
        .txFull {
          span {
            flex: 2.5;
            margin-right: vw(30);
            line-height: vw(59);
          }
          .text {
            align-self: center;
            flex: 7.5
          }
          
        }
        .txone {
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
        .navsButton {
          width: 100%;
          height: vw(90);
          line-height: vw(90);
          color: white;
          background: #56baf9;
          border-radius: vw(5);
          margin-top: vw(30);
        }
        .liButton{
            width: vw(88);
            height: auto;
            right: vw(32);
            position: absolute;
            top: vw(-14);
            .btn{
              width: vw(88);
              height: vw(40);
              line-height: vw(40);
              margin-top: vw(32);
              border: vw(1) solid;
              border-radius: vw(4);
              font-size: vw(24);
            }
            .gre{
              color: #8ee750;
              border-color: #8ee750;
            }
            .org{
             color: #ffa958;
              border-color: #ffa958; 
            }
          }
      }
    }
  }
  /deep/ {
    // select
    .el-input__inner {
      height: vw(64);
      color: #333333;
      font-size: vw(28);
      padding-left: vw(20);
    }
    
    .el-input__suffix-inner {
      position: relative;
      top: vw(-12);
      right: vw(22);
    }
    // Input
    .input_element .el-input__inner{
      padding-left: vw(60);
      
    }
    .el-input__prefix{
      position: relative;
      top: vw(-45);
      left: vw(-222);
    }
  }
  .el-select-dropdown__item {
    height: vw(64) !important;
    line-height: vw(64) !important;
    span {
      display: block;
      height: vw(64) !important;
      line-height: vw(64) !important;
    }
  }
</style>