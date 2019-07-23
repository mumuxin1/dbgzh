// import VUE_APP_BASE_API from '../../.en.development.js'
import apiRequest from '../utils/request.js'
// apiRequest = apiRequest.apiRequest
const apiUrl = process.env.VUE_APP_BASE_API
// const apiUrl = '/api'
console.log('接口地址---------》》》》' + process.env.VUE_APP_BASE_API)
/**
 * login
 * 业务
 */
// 登录
const login = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/login')
// 图片验证密码
const picCheckCode = (params) => apiRequest.apiRequest(params, apiUrl + '/captcha.jpg' + '?uuid=' + params.query.uuid)
/**
 * personINfo
 */
const queryUserInfo = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/userInfo')
/**
 * 
 * 我的电站
 */
// 查询我的充电桩列表
const queryChargeList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryBsList')
// 查询充电桩设备列表
const queryDevicesList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryDeviceByBsId')
// 查询设备详情
const queryDevicesDetails = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryDeviceInfoBySn')
/**
 * main
 * 业务
 */
// 查询代理商家
const queryProxy = (params) => apiRequest.apiRequest(params, apiUrl + '/generator/business/dropListByGzh')
// 查询店铺列表
const queryShop = (params) => apiRequest.apiRequest(params, apiUrl + '/generator/business/merListByGzh' + '?bId=' + params.query.bId)
// 查询店铺列表
const queryDeviceUsersinfo = (params) => apiRequest.apiRequest(params, apiUrl + '/generator/main/ratioList' + '?t= ' + '&page=' + params.query.page +
'&limit=' + params.query.limit + '&bId=' + params.query.bId + '&merId=' + params.query.merId + '&startTime=' + params.query.startTime + '&endTime=' + params.query.endTime)
export default {
  login,
  queryUserInfo,
  queryChargeList,
  queryDevicesList,
  queryDevicesDetails,
  picCheckCode,
  queryProxy,
  queryShop,
  queryDeviceUsersinfo
}
