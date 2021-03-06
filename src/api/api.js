// import VUE_APP_BASE_API from '../../.en.development.js'
import apiRequest from '../utils/request.js'
// apiRequest = apiRequest.apiRequest
const apiUrl = process.env.VUE_APP_BASE_API
// const apiUrl = '/api'
// http://47.112.22.47:8082/shared-admin
// http://192.168.1.132:8088/shared-admin
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
// 设备故障上报
const deviceFeedback = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/feedback')

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
/**
 * 交易查询
 */
// 查询交易订单列表
const queryOrderList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryOrdersList')
/**
 * 申请记录
 */
//查询申请记录
const queryApplyList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/chargingUserApplyList')
// 撤销申请
const cancelUserApply = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/cancelUserApply')
 /**
  * 桩户信息
  */
 //查询桩户详情
const queryBsInfo = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryBsInfo')
// 更新桩主信息
const updateBsInfo = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/updateBsInfo')
/**
 * 使用充电桩
 */
//校验设备状态
const checkSn = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/checkSn')
// 打开充电桩
const turnOn = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/turnOn')
// 关闭充电桩
const turnOff = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/turnOff')
// 查询当前后台用户是否存在正在控制的设备
const checkUserControlStatus = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/checkUserControlStatus')
// 查询设备开关状态
const queryDeviceStatus = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryDeviceStatus')
/**
 * 查询微信JSSDK权限验证配置参数
 */
const signature = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/signature')
/**
 * 上传图片
 */
const uploadProfile = (params) => apiRequest.apiRequest(params, 'http://47.112.22.47:8082/shared-admin/v1.0/upload_profile_photo')
/**
 * 钱包
 */
// 查询钱包信息
const queryUserWalletInfo = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/userWallet')
// 体现申请
const withdrawApply = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/withdrawApply')
// 查询提现记录
const queryWithdrawList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryWithdrawList')

/**
 * 设备故障
 */
// 故障设备列表
const queryFailureEquList = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryUsersFeedbackList')
// 故障详情
const queryFailureEquInfo = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/queryUsersFeedbackInfo')
// 提交故障处理
const postDealWithResult = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/postDealWithResult')

/**
 * 意见反馈
 */
const opinionFeedback = (params) => apiRequest.apiRequest(params, apiUrl + '/gzh/opinionFeedback')

export default {
  login,
  queryUserInfo,
  queryChargeList,
  queryDevicesList,
  queryDevicesDetails,
  upDateDevicesDetails,
  applicationEquiment,
  queryDeviceApplyList,
  applicationOwner,
  queryOrderList,
  queryApplyList,
  cancelUserApply,
  queryBsInfo,
  updateBsInfo,
  checkSn,
  turnOn,
  turnOff,
  checkUserControlStatus,
  queryDeviceStatus,
  signature,
  deviceFeedback,
  uploadProfile,
  queryUserWalletInfo,
  withdrawApply,
  queryWithdrawList,
  queryFailureEquList,
  queryFailureEquInfo,
  postDealWithResult,
  opinionFeedback
}
