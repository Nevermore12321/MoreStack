import httpRequest from '@/apis/base/request';

export interface ExtendOperationsDef {
  subName: string; // 额外操作名称，
  subKey: string; // 额外操作key，也就是 base url
  method?: string; // 额外操作的 method
  isDetail?: boolean; // 额外操作是否是获取详情, 如果是，需要 dept/deptid/user; 如果不是，需要 dept/user
  generateFunc?: (url: string, data: object, params: object, conf: object) => void; //  额外操作的具体请求实现
}

export interface ResourcesDef {
  name: string; //  资源名称，也就是获取的数据，例如 user
  key: string; //  资源key，也就是 base url
  responseKey: string; //  相应的 key
  subResources?: ResourcesDef[]; // 在父资源下的资源类型，也就是 父资源/子资源
  isResource?: boolean; // 是否是 资源类型
  extendOperations?: ExtendOperationsDef[]; // 额外操作
}

interface BaseRequestDef {
  [requestName: string]: any;
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

  // 获取 具体 resource 的 detail 详细信息
  // 类似 用户 gsh 的详细信息为： /user/userid 或者 /user/userName
  public getDetailUrl = (id: string, resourceName: string) => {
    if (resourceName[resourceName.length - 1] === '/')
      return `${resourceName.substring(0, resourceName.length - 1)}/${id}`;
    return `${resourceName}/${id}`;
  };

  getSubResourceUrl(resourceName: string, subResourceName: string) {
    if (resourceName[resourceName.length - 1] === '/') {
      return `${resourceName}${subResourceName}`;
    }
    return `${resourceName}/${subResourceName}`;
  }

  //  获取 resource 下的子 resource 的url
  // 例如 部门下的用户 ，dept/deptid/users
  public getSubResourceUrlById(id: string, resourceName: string, subResourceName: string) {
    if (typeof subResourceName === 'undefined') {
      return this.getDetailUrl(resourceName, id);
    }
    return `${this.getDetailUrl(resourceName, id)}/${subResourceName}`;
  }

  // 根据baseurl 与 resource key 生成 url
  public getUrl = (url: string) => (url ? `${this.baseUrl}/${url}` : `${this.baseUrl}`);

  //  将 httpRequest 中的 每个 method 包装一层，隐藏 url
  get request() {
    const allMethodReq: {
      [queryName: string]: (url: string, data?: object, params?: object, conf?: object) => void;
    } = {
      get: (url: string, data = {}, params = {}, conf = {}) =>
        this.originHttpRequest.get(this.getUrl(url), params, conf),
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
    return allMethodReq;
  }

  /**
   * generate resource api http request for all method by resourceKey
   * @param resourceName resource name
   * @param resourceKey request url
   * @param responseKey need response key name
   * @returns {} wrapped all methods of http requests for resource
   */
  private genResource = (resourceName: string, resourceKey: string, responseKey: string) => {
    interface QueryFunc {
      (params: object, conf: object): void;
    }

    // resourceKey 用来添加 url
    const resourceUrl: string = resourceKey;
    const resourceReq: { [name: string]: any } = {
      list: (params = {}, conf = {}) => this.request.get(resourceUrl, undefined, params, conf),
      listDetail: (params = {}, conf = {}) => this.request.get(`${resourceUrl}/detail`, undefined, params, conf),
      show: (id: string, params = {}, conf = {}) =>
        this.request.get(this.getDetailUrl(id, resourceName), undefined, params, conf),
      create: (data = {}, params = {}, conf = {}) => this.request.post(resourceUrl, data, params, conf),
      // update: (id:number, data={}, params = {}, conf={}) =>
      //   this.request.put(this.getDetailUrl(resourceName, id), data, conf),
      // patch: (id, data, ...args) =>
      //   this.request.patch(this.getDetailUrl(resourceName, id), data, ...args),
      // delete: (id, ...args) =>
      //   this.request.delete(this.getDetailUrl(resourceName, id), ...args),
      // head: (id, ...args) =>
      //   this.request.head(this.getDetailUrl(resourceName, id), ...args),
      responseKey,
    };
    return resourceReq;
  };

  private genAllResource = () => {
    this.resources.forEach((resource: ResourcesDef) => {
      const { name, key, responseKey, subResources = [], isResource = true, extendOperations = [] } = resource;
      // 生成 获取 resource 的所有 request 接口，例如 get=>list create=>post ...
      const result: BaseRequestDef = isResource ? this.genResource(name, key, responseKey) : {};
      // extendOperations 表示常用的这些操作外，还有什么具体的 request 请求
      extendOperations.forEach((operation: ExtendOperationsDef) => {
        const { subKey, subName, method = 'get', isDetail, generateFunc } = operation;

        const subIsDetail = !!isDetail;
        if (generateFunc) {
          //  这里是 定义好的 request 函数
          result[subName] = generateFunc;
        } else if (subIsDetail) {
          //  获取 详情页的 子资源 的 request 函数
          result[subName] = (id: string, ...args: object[]) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            this.request[method.toLowerCase()](this.getSubResourceUrlById(id, name, subName), ...args);
        } else {
          //  获取 子资源的 request 函数
          result[subName] = (...args: object[]) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            this.request[method.toLowerCase()](this.getSubResourceUrl(name, subName), ...args);
        }
      });
      //  subResource 表示 资源下的子资源，url 有嵌套关系，例如 部门/用户
      subResources.forEach((subResource) => {
        const { name: sub } = subResource;
      });
    });
  };
}
