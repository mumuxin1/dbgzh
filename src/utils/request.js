import axios from 'axios'
import Vue from 'vue'
import {
  STROAGE
} from './muxin'
import vim from '../main.js'
function makeQuery(queryObject) {
  if (!queryObject) return ''
  console.log('请求参数----》》》', queryObject)
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      if (entry[1]) {
        result.push(entry.join('='))
      }
      return result
    }, []).join('&')
  return `?${query}`
}
const apiRequest = async (params = {}, url) => {
  let data = params.query || {}
  params.method = params.method || 'GET'
  url = params.method === 'GET' ? url + makeQuery(params.query) : url
  // let contentType = parseInt(params.contentType) === 2 ? 'application/x-www-form-urlencoded; charset=utf-8' : 'application/json'
  //   // data.sign = SIGN
  //   // data.time = TIMESTAMP
  // console.log(url)
  // console.log(data)
  let token = STROAGE({
    type: 'getItem',
    key: 'UserInfo'
  })
  if (token) {
    token = JSON.parse(token).token
  }
  // if (data && params.method === 'GET') {
  //   data.
  // }
  if (params.method === 'myupload') {
    let self = params.vim
    let myuploads = axios.create({
      baseURL: url,
      timeout: 300000,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    // Vue.prototype.myuploads = myuploads
    try {
      console.log(data.file)
      let res = await myuploads.post(url, data.file)
      return res.data
    } catch (err) {
      console.dir(err)
      if (err.response.status === 500) {
        if (url.indexOf('/gzh/userInfo') !== -1) return false
        vim.$children[0].requestCallback({
          message: '登录失效请重新登录',
          type: 'error',
          center: true,
          offset: 300
        })
        vim.$children[0].$router.push('/')
      }
      console.log('', err)
      vim.$children[0].requestCallback({
        message: '上传图片错误信息',
        type: 'error',
        center: true,
        offset: 200
      })
      // return {
      //   err: err,
      //   errCode: 5001
      // }
      // let options = {
      //   message: '上传图片出错!',
      //   type: 'error',
      //   center: true,
      //   offset: 200

      // }
      // Message(options)
    }
    //  myuploads.post(url, data.file).then(res => {
    //     console.log(res)
    //     return res.data
    //   }).catch(error => {
    //     console.log(error);
    //   })
  } else {
    let httpDefaultOpts = {
      method: params.method || 'GET',
      url: url,
      timeout: 10000,
      data: data,
      headers: params.method === 'GET' ? {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Access-Token': token
      } : {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Access-Token': token
      }
    }
    // let falg
    let res
    try {
      res = await axios(httpDefaultOpts)
      console.log('res-------------' + url, res.data)
      if (res.data.code === 500) {
        vim.$children[0].requestCallback({
          message: res.data.message,
          type: 'error',
          center: true,
          offset: 300,
          duration: 1000
        })
        if (res.status === 500) {
          if (url.indexOf('/gzh/userInfo') !== -1) return false
          vim.$children[0].requestCallback({
            message: '登录失效请重新登录',
            type: 'error',
            center: true,
            offset: 300
          })
          vim.$children[0].$router.push('/')
        }
      }
      return res.data
    } catch (err) {
      console.log(typeof 
        err.request.readyState)
      console.dir(err)
      if (err.request.status === 0) {
        vim.$children[0].requestCallback({
          message: '服务异常',
          type: 'error',
          center: true,
          offset: 300
        })
      } else if (err.response.status === 500) {
          if (url.indexOf('/gzh/userInfo') !== -1) return false
           vim.$children[0].requestCallback({
             message: '登录失效请重新登录',
             type: 'error',
             center: true,
             offset: 300
           })
           vim.$children[0].$router.push('/')
         } else {
        vim.$children[0].requestCallback({
          message: err,
          type: 'error',
          center: true,
          offset: 300
        })
      }
      
    }
  }
}
export default {
  apiRequest
}