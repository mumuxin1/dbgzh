<template>
  <div class="login" >
    <mu-header class="muHeader" title="登录" :left="false" :back="true"></mu-header>
    <div class="content" :class="{'upTranslatey':upmove,'downTranslatey':!upmove}">
      <div class="from" >
        <img src="@/assets/dianbo_login_user@3x.png" alt="">
        <input type="text" placeholder="请输入账号" v-model="userName" @blur="blur('userName')">
        <img src="@/assets/dianbo_qianbao_delete@3x.png" alt="" class="del" @click="del" v-if="userName !== ''">
      </div>
      <div class="from">
        <img src="@/assets/dianbo_login_passwords@3x.png" alt="">
        <input type="password" placeholder="请输入密码" v-model="password" @blur="blur" @focus="passKeyword = true">
      </div>
      <div :class="!loginInfoFlag ? 'button-g button disabled' : 'button-g button abled'" @click="login">登录</div>
    </div>
  </div>
</template>
<script>
import muheader from "../../components/header";
import api from '@/api/api'
import {STROAGE} from '@/utils/muxin'
import { type } from 'os';
export default {
  name: "login",
  components: {
    "mu-header": muheader
  },
  data() {
    return {
      userName: "",
      password: '',
      upmove: null,
      passKeyword: false, // 输入密码状态键盘
      clientHeight: '',
      fullHeight: document.documentElement.clientHeight
    };
  },
  computed: {
    loginInfoFlag () {
      if (this.userName === '' || this.password === '') {
        return false
      } else {
        return true
      }
    }
  },
  async created() {
    let res = await api.queryUserInfo()
    if (res.code === 0) {
      this.userType = res.result.userType
      this.$router.push('/personInfo')
    }
  },
  mounted() {
    window.onresize = () => {
        // console.log(this.$refs.mulogin.$el.style)
        // alert(1)
        // h = this.fullHeight - document.documentElement.clientHeight
        // if (h > 50) {
        //   this.$refs.mulogin.$el.style.top = 25 + '%'
        // } else {
        //   alert(1)
        //   this.$refs.mulogin.$el.style.top = -70 + '%'
        // }
        this.clientHeight = document.documentElement.clientHeight
        if (this.fullHeight > this.clientHeight) {
          this.upmove = true
        } else {
          if (!this.passKeyword) {
            this.upmove = false
          }
        }
      }
  },
  methods: {
    blur (type) {
      console.log(navigator)
      if (navigator.userAgent.indexOf('Android') !== -1) {
        if (type === 'userName') return
        this.passKeyword = false
        this.upmove = false
      } else {
        var speed = 1; //页面滚动距离
        let timer = setInterval(function() {
          console.log('a')
          let currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
          currentPosition -= speed;
          window.scrollTo(0, currentPosition); //页面向上滚动
          currentPosition += speed; //speed变量
          window.scrollTo(0, currentPosition); //页面向下滚动
          clearInterval(timer);
        }, 1)
        
      }
    },
    del() {
      this.userName = "";
    },
    login () {
      this.loginRequest()
    },
    async loginRequest () {
      if (this.loginInfoFlag) {
        let res = await api.login({
          method: 'POST',
          query: {
            username: this.userName,
            password: this.password
          }
        })
        if (res.code === 200) {
          STROAGE({
            type: 'setItem',
            key: 'UserInfo',
            item: res.result
          })
          this.$router.push('/personInfo')
        }
      }
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
  // display: flex;
  // flex-direction: column;
  font-size: vw(28);
  background: url(../../assets/logo.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  .content {
    position: absolute;
    width: 100%;
    // top: 39%;s
    // left: 50%;
    // margin-left: vw(-325);
    // flex: 1;
    background: #f6f6f6;
    // top: 20%;
    padding: vw(30);
    padding-top: vh(50);
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
        right: 0;
      }
    }
    .button {
      height: vw(87);
      line-height: vw(87);
    }
    .disabled {
      color: #999999;
      background: #e5e5e5;
    }
    .abled{
      color: white;
      background: fontColor()
    }
  }
}
  .upTranslatey {
  animation: upTormtranslate .3s linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.downTranslatey {
  animation: downFormtranslate .3s linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes upTormtranslate {
  0% {
    top: 30%;
  }

  100% {
    top: 0%;
  }
}

@keyframes downFormtranslate {
  0% {
    top: 0%;
  }

  100% {
    top: 30%;
  }
}

</style>