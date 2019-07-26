const webSocket = (url) => {
  let protocol = (window.location.protocol == 'http:') ? 'ws:' : 'wss:';
  let host = protocol + url;
  window.WebSocket = window.WebSocket || window.MozWebSocket
  if(!window.WebSocket) { // 检测浏览器支持  
    this.error('Error: WebSocket is not supported .');
    return;
  }
  try {
    let socket = new WebSocket(host)
  socket.onopen = function(e) {
    console.log('websocket连接已打开')

  };
  socket.onmessage = function(message) {
    console.log('websocke消息', message)
  };
  socket.onclose = function() {
    socket = null; // 清理 
    console.log('websocket连接已关闭')
    
  };
  socket.onerror = function(errorMsg) {
  }
  
  return socket
  } catch (err) {
    return err
  }
}
export default webSocket