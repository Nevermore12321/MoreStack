import httpRequest from '@/apis/base/request';

export interface ExtendOperationsDef {
  subName?: string;
  subKey?: string;
  method?: string;
}

export interface ResourcesDef {
  name?: string;
  key?: string;
  responseKey?: string;
  subResources?: ResourcesDef[];
  isResource?: boolean;
  extendOperations?: ExtendOperationsDef[];
}

/* *
 * @class BaseClient
 * API base Client wrapped all resource apis
 */
export default class BaseClient {
  constructor() {
    this.genAllResource();
  }

  //  拿到所有 http 不同 method 的请求方法
  get originHttpRequest() {
    const { request } = httpRequest;
    return request;
  }

  // 这里的 resource 也就是需要从后端获取的数据
  // 例如，获取用户列表，用户就是 resource
  get resources() {
    return [] as ResourcesDef[];
  }

  // 该 client 的 base url
  get baseUrl() {
    return '';
  }

  // 根据baseurl 与 resource key 生成 url
  public getUrl = (url: string) => (url ? `${this.baseUrl}/${url}` : `${this.baseUrl}`);

  //  将 httpRequest 中的 每个 method 包装一层，隐藏 url
  get request() {
    return {
      get: (url: string, params = {}, conf = {}) => this.originHttpRequest.get(this.getUrl(url), params, conf),
      post: (url: string, data = {}, params = {}, conf = {}) =>
        this.originHttpRequest.post(this.getUrl(url), data, params, conf),
      put: (url: string, data = {}, params = {}, conf = {}) =>
        this.originHttpRequest.put(this.getUrl(url), data, params, conf),
      delete: (url: string, data = {}, params = {}, conf = {}) =>
        this.originHttpRequest.delete(this.getUrl(url), data, params, conf),
      patch: (url: string, data = {}, params = {}, conf = {}) =>
        this.originHttpRequest.patch(this.getUrl(url), data, params, conf),
      head: (url: string, params = {}, conf = {}) => this.originHttpRequest.head(this.getUrl(url), params, conf),
    };
  }

  /**
   * generate resource api http request for all method by resourceKey
   * @param resourceKey request url
   * @param responseKey need response key name
   * @returns {} wrapped all methods of http requests for resource
   */
  private genResource = (resourceKey: string, responseKey: string) => {
    // resourceKey 用来添加 url
    const resourceUrl: string = resourceKey;
    return {
      list: (params = {}, conf = {}) => this.request.get(resourceUrl, params, conf),
      listDetail: (params = {}, conf = {}) => this.request.get(`${resourceUrl}/detail`, params, conf),
      // show: (id:number, params={}, conf={}) => {
      //   return this.request.get(
      //     this.getDetailUrl(resourceName, id),
      //     params,
      //     conf
      //   );
      // },
      // create: (data={}, conf={}) => this.request.post(resourceUrl, data, conf),
      // update: (id:number, data={}, conf={}) =>
      //   this.request.put(this.getDetailUrl(resourceName, id), data, conf),
      // patch: (id, data, ...args) =>
      //   this.request.patch(this.getDetailUrl(resourceName, id), data, ...args),
      // delete: (id, ...args) =>
      //   this.request.delete(this.getDetailUrl(resourceName, id), ...args),
      // head: (id, ...args) =>
      //   this.request.head(this.getDetailUrl(resourceName, id), ...args),
      responseKey,
    };
  };

  private genAllResource = () => {
    this.resources.forEach((resource: ResourcesDef) => {
      const { name, key, responseKey, subResources = [], isResource = true, extendOperations = [] } = resource;
      const result = isResource ? this.genResource(key as string, responseKey as string) : {};
    });
  };
}
