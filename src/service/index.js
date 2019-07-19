import http2 from '@/utils/http2'
import ENV from '@/ENV'

//账号密码登录
export function login({ password, account }) {
  return http2.post(`${ENV.API_DOMAIN}/web/login`, { password, account, systemCode: '<%systemCode%>' }, true, true);
}

//退出登录
export function logout() {
  return http2.delete(`${ENV.API_DOMAIN}/api/user`, {}, false);
}

//获取用户信息
export function getUserInfo() {
  return http2.get(`${ENV.API_DOMAIN}/api/user`, { systemCode: '<%systemCode%>' }, true, true);
}

//修改个人姓名、头像
export function editUserData(params) {
  return http2.put(`${ENV.API_DOMAIN}/api/user/info`, params, false);
}

//修改密码
export function editUserPassword(params) {
  return http2.put(`${ENV.API_DOMAIN}/api/user/new_password`, params, true, true);
}

//客户端带过来的token登录
export function loginWithToken(params) {
  //return http2.get(`/web/pc/check`, params, false);
}

//文件上传token获取
export function getUploadToken(type) {
  const TYPE_MAP = {
    "RESOURCE": 1,
    "IMAGE": 2,
    "VIDEO": 3
  }
  return http2.get(`${ENV.API_DOMAIN}/api/oss/policy/${TYPE_MAP[type]}`, {}, false);
}


