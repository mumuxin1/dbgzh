import {
  STROAGE
} from '@/utils/muxin'
import vim from '../main.js'

const webSocket = () => {
  let protocol = (window.location.protocol == 'http:') ? 'ws:' : 'wss:';
  let userInfo = STROAGE({
    type: 'getItem',
    key: 'UserInfo'
  })
  let timer = null, url, n = 0
  if (userInfo) {
    userInfo = JSON.parse(userInfo).userInfo
    let userId = userInfo.id
    url = `//47.112.22.47:8082/shared-admin/websocket?userid=${userId}`
    // url = `//192.168.1.132:8088/shared-admin/websocket?userid=${userId}`
  }
  let host = protocol + url;
  
  window.WebSocket = window.WebSocket || window.MozWebSocket
  if (!window.WebSocket) { // 检测浏览器支持  
    this.error('Error: WebSocket is not supported .');
    return;
  }
  try {
    let socket = new WebSocket(host)
    socket.onopen = function (e) {
      console.log('websocket连接已打开')
      clearInterval(timer)
      timer = null
    };
    socket.onmessage = function (message) {
      console.log('websocke消息', message)
    };
    socket.onclose = function () {
      // socket = null; // 清理 
      console.log('websocket连接已关闭')
      console.dir(vim.$children[0].webSocket)
      // socket = null
      // socket = new WebSocket(host)
      if (!timer) {
        timer = setInterval(() => {
          if (n > 55) {
            console.log(n)
            // timer = null
            clearInterval(timer)
          }
          // socket = null
          socket = new WebSocket(host)
          n++
        }, 3000);
      }
    };
    socket.onerror = function (errorMsg) {
      console.log(errorMsg)
    }

    return socket
  } catch (err) {
    return err
  }
}
export default webSocket