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
// 更新设备详情
const upDateDevicesDetails = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/updateDeviceInfoBySn')
/**
 * 
 * 申请桩主 
 */
// 申请设备
const applicationEquiment = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/chargingUserApply')
// 查询申请设备类型
const queryDeviceApplyList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryChargingPileModelList')

// 申请桩主 
const applicationOwner = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/departApply')
export default {
  login,
  queryUserInfo,
  queryChargeList,
  queryDevicesList,
  queryDevicesDetails,
  upDateDevicesDetails,
  applicationEquiment,
  queryDeviceApplyList,
  applicationOwner
}
