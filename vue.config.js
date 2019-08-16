// const px2rem = require('postcss-px2rem')
// const postcss = px2rem({
//   remUnit: 32.5 // 基准大小 baseSize，需要和rem.js中相同
// })
module.exports = {
  // 将baseUrl: '/api',改为baseUrl: '/',
  // baseUrl: '/',
  devServer: {
    // proxy: 'http://47.112.22.47:8082/shared-admin',
    // proxy: 'http://192.168.1.132:8088/shared-admin',
    
    proxy: {
      '/shared-admin': {
        target: 'http://47.112.22.47:8082/shared-admin',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/shared-admin': ''
        }
      }
    },
    //反向代理
    // disableHostCheck: true
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         postcss
  //       ]
  //     }
  //   }
  // }
  // chainWebpack: config => {
  //   config.module
  //     .rule('images')
  //     .use('image-webpack-loader')
  //     .loader('image-webpack-loader')
  //     .options({
  //       bypassOnDebug: true
  //     })
  //     .end()
  // }
  // proxyTable: {
  //   '/api': {
  //     target: 'http://47.112.22.47:8082/shared-admin',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '/api': ''
  //     }
  //   }
  // }
  // 图片路径打包问题----还没完美解决
//   chainWebpack: config => {
//     config.resolve.alias
//       .set('assets', resolve('src/assets'))
//       .set('@', resolve('src'))
//     config.output.filename('[name].js?[hash]').end()
//   }
// // 对应的.vue文件中
// background: url('~assets/images/right-glay.png')
}
