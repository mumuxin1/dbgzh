/**
 * localstroage
 * @method STROAGE
 */
export const STROAGE = (item) => {
  if (!window.localStorage) {
    console.log('当前浏览器不支持localStroage')
  } else {
    switch (item.type) {
      case 'setItem':
        try {
          if (typeof item.item === 'object') {
            item.item = JSON.stringify(item.item)
          }
          window.localStorage.setItem(item.key, item.item)
        } catch (err) {
          console.log(err, 'localStroage---JSON格式错误')
        }
        break
      case 'getItem':
        try {
          return window.localStorage.getItem(item.key)
        } catch (err) {
          console.log(err, 'localStroage---key格式错误')
        }
        break
      case 'removeItem':
        try {
          window.localStorage.removeItem(item.key)
        } catch (err) {
          console.log(err, 'localStroage---key格式错误')
        }
        break
      case 'clear':
        window.localStorage.clear()
        break
      default:
        console.log('localStroage---type格式错误')
        break
    }
  }
}
/**
 * 判断设备类型 EQUIPMENT_TYPE
 * @method NAVIGATOR
 */
export const NAVIGATOR = () => {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return 'Wechat'
  } else {
    var u = window.navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      return 'Android'
    } else if (u.indexOf('iPhone') > -1 || u.indexOf('iPad') > -1) {
      return 'IOS'
    } else {
      return 'NULL'
    }
  }
}
/**
 * 时间戳转时间格式
 * @method timeFormat
 */
export const timeFormat = (t, sign, type) => {
  let date = new Date(t)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
  m = m > 10 ? m : '0' + m
  let str
  switch (type) {
    case 'yyyy-mm-dd':
      str = `${y}${sign}${m}${sign}${d}`
      break
    case 'yyyy-mm':
      str = `${y}${sign}${m}`
      break
    case 'mm-dd':
      str = `$${m}${sign}${d}`
      break
    default:
      break
  }
  return str
}
