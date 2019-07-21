<template>
  <div class="login">
    <mu-header class="muHeader" title="登录" :left="true" :back="true"></mu-header>
    <div class="content">
      <div class="from">
        <img src="" alt="">
        <input type="text" placeholder="请输入账号" v-model="userName">
        <img src="" alt="" class="del" @click="del" v-if="userName !== ''">
      </div>
      <div class="from">
        <img src="" alt="">
        <input type="password" placeholder="请输入密码">
      </div>
      <div class="button-g button disabled">登录</div>
    </div>
  </div>
</template>
<script>
import muheader from "../../components/header";
export default {
  name: "login",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      userName: ""
    };
  },
  methods: {
    del() {
      this.userName = "";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/theme.scss";
.login {
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
    padding-top: vh(373);
    .from {
      width: 100%;
      height: vw(87);
      border: vw(1) solid #e5e5e5;
      border-radius: vw(1);
      padding: 0 vw(36);
      display: flex;
      margin-bottom: vw(30);
      background: white;
      position: relative;
      img {
        widows: vw(34);
        height: vw(41);
        margin-right: vw(28);
        align-self: center;
      }
      input {
        flex: 1;
        line-height: vw(87);
      }
      .del {
        width: vw(30);
        height: vw(30);
        padding: vw(15);
        position: absolute;
        background: red;
        right: 0;
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