/**
 * Created by Administrator on 2017/8/10.
 */

import axios from 'axios'
import Qs from 'qs'
import queryString from 'query-string';
import { notification, message } from 'antd';

var localConfig = {
  isMock : false,
  isDev: true,
  apiHost: "http://219.135.175.232:8084/dev/api/yinuo-member-admin/",
}
var testConfig = {
  isMock : false,
  apiHost: "http://219.135.175.232:8084/dev/api/yinuo-member-admin/",
}
var publishConfig = {
  isMock : false,
  // apiHost: "http://219.135.175.232:8086/test/api/yinuo-member-admin/",  
  apiHost: "http://memberadmin-test.yinuo.local/api/",
}

var API = {
  config: localConfig
}
if(__DEV__) {
  API.config = localConfig;
} else if(__test__) {
  API.config = testConfig;
} else if(__dist__) {
  API.config = publishConfig;
}


var instance = axios.create({
  baseURL: API.config.isMock ? 'http://localhost:3001/yinuo-member-admin/' : API.config.apiHost,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  transformRequest: [function (data) {
    // 对 data 进行任意转换处理
    let ret = '';
    if(data) {
      ret = queryString.stringify(data)
      return ret;
    }
  }],
});
// 全局登录拦截拦截
instance.interceptors.response.use(
  response => {
    if (response.data.code == 20100) {
      if( location.href.indexOf('login.html') > 0) {
        return response.data
      }
      sessionStorage.setItem('gotoBeforeUrl', location.href);
      location.href = './login.html'
      return
    }
    sessionStorage.removeItem('gotoBeforeUrl')
    if(response.data.code !== 0) {
      message.error(response.data.errorMsg);
    }
    return response.data
  },error => {
      notification['error']({
        message: '网络请求失败，请重试',
        description: '',
        key: 'response_error',
        duration: 2
      })
    return Promise.reject(error);
  });

const AppService = {
  getRequest: (url, data) => {
    return instance.get(url,data ?　{params: data}: {})
  },
  postRequest: (url,data) => {
    // if(data) {
    //   url = url + '?' + queryString.stringify(data)
    // }
    // data = data ?  queryString.stringify(data) : null
    return instance.post(url, data)
  },
  putRequest: (url, data) => {
    if(data) {
      url = url + '?' + queryString.stringify(data)
    }
    // data = data ? queryString.stringify(data) : null
    return instance.put(url)
  },
  deleteRequest: (url, data) => {
    return instance.delete(url, data ? {params: data} : {})
  },
  patchRequest: (url, data) => {
    if(data) {
      url = url + '?' + queryString.stringify(data)
    }
    return instance.patch(url,data)
  }
}

AppService.uploadFile = API.config.apiHost + 'base/upload/uploadimage'
// AppService.uploadImgUrl = API.config.apiHost + 'base/upload/uploadimage'
AppService.codeUrl = API.config.apiHost + 'base/verification_code/get_image?'
AppService.apiHost = API.config.apiHost
export default AppService
