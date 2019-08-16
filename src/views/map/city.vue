<template>
  <section class="cityChoiceBox" id="cityChoiceBox">
    <article class="cityChoice-top transit" v-bind:class='{focus:isCancel}'>
      <transition enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
        <span class="fa fa-angle-left" v-if='!isCancel' @click='cityClose'></span>
      </transition>
      <input type="text" class="search-input" placeholder="中文/拼音/首写字母" v-model.trim='ssval' @focus='search'/>
      <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
        <i v-if='isCancel' @click='isCancel=false' class="cancel">取消</i>
      </transition>
    </article>
    <article class="city-Box" v-show='!isCancel'>
      <div class="city-sidaber" id="city-sidaber" v-show='!isCancel'>
        <p v-for="(sidaber,index) in sidabers" @touchstart='mousedownFun(index)' @touchend='mouseupFun'>
          <a :href="gethref(sidaber)">{{sidaber}}</a>
        </p>
      </div>
      <div class="host-city">
        <h3 id="热门">热门城市</h3>
        <span v-for='(item,index) in hostCitys' v-text='item.name' @click='cityactive(item)'></span>
      </div>
      <div class="city-content">
        <div v-for="item in citys">
          <h3 :id="item.initial">{{item.initial}}</h3>
          <p v-for='(citem,index) in item.list' @click='cityactive(citem)'>{{citem.name}}</p>
        </div>
      </div>
      <div v-show='zimShow' class="zimShow" v-text='zimText'></div>
    </article>
    <article class="search-box" id="search-box" v-show='isCancel'>
      <p class="sousuo" v-for='(item,index) in sousuos' @click='cityactive(index,item)'>{{item.name}}</p>
    </article>
  </section>
</template>

