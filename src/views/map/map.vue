<template>
  <div class="faultReport">
    <mu-header class="muHeader" title="地图" :left="true" :back="true"></mu-header>
    <div class="amap-page-container">
      <div class="search">
        <div class="cityName" @click="cityPatFun">{{cityInputVal}}</div>
        <img src="@/assets/dianbo_dianzhan_down@3x.png" alt="" class="icon" @click="cityPatFun">
        <div class="line"></div>
        <img src="@/assets/dianbo_dianzhan_search@3x.png" alt="" class="searIcon">
        <input type="text" name="" id="" placeholder="小区 /写字楼/学校等 " @input="searchInput" v-model="keyWord">
        <img src="@/assets/dianbo_qianbao_delete@3x.png" alt="" class="searIcon del" @click="del" v-if="keyWord">
      </div>
      <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" ref='searchMap' style="opacity:1"></el-amap-search-box>
      <!-- " -->
      <el-amap vid="amap" :center="center" :zoom="zoom" class="amap-demo" :plugin="plugin" :amap-manager="amapManager" :events="events" ref="map">
        <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker"></el-amap-marker>
        <el-amap-info-window :position="currentWindow.position" :visible="currentWindow.visible" :content="currentWindow.content" ref="infoWindow"></el-amap-info-window>
      </el-amap>
      <!-- <div class="toolbar">
                        <button @click="getMap()">get map</button>
                      </div> -->
    </div>
    <!-- <div class="citybtn" @click="cityPatFun">{{cityInputVal}}</div> -->
    <div class="select">
      <div v-for="item of addressList" class="selectdren" @click="addClick(item)">
        <!-- <img class="addimg" src="@/assets/timg.jpg"> -->
        <p class="p1">{{item.name}}</p>
        <p class="p2">{{item.address}}</p>
      </div>
    </div>
    <!-- <section id="adminBox">
              <div class="cityChoice">
                <h3>点击输入框选择内容</h3>
                <input type="text" class="cityInput" v-model.trim='cityInputVal' @click='cityPatFun' />
              </div>
              <com-citychoice ref="city" v-on:tochildevent='cityjs'></com-citychoice>
            </section> -->
    <com-citychoice ref="city" v-on:tochildevent='cityjs'></com-citychoice>
  </div>
</template>
  
