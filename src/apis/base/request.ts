import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import qs from 'qs';
import { getLocalStorageItem } from '@utils/localStorage';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];

interface RequestDef {
  [index: string]: (url: string, data?: object, params?: object, options?: object) => void;
}

/* *
 * @class AxiosHttpRequest
 * request with axios
 */
export class AxiosHttpRequest {
  public request: RequestDef;

  constructor() {
    this.request = {};
  }

  /**
   * create a new instance of axios with a custom config
   */
  private createAxios = () => {
    const conf: AxiosRequestConfig = {
      baseURL: '/',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
    };
    return Axios.create(conf);
  };

  /**
   * Axios interceptors includes request & response
   * @param axiosIns instance of axios
   * @returns {void}
   */
  private intercept = (axiosIns: AxiosInstance) => {
    axiosIns.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // todo set all common header
        if (!config?.headers) {
          config.headers = {};
        }
        const keystoneToken = getLocalStorageItem('keystone_token') || '';
        if (keystoneToken) {
          config.headers['X-Auth-Token'] = keystoneToken;
        }
        return config;
      },
      (err: AxiosError) => Promise.reject(err)
    );
    axiosIns.interceptors.response.use(
      (res: AxiosResponse) => {
        if (res.status < 200 || res.status >= 300) {
          return Promise.reject(res.data);
        }
        return Promise.resolve(res.data);
      },
      (err: AxiosError) => {
        console.log('error.response', err.response, err);
        if (err.response) {
          if (err.response.status === 401) {
            const currentPath: string = window.location.pathname;
            if (currentPath.indexOf('login') < 0) {
              // todo go to login page
            }
          }
        }
        return Promise.reject(err);
      }
    );
  };

  /**
   * build request
   * @param {AxiosRequestConfig} reqConfig requests config
   * @returns {Promise} axios instance return promise
   */
  private genRequest = (reqConfig: AxiosRequestConfig) => {
    const method: string = reqConfig.method ? reqConfig.method.toLowerCase() : 'get';
    const options = { ...reqConfig };
    if (reqConfig.params && ['get', 'head'].includes(method)) {
      // parse params to object
      // 将 params 中的无用的 参数去掉
      if (typeof options.params === 'object') {
        interface ParamDef {
          [paramName: string]: string;
        }
        const tmp = options.params as ParamDef;
        options.params = Object.keys(options.params as object).reduce<ParamDef>((acc: ParamDef, curValue: string) => {
          if (tmp[curValue] !== undefined && tmp[curValue] != null && tmp[curValue] !== '') {
            acc[curValue] = tmp[curValue];
          }
          return acc;
        }, {}) as object;
      }
      // 设置 param 的序列化格式
      // repeat => 'a=b&a=c'
      // comma => 'a=b,c'
      // brackets => 'a[]=b&a[]=c'
      // indices => 'a[0]=b&a[1]=c'
      options.paramsSerializer = (p) => qs.stringify(p, { arrayFormat: 'repeat' });
    }
    const instance = this.createAxios();
    this.intercept(instance);
    return instance(reqConfig);
  };

  public genReqMap = () => {
    METHODS.forEach((method: string) => {
      const standardMethod: Method = method.toLowerCase() as Method;
      if (standardMethod === 'get' || standardMethod === 'head') {
        this.request[standardMethod] = (url: string, params = {}, options = {}) =>
          this.genRequest({
            method: standardMethod,
            url,
            params,
            ...options,
          });
      } else {
        this.request[standardMethod] = (url: string, data = {}, params = {}, options = {}) =>
          this.genRequest({
            method: standardMethod,
            url,
            data,
            params,
            ...options,
          });
      }
    });
  };
}

const httpRequest = new AxiosHttpRequest();
httpRequest.genReqMap();
export default httpRequest;
