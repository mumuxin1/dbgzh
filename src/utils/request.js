import axios from 'axios'
import {
  STROAGE
} from './muxin'
function makeQuery(queryObject) {
  if (!queryObject) return ''
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join('='))
      return result
    }, []).join('&')
  return `?${query}`
}
const apiRequest = async (params = {}, url) => {
  let data = params.query || {}
  console.log('ffffffffff')
  url = params.method ===  'POST'? url : url + makeQuery(params.query)
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
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Access-Token': token
    }
  }
  // let falg
  let res = await axios(httpDefaultOpts)
  console.log('res-------------' + url, res.data)
  // console.log('request----', res)
  return res.data
  // new Promise((resolve, reject) => {
  //   axios(httpDefaultOpts).then(
  //     (res) => {
  //       resolve(res)
  //     }
  //   ).catch(
  //     (response) => {
  //       reject(response)
  //     }
  //   )
  // }).then(res => {
  //   falg = true
  //   console.log('res-------------' + url, res.data)
  //   return res.data
  // })
  // setTimeout(() => {
  //   if (!falg) {
  //     console.log('网络不良加载超时')
  //   }
  // }, 300)
}
export default {
  apiRequest
}