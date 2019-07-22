<template>
  <div class="myChargPile">
    <mu-header class="muHeader" title="我的电站" :left="true" :back="true"></mu-header>
    <div class="content">
      <ul>
        <li class="tit">深圳市宝安区西乡街道充电桩</li>
        <li class="txFull">
          <span>电桩地址</span>
          <div class="text">
            深圳市宝安区西乡街道迪福路2号
          </div>
        </li>
        <li class="txone">
          <span>开放时间</span><span>00:00-24:00</span>
        </li>
        <li class="txone">
          <span>累计收益</span><span>220048.60元</span>
        </li>
        <div class="navsButton">
          申请新设备
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
import muheader from "../../../components/header";
export default {
  name: "myChargPile",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      // userName: ""
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
.myChargPile {
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: vw(30);
  .content {
    flex: 1;
    background: #f6f6f6;
    padding: vw(30);
    overflow-y: scroll;
    ul{
      width: 100%;
      height: auto;
      padding: vw(32);
      background: white;
      display: flex;
      flex-direction: column;
      margin-bottom: vw(32);
      border-radius: vw(7);
      .tit{
        font-size: vw(32);
        color: #333333;
        font-weight: bold;
        margin-bottom: vw(20);
      }
      li{
        width: 100%;
        height: vw(59);
        display: flex;
        text-align: left;
        font-size: vw(30);
        color:#999999;
      }
      .txFull{
        span{
          flex: 2.5;
          margin-right: vw(30);
          line-height: vw(59);
        }
        .text{
          align-self: center;
          flex: 7.5
        }
      }
      .txone{
        span{
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
      .navsButton{
        width: 100%;
        height: vw(90);
        line-height: vw(90);
        color: white;
        background: #56baf9;
        border-radius: vw(5);
        margin-top: vw(30);
      }
    }
    
  }
}
</style>