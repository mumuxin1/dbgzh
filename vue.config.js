const px2rem = require('postcss-px2rem')
const postcss = px2rem({
  remUnit: 32.5 // 基准大小 baseSize，需要和rem.js中相同
})
module.exports = {
  devServer: {
    proxy: 'http://192.168.1.132:8080/shared-power-bank-admin'
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  }
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
