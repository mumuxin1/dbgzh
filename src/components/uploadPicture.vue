<template>
  <div class="uploadPicture">
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
  </div>
</template>
<script>
  export default {
    name: "uploadPicture",
    props: {
      tempFilePaths: {
        type: Array,
        default: () => {
          return []
        }
      },
      httpFilePaths: {
        type: Array,
        default: () => {
          return []
        }
      },
      addPhoto: {
        type: Boolean,
        default: false
      },
      file: {
        type: Array,
        default: () => {
          return []
        }
      },
      maxLength: {
        type: Number,
        default: 4
      },
      url: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 删除选中图片
      del(index) {
        console.log(index)
        this.tempFilePaths.splice(index, 1);
        this.file.splice(index, 1);
        this.addPhoto = true;
      },
      // 选择图片 压缩
      uploadFile(e) {
        let file = e.target.files
        console.log(file)
        for (let i = 0; i < file.length; i++) {
          // 大于1M压缩
          if (file[i].size > 1 * 1024 * 1024) {
            this.fileResizetoFile(file[i], 0.4, (res) => {
              console.log(res, 'kkk')
              this.file.push(res)
            })
          } else [
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
      },
      // 上传服务器
      async uploadImg(file, successm, err) {
        let myuploads = axios.create({
          baseURL: this.url,
          timeout: 30000,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
        try {
          console.log(data.file)
          let res = await myuploads.post(url, file)
          let success = function (res) {}
          return success
        } catch (err) {
          console.log('上传图片错误信息', err)
          let err = function (err) {}
          return err
        }
      }
    }

  }
</script>
<style lang="scss" scoped>
  @import "../styles/theme.scss";
  .uploadPicture {
    width: 100%;
    height: auto;
    position: relative;
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
        background: url('../assets/uploadImg.png') no-repeat;
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
</style>