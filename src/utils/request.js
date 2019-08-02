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
      timeout: 30000,
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
      console.log('上传图片错误信息', err)
      vim.$children.requestCallback({
        message: err,
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

      return res.data
    } catch (err) {
      console.log(err)
      console.log(vim.$children[0].requestCallback)
      vim.$children[0].requestCallback({
        message: err,
        type: 'error',
        center: true,
        offset: 300
      })
    }
  }
}
export default {
  apiRequest
}