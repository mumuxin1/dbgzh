import axios from 'axios'
import {
  STROAGE
} from './muxin'

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
    let instance = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    instance.post(url, data).then(res => {
      return res.data
    }).catch(error => {
      console.log(error);
    })
  }
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
  let res
  try {
    res = await axios(httpDefaultOpts)
    console.log('res-------------' + url, res.data)

    return res.data
  } catch (err) {
    return err
  }
  // console.log('request----', res)

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