import httpRequest from '@/apis/base/request';

export interface ExtendOperationsDef {
  otherName: string; // 额外操作名称，
  otherKey: string; // 额外操作key，也就是 base url
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

interface BaseResourceReqDef {
  list?: (params?: object, conf?: object) => void;
  listDetail?: (params?: object, conf?: object) => void;
  show?: (id: string, params?: object, conf?: object) => void;
  create?: (data: object, params?: object, conf?: object) => void;
  update?: (id: string, data: object, params?: object, conf?: object) => void;
  patch?: (id: string, data: object, args?: object) => void;
  delete?: (id: string, args?: object) => void;
  head?: (id: string, args?: object) => void;
  responseKey?: string;
  [name: string]: any;
}

interface ClientDef {
  [index: string]: any;
}

/* *
 * @class BaseClient
 * API base Client wrapped all resource apis
 */
export default class BaseClient implements ClientDef {
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
    // resourceKey 用来添加 url
    const resourceUrl: string = resourceKey;
    const resourceReq: BaseResourceReqDef = {
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

  private genSubResource = () => '';

  private genSubSubResource = () => '';

  private genAllResource = () => {
    this.resources.forEach((resource: ResourcesDef) => {
      const { name, key, responseKey, subResources = [], isResource = true, extendOperations = [] } = resource;
      // 生成 获取 resource 的所有 request 接口，例如 get=>list create=>post ...
      const result: BaseResourceReqDef = isResource ? this.genResource(name, key, responseKey) : {};
      // extendOperations 表示常用的这些操作外，还有什么具体的 request 请求
      extendOperations.forEach((operation: ExtendOperationsDef) => {
        const { otherKey, otherName, method = 'get', isDetail, generateFunc } = operation;

        const subIsDetail = !!isDetail;
        if (generateFunc) {
          //  这里是 定义好的 request 函数
          result[otherName] = generateFunc;
        } else if (subIsDetail) {
          //  获取 详情页的 子资源 的 request 函数
          result[otherName] = (id: string, args?: object) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            this.request[method.toLowerCase()](this.getSubResourceUrlById(id, name, otherName), args);
        } else {
          //  获取 子资源的 request 函数
          result[otherName] = (...args: object[]) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
            this.request[method.toLowerCase()](this.getSubResourceUrl(name, otherName), ...args);
        }
      });
      //  subResource 表示 资源下的子资源，url 有嵌套关系，例如 部门/用户
      //  最多嵌套两个 subResource /部门/用户/配额
      subResources.forEach((subResource) => {
        let subResult: BaseResourceReqDef;
        const {
          name: subName,
          key: subKey,
          responseKey: subResponseKey,
          subResources: subSubResources = [],
        } = subResource;
        subResult = this.genSubSubResource(key, subKey, subResponseKey);

        //  二级  子资源
        subSubResources.forEach((son) => {
          const { name: subSubName, key: subSubKey, responseKey: subSubResponseKey } = son;
          subResult[subSubName] = this.generateSubSonResource(key, subKey, subSubKey, subSubResponseKey);
        });
        result[subName] = subResult;
      });

      // 将生成的各个资源的 request 请求，放到 baseClient 类的属性中
      this[name] = result;
    });
  };
}
