/**
 * @file http2.js
 * @author zhaowenhao
 *
 * http请求发送工具类。
 *
 */
import { Loading, MessageBox } from '@dbj-fe/element-ui'
import fetch from 'isomorphic-fetch'
import * as util from './util'
import Bus from "../Bus"

export default class http2 {
  static get(url, options = {}, noloading = false, noAutoError = false) {
    return makeAPromise(url, util.parseQuerystring(options), 'GET', noloading, noAutoError);
  }

  static post(url, options = {}, noloading = false, noAutoError = false, notJson = false) {
    return makeAPromise(url, notJson ? util.parseQuerystring(options) : JSON.stringify(options), 'POST', noloading, noAutoError, notJson);
  }

  static delete(url, options = {}, noloading = false, noAutoError = false, notJson = false) {
    return makeAPromise(url, notJson ? util.parseQuerystring(options) : JSON.stringify(options), 'DELETE', noloading, noAutoError, notJson);
  }

  static put(url, options = {}, noloading = false, noAutoError = false, notJson = false) {
    return makeAPromise(url, notJson ? util.parseQuerystring(options) : JSON.stringify(options), 'PUT', noloading, noAutoError, notJson);
  }
}

function handleResult(data, status, resolve, reject, noAutoError) {
  let errMsg = "";
  if (status === 200) {
    resolve(data);
  } else if (status === 400) {
    errMsg = "请求参数错误";
  } else if (status === 401) {
    errMsg = "没有登录或登录已失效";
  } else if (status === 403) {
    errMsg = "没有权限";
  } else if (status === 404) {
    errMsg = "数据不存在！";
  } else if (status === 405) {
    errMsg = "请求方法错误！";
  } else if (status === 409) {
    errMsg = "数据冲突，刷新后重试！";
  } else if (status === 415) {
    errMsg = "不支持的媒体类型"
  } else if (status >= 500) {
    errMsg = "程序异常，请稍候重试！";
  } else {
    resolve(data);
  }
  if (errMsg) {
    data.then(d => {
      if (!noAutoError) {
        showError((d && d.message) || errMsg);
      }
      reject([d, status]);
    }).catch(e => {
      if (!noAutoError) {
        showError(errMsg);
      }
      reject([{ message: errMsg }, status]);
    });
  }
}

let errorIsShow = false;
let loading = null;
let timeoutClose = null;
let timeoutFinished = null;
let requestingList = [];

function createLoading(url) {
  requestingList.push(url);
  let timeoutShow = null;
  if (!loading) {
    timeoutShow = setTimeout(function () {
      if (requestingList.length > 0 && !loading) {
        loading = Loading.service({ fullscreen: false, text: '数据加载中，请稍候...' })
      }
    }, 300);
  }
  if (timeoutClose) {
    clearTimeout(timeoutClose);
    timeoutClose = null;
  }
  if (timeoutFinished) {
    clearTimeout(timeoutFinished);
    timeoutFinished = null;
  }
  return function () {
    if (timeoutShow) {
      clearTimeout(timeoutShow);
      timeoutShow = null;
    }
    if (requestingList.indexOf(url) > -1) {
      requestingList.splice(requestingList.indexOf(url), 1);
    }
    if (requestingList.length === 0) {
      timeoutFinished = setTimeout(function () {
        Bus.$emit('request-finished');
        timeoutFinished = null;
      }, 100);
      timeoutClose = setTimeout(function () {
        if (requestingList.length === 0 && loading) {
          loading.close();
          loading = null;
        }
      }, 30);
    }
  }
}

function showError(message) {
  if (!errorIsShow) {
    errorIsShow = true;
    MessageBox.alert(message, "系统提示", {
      "type": "error",
      "callback": () => {
        errorIsShow = false;
      },
      "confirmButtonText": "关闭"
    });
  }
}

//处理请求url和参数不同时，不重复发送请求
//请求中的请求列表2
let requestingList2 = [];
/**
 * 查找对应的request的下标
 */
function getRequestIndex(url, body, method) {
  let index = -1;
  requestingList2.some((req, idx) => {
    if (req.url === url && req.body === body && req.method === method) {
      index = idx;
      return true;
    }
    return false;
  })
  return index;
}
/**
 * 弹出对应的request，并返回该request
 */
function popRequest(url, body, method) {
  let index = getRequestIndex(url, body, method);
  if (method === 'GET') {
    return index > -1 ? requestingList2.splice(index, 1)[0] : null;
  } else {
    setTimeout(() => {
      //延迟300ms清除请求
      let idx = getRequestIndex(url, body, method);
      if (idx > -1) {
        requestingList2.splice(idx, 1);
      }
    }, 300);
    return index > -1 ? requestingList2[index] : null;
  }
}
/**
 * 创建一个promise实例
 */
function makeAPromise(url, body, method, noloading, noAutoError, notJson) {
  return new Promise((resolve, reject) => {
    let index = getRequestIndex(url, body, method);
    if (index > -1) {
      let request = requestingList2[index];
      if (method === 'GET') {
        //get请求合并
        request.handlers.push({
          resolve: resolve,
          reject: reject
        })
      } else {
        //其他请求直接reject
        reject([{
          code: "REPEAT_REQUEST",
          message: "重复请求"
        }, 400])
      }
    } else {
      requestingList2.push({
        url: url,
        body: body,
        method: method,
        noloading: noloading,
        noAutoError: noAutoError,
        handlers: [{
          resolve: resolve,
          reject: reject
        }]
      });
      doRequest(url, body, method, noloading, notJson);
    }
  })
}

/**
 * 执行请求
*/
function doRequest(url, body, method, noloading, notJson) {
  let closeLoading = () => { };
  if (!noloading) {
    closeLoading = createLoading(url);
  }
  let url2 = url;
  let params = {
    credentials: 'include',
    method: method,
    headers: {
      "Content-Type": notJson ? "application/x-www-form-urlencoded; charset=utf-8" : "application/json",
      "Accept": "application/json"
    }
  };
  if (/^(http|https):\/\//.test(url2)) {
    params.mode = 'cors';
  }
  if (method === 'GET') {
    url2 = url.indexOf('?') > 0 ?
      encodeURI(url) + '&'
      :
      encodeURI(url) + '?';
    if (body) {
      url2 += body + `&b${new Date().getTime()}=1`;
    } else {
      url2 += `b${new Date().getTime()}=1`;
    }
  } else {
    params.body = body
  }
  fetch(url2, params).then((response) => {
    closeLoading();
    let request = popRequest(url, body, method);
    let data = null;
    try {
      data = response.json();
    } catch (e) {
    }
    if (request && request.handlers) {
      request.handlers.forEach((handler) => {
        handleResult(data, response.status, handler.resolve, handler.reject, request.noAutoError);
      })
    } else {
      console && console.error('http request error:Can not find the request or handlers');
    }
  }).catch((error) => {
    closeLoading();
    let request = popRequest(url, body, method);
    if (request && request.handlers) {
      request.handlers.forEach((handler) => {
        if (request.noAutoError) {
          handler.reject([{ code: "UNKOWN_ERROR", message: "程序异常，请稍候重试！" }, 403]);
        } else {
          showError("程序异常，请稍候重试！");
        }
      })
    } else {
      console && console.error('http request error:Can not find the request or handlers');
    }
  })
}