<script>
  import Vue from 'vue'
  import json from './newcityjson'
  export default {
    name: "city",
    components: {},
    data() {
      return {
        isCancel: false,
        zimShow: false,
        sousuosList: [],
        ssval: '',
        zimText: '',
        sidabers: [
          '热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'
        ],
        citys:json.city,
        hostCitys: [{
            "code": "010", 
            "name": "北京", 
            "pinyin": "Beijing", 
            "label": "Beijing010"
          },{
            "code": "021", 
            "name": "上海", 
            "pinyin": "Shanghai", 
            "label": "Shanghai021"
          },{
            "code": "020", 
            "name": "广州", 
            "pinyin": "Guangzhou", 
            "label": "Guangzhou020"
          },
          {
            "code": "0755", 
            "name": "深圳", 
            "pinyin": "Shenzhen", 
            "label": "Shenzhen0755"
          },{
            "code": "028", 
            "name": "成都", 
            "pinyin": "Chengdu", 
            "label": "Chengdu028"
          },{
            "code": "0571", 
            "name": "杭州", 
            "pinyin": "Hangzhou", 
            "label": "Hangzhou0571"
          },{
            "code": "025", 
            "name": "南京", 
            "pinyin": "Nanjing", 
            "label": "Nanjing025"
          },{
            "code": "0512", 
            "name": "苏州", 
            "pinyin": "Suzhou", 
            "label": "Suzhou0512"
          },{
            "code": "023", 
            "name": "重庆", 
            "pinyin": "Chongqing", 
            "label": "Chongqing023"
          },{
            "code": "022", 
            "name": "天津", 
            "pinyin": "Tianjin", 
            "label": "Tianjin022"
          },{
            "code": "027", 
            "name": "武汉", 
            "pinyin": "Wuhan", 
            "label": "Wuhan027"
          },{
            "code": "029", 
            "name": "西安", 
            "pinyin": "Xian", 
            "label": "Xian029"
          }]
      }
    },
    created() {
      // this.wxConfig()  
    },
    methods: {
      //调用城市选择组件
      cityFun: function () {
        var cityChoiceBox = document.getElementById('cityChoiceBox');
        var citySidaber = document.getElementById('city-sidaber');
        var clientW = document.documentElement.clientWidth || document.body.clientWidth;
        cityChoiceBox.style.left = clientW + 'px';
        cityChoiceBox.style.display = "block"
        this.starMove(cityChoiceBox, { left: 0 }, function () {
          citySidaber.style.display = "block"
        });
      },
      //关闭城市选择组件
      cityClose: function () {
        this.isCancel = false;
        var cityChoiceBox = document.getElementById('cityChoiceBox');
        var citySidaber = document.getElementById('city-sidaber');
        var clientW = document.documentElement.clientWidth || document.body.clientWidth;
        citySidaber.style.display = "none"
        this.starMove(cityChoiceBox, { left: clientW }, function () {
          cityChoiceBox.style.display = "none"
        });
      },
      //变速运动
      starMove: function (obj, json, fn) {//添加一个回调函数fn
        function getStyle(obj, attr) {
          if (obj.currentStyle) {
            return obj.currentStyle[attr];
          } else {
            return getComputedStyle(obj, false)[attr];
          }
        }
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
          var flag = true; //假设都到达了目标值
          for (var attr in json) {
            //1.取当前值
            var icur = 0;
            icur = parseInt(getStyle(obj, attr));
            //2.算速度
            var speed = (json[attr] - icur) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            //3.检查停止
            if (icur != json[attr]) {
              flag = false;
            }
            obj.style[attr] = icur + speed + "px";
            if (flag) {
              clearInterval(obj.timer);
              if (fn) {//判断是否存在回调函数,并调用
                fn();
              }
            }
          }
        }, 20);
      },
      //搜索框获取焦点进入搜索层
      search: function () {
        this.isCancel = true;
      },
      gethref(zi){
        return '#'+zi
      },
      getsousuos(){
        let ssval = this.ssval;
        let arr = []
        for(let i of this.citys){
          let iarr = i.list.filter(item => item.pinyin.toLowerCase().indexOf(ssval) != -1 || item.name.indexOf(ssval) != -1)
          arr = arr.concat(iarr)
        }
        return arr
      },
      //热门活动
      hostCityss: function () {
        var j = 0;
        for (var i = 0; i < 15; i++) {
          Vue.set(this.hostCitys, j, this.citys[i]);
          j++
        }
      },
      cityactive: function (index) {
        this.cityClose();
        this.zimShow = false;
        this.$emit("tochildevent", index.name)
      },
      //侧栏字母鼠标按下事件
      mousedownFun: function (index) {
        this.zimShow = !this.zimShow;
        this.zimText = this.sidabers[index]
      },
      //侧栏字母鼠标弹起事件
      mouseupFun: function (index) {
        this.zimShow = !this.zimShow;
        // var cityChoiceBox = document.getElementById('cityChoiceBox');
        // var h3 = cityChoiceBox.getElementsByTagName('h3');
        // var timer = null;
        // function scrT(iTarget) {
        //   clearInterval(timer);
        //   document.ontouchstart = function () {
        //     clearInterval(timer);
        //   }
        //   timer = setInterval(function () {
        //     var scrollT = document.documentElement.scrollTop || document.body.scrollTop,
        //       speed = 0;
        //     speed = Math.floor((iTarget - scrollT) / 5);
        //     if (scrollT == iTarget) {
        //       clearInterval(timer);
        //     } else {
        //       document.documentElement.scrollTop = scrollT + speed;
        //       document.body.scrollTop = scrollT + speed;
        //     }
        //   }, 30);
        // }
        // scrT(h3[index].offsetTop - 50);
      }
    },
    computed: {
      sousuos: function () {
        return this.getsousuos()
        // return this.citys.filter(function (item) {
        //   return item.py.indexOf(ssval) != -1 || item.city.indexOf(ssval) != -1;
        // });
      }
    },
    mounted: function () {
      window.addEventListener('load', function () {
        var searchBox = document.getElementById('search-box');
        var srollH = document.documentElement.scrollHeight;
        searchBox.style.height = srollH + 'px';

      })
    }
  };
</script>
<style lang="css" scoped>
  @import "./css/Animate.css";
  @import url(http://cdn.bootcss.com/font-awesome/4.6.0/css/font-awesome.min.css);
  @import "./css/style.css";
</style>