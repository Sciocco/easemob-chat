'use strict';
import axios from 'axios';
import store from '../store/index';
import api from './api/api';

window.__axiosCancelTokenArr = [];
/**
 * 请求拦截器
 * 处理发送请求之前 header 插入 token 鉴权
 */
axios.interceptors.request.use(requestConfig => {
    let configs = requestConfig;
    if (store.getters.sessionToken) {
      configs.headers['X-Live-Session-Token'] = store.getters.sessionToken;
    }
    config.cancelToken = new axios.CancelToken(cancel => {
      window.__axiosCancelTokenArr.push({ cancel });
    });
    return configs;
},err => {
  return Promise.reject(err);
});

/**
 * 响应拦截器
 * 响应回调错误处理、数据处理等逻辑
 */
axios.interceptors.response.use(response => {
  let result = response.data;
  if (result.code === 7) {
    location.href = '/';
  } else if (result.code === 0) {
    return Promise.resolve(result.data);
  } else {
    vue.$message.error(result.msg);
    return Promise.reject(result);
  }
}, error => {
  return Promise.reject(error.response.data); // 返回接口返回的错误信息
});

const baseURL = '';
const defaults = {
  baseURL: baseURL,
  timeout: 100000,
  headers: {
    'X-Live-Session-Token': token,
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
};

Object.assign(axios.defaults, defaults);

// 登陆注册相关
export const userLogin = params => {
  return axios.post(api.login, params, {
    baseURL: baseURL
  });
};