<script>
  import muheader from "@/components/header";
  import {
    STROAGE
  } from "@/utils/muxin";
  import Vue from 'vue'
  import comCitychoice from './city'
  import VueAMap from 'vue-amap'
  import {
    lazyAMapApiLoaderInstance
  } from 'vue-amap';
  import {
    AMapManager
  } from 'vue-amap';
  export default {
    // el:'#adminBox',
    name: "faultReport",
    components: {
      "mu-header": muheader,
      comCitychoice
    },
    data() {
      let self = this
      return {
        cityInputVal: '',
        zoom: 16,
        center: [116.397428, 39.90923], // 默认首次加载北京地图 未定位成功前
        markers: [],
        currentWindow: {
          position: [0, 0],
          content: '',
          visible: true,
        },
        address: '',
        lng: 0,
        lat: 0,
        loaded: false,
        searchOption: {
          city: '',
          citylimit: true
        },
        addressList: [],
        province: {},
        city: {},
        area: {},
        amapManager: null, // 高德原生实例
        events: {
          init: (o) => {
              console.log(o.getCenter())
              console.log(this.$refs.map.$$getInstance())
              o.getCity(result => {
                console.log(result)
              })
          },
          'click': (e) => {
            console.log(e)
            this.$refs.infoWindow.$amapComponent.close()
            this.getaddress(e.lnglat.lng, e.lnglat.lat, 'click')
            
            // this.onSearchResult({
            //   lng: e.lnglat.lng,
            //   lat: e.lnglat.lat
            // })
          }
        },
        plugin: [{
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          // timeout: 100000,          //超过10秒后停止定位，默认：无穷大
          // maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          // extensions:'all',
          resizeEnable: true,
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              console.log(self.$parent.selAdress === '请选择' || self.$parent.selAdress === '', 'ggg')
              if (self.$parent.selAdress === '请选择' || self.$parent.selAdress === '') {
                o.getCurrentPosition((status, result) => {
                  console.log(result)
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat]
                    if (result.addressComponent) {
                      self.cityInputVal = result.addressComponent.city
                      self.searchOption.city = result.addressComponent.city
                      self.searchOption.citylimit = true
                    }
                    // STROAGE({
                    //   type: 'setItem',
                    //   key: 'Location',
                    //   item: {
                    //     city: result.addressComponent.city || '',
                    //     lng: result.position.lng,
                    //     lat: result.position.lat
                    //   }
                    // })
                    // self.province = result.addressComponent.province
                    // self.city = result.addressComponent.city
                    // self.area = result.addressComponent.area
                    // self.$nextTick()
                  }
                })
              }
            }
          }
        }],
        map: null,
        keyWord: null
      }
    },
    created() {
     
    },
    mounted() {
      this.plug_Init()
    },
    methods: {
      // 搜索框 城市 infoWindow 初始化
      plug_Init() {
        // })
        if (this.$parent.selAdress !== '请选择' && this.$parent.selAdress !== '') {
          let location = STROAGE({
            type: 'getItem',
            key: 'Location'
          })
          if (location) {
            location = JSON.parse(location)
            this.center = [location.lng, location.lat]
            this.cityInputVal = location.city
          }
          this.$refs.searchMap.keyword = this.$parent.selAdress
          this.keyWord = this.$parent.selAdress
          this.$refs.searchMap.loaded = true
          this.$refs.searchMap.autoComplete()
          this.getMap(this.$parent.selAdress)
        }
      },
      // 输入提示poi搜索
      searchInput() {
        this.$refs.searchMap.keyword = this.keyWord
        this.$refs.searchMap.loaded = true
        this.$refs.searchMap.autoComplete()
        if (this.keyWord === '') {
          this.$refs.searchMap.tips = []
        }
      },
      del() {
        this.keyWord = ''
        this.$refs.searchMap.loaded = false
        this.$refs.searchMap.keyword = null
        this.$refs.searchMap.tips = []
        this.addressList = []

      },
      cityPatFun() {
        this.$refs.city.cityFun()
      },
      cityjs(data) {
        this.keyWord = ''
        this.cityInputVal = data
        this.searchOption.city = data
        this.searchOption.citylimit = true
        this.$refs.infoWindow.$amapComponent.close()
        this.$refs.searchMap.tips = []
        this.getMap(data)
      },
      getaddress(lng, lat, type) {
        window.AMap.plugin('AMap.Geocoder', () => {
          new window.AMap.Geocoder().getAddress([lng, lat], (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              console.log(result)
              if (type === 'click') {
                this.$refs.searchMap.keyword = result.regeocode.formattedAddress.split('区')[1]
                this.keyWord = result.regeocode.formattedAddress.split('区')[1]
                this.$refs.searchMap.loaded = true
                this.$refs.searchMap.autoComplete()
                this.addressList = [{
                  lng: lng,
                  lat: lat,
                  name: result.regeocode.formattedAddress.split('区')[1],
                  address: result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
                }]
                return
              }
              this.$parent.selAdress = result.regeocode.formattedAddress
              self.address = result.regeocode.formattedAddress
              // this.currentWindow = {
              //   position: [lng, lat],
              //   content: `<div class="prompt">${result.regeocode.formattedAddress}</div>`,
              //   visible: true
              // }
              this.$router.go(-1)
            }
          })
        })
      },
      getMap(address) {
        window.AMap.plugin('AMap.Geocoder', () => {
          new window.AMap.Geocoder().getLocation(address, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              console.log(result)
              this.cityInputVal = result.geocodes[0].addressComponent.city
              this.lng = result.geocodes[0].location.lng
              this.lat = result.geocodes[0].location.lat
              this.center = [this.lng, this.lat]
              this.currentWindow = {
                position: [this.lng, this.lat],
                content: `<div class="prompt">${this.$parent.selAdress}</div>`,
                visible: true
              }
            }
          })
        })
      },
      onSearchResult(pois) {
        console.log(pois, 'kkk')
        let latSum = 0
        let lngSum = 0
        let add = this.province + this.city + this.area
        this.addressList = pois
        if (pois.length > 0) {
          this.markers = []
          pois.forEach(poi => {
            let {
              lng,
              lat
            } = poi
            lngSum += lng
            latSum += lat
            this.markers.push([poi.lng, poi.lat])
          })
          this.center = [lngSum / pois.length, latSum / pois.length]
          this.zoom = 16
        }
      },
      addClick(item) {
        console.log(item)
        this.center = [item.lng, item.lat]
        this.markers = [
          [item.lng, item.lat]
        ]
        this.getaddress(item.lng, item.lat)
        this.addressList = []
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .amap-demo {
    height: 94VH;
  }
  .search-box {
    // flex: 1;
    width: 50vw;
    position: absolute;
    top: 8%;
    left: 30%;
    box-shadow: none; // z-index: -1;
    /deep/ .search-btn,
    .search-box-wrapper {
      opacity: 0 !important;
    }
    /deep/ .search-tips{
      max-height:vh(400);
      li{
        display: flex;
    align-items: center;
    text-align: left;
    line-height: inherit;
      }
    }
  }
  .citybtn {
    position: absolute;
    top: 8vh;
    left: 4vw;
    background: #ffffff;
    width: 100px;
    height: vw(86);
    line-height: 60px;
    border-right: 1px solid #56baf9;
    box-shadow: 0 2px 0px rgba(0, 0, 0, .15);
    border-radius: 2px 3px 3px 2px;
    z-index: 10;
  }
  .select {
    text-align: left;
    overflow: scroll;
    max-height: 50VH;
    width: 100%;
    position: absolute;
    bottom: 0px;
    /* height:50vh; */
  }
  .selectdren {
    background: #ffffff;
    padding: 3vw 4vw;
  }
  .addimg {
    width: 8vw;
    float: left;
  }
  .p1 {
    font-size: 4vw;
    color: #333333;
  }
  .p2 {
    font-size: 2vw;
    color: #999999;
  }
  .faultReport {
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: vw(30);
    background: #f6f6f6;
    .search {
      position: absolute;
      width: 92%;
      left: vw(32);
      background: white;
      height: vw(90);
      display: flex;
      padding: vw(24);
      align-items: center;
      padding-right: vw(10);
      z-index: 9999;
      top: 8%;
      box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
      .cityName {
        min-width: vw(100);
        max-width: vw(200);
        height: vw(42);
        text-align: left;
        align-self: center; //  background: red;
      }
      .icon {
        width: vw(28);
        height: vw(17);
        margin: 0 vw(24);
      }
      .line {
        width: vw(2);
        height: vw(30);
        background: #e5e5e5;
        margin-right: vw(24);
      }
      .searIcon {
        width: vw(28);
        height: vw(28);
        margin-right: vw(18);
      }
      .del {
        margin-left: vw(20);
        margin-right: 0;
      }
      .input {
        border: 0;
        background: white;
        width: 40% !important;
      }
    }
  }
</style>