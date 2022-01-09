import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getLocalStorageItem } from '@utils/localStorage';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];

/* *
 * @class AxiosHttpRequest
 * request with axios
 */
export class AxiosHttpRequest {
  public request: any;

  constructor() {
    this.request = {};
  }

  /**
   * create a new instance of axios with a custom config
   */
  private static createAxios = () => {
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
   * @param url request url
   * @returns {void}
   */
  private static intercept = (axiosIns: AxiosInstance) => {
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
   * @param {RequestConfigDef} config requests config
   * @returns {Promise} axios instance return promise
   */
  private static buildRequest = (reqConfig: AxiosRequestConfig) => {
    const method: string = reqConfig.method ? reqConfig.method.toLowerCase() : 'get';
    if (reqConfig.params && ['get', 'head'].includes(method)) {
      // todo Only get and head, we need to use null for some posts requests
    }
    const instance = AxiosHttpRequest.createAxios();
    AxiosHttpRequest.intercept(instance);
    return instance(reqConfig);
  };
}
