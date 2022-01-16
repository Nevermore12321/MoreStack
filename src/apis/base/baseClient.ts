import httpRequest from '@/apis/base/request';
import {
  ExtendOperationsDef,
  ResourcesDef,
  BaseResourceReqDef,
  BaseSubResourceReqDef,
  BaseSubSonResourceReqDef,
  AllResourceDef,
} from './reqestTypes';

/* *
 * @class BaseClient
 * API base Client wrapped all resource apis
 */
export default class BaseClient {
  public allResources: AllResourceDef = {};

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
    return '' as string;
  }

  // ==========url 的 拼接============

  // 获取 具体 resource 的 detail 详细信息
  // 类似 用户 gsh 的详细信息为： /user/userid 或者 /user/userName
  public getDetailUrl = (id: string, resourceKey: string) => {
    if (resourceKey[resourceKey.length - 1] === '/') return `${resourceKey.substring(0, resourceKey.length - 1)}/${id}`;
    return `${resourceKey}/${id}`;
  };

  //  获取 resource 下的子 resource 的url
  // 例如 部门下的用户 ，dept/deptid/users
  getSubResourceUrl(resourceKey: string, subResourceKey: string) {
    if (resourceKey[resourceKey.length - 1] === '/') {
      return `${resourceKey}${subResourceKey}`;
    }
    return `${resourceKey}/${subResourceKey}`;
  }

  //  获取 resource 下的子 resource 的url
  // 例如 部门下的用户 ，dept/deptid/users
  public getSubResourceUrlById(id: string, resourceKey: string, subResourceKey: string) {
    if (typeof subResourceKey === 'undefined') {
      return this.getDetailUrl(resourceKey, id);
    }
    return `${this.getDetailUrl(resourceKey, id)}/${subResourceKey}`;
  }

  // 获取某个具体 resource 对象下的具体的某个子resource 对象
  //  例如研发部门的张三用户，dept/yanfaID/user/zhangsanID
  public getSubResourceUrlBySubId(resourceKey: string, subResourceKey: string, id: string, subId: string) {
    return `${this.getSubResourceUrlById(resourceKey, subResourceKey, id)}/${subId}`;
  }

  //  获取 孙resource 的 url
  // 例如研发部门张三的虚拟机，dept/yanfaId/user/zhangsanId/vm
  public getSubSonResourceUrlById(
    id: string,
    subId: string,
    resourceKey: string,
    subResourceKey: string,
    subSonResourceKey: string
  ) {
    if (typeof subSonResourceKey === 'undefined') {
      return this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId);
    }
    return `${this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId)}/${subSonResourceKey}`;
  }

  //  获取 孙resource 的 url
  // 例如研发部门张三的虚拟机，dept/yanfaId/user/zhangsanId/vm/vmid
  public getSubSonResourceUrlBySonId(
    id: string,
    subId: string,
    subSonId: string,
    resourceKey: string,
    subResourceKey: string,
    subSonResourceKey: string
  ) {
    return `${this.getSubSonResourceUrlById(id, subId, resourceKey, subResourceKey, subSonResourceKey)}/${subSonId}`;
  }

  // 根据baseurl 与 resource key 生成 url
  public getUrl = (url: string) => (url ? `${this.baseUrl}/${url}` : `${this.baseUrl}`);

  //  将 httpRequest 中的 每个 method 包装一层，隐藏 url
  get request() {
    const allMethodReq: {
      [queryName: string]: (url: string, data?: object, params?: object, conf?: object) => void;
    } = {
      get: (url: string, data = {}, params = {}, conf = {}) =>
        this.originHttpRequest.get(this.getUrl(url), data, params, conf),
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

  //  ========Resource 的生成========

  /**
   * generate resource api http request for all method by resourceKey
   * @param resourceKey resource name
   * @param resourceKey request url
   * @param responseKey need response key name
   * @returns {} wrapped all methods of http requests for resource
   */
  private genResource(resourceKey: string, responseKey: string): BaseResourceReqDef {
    // resourceKey 用来添加 url
    const resourceUrl: string = resourceKey;
    const resourceReq: BaseResourceReqDef = {
      list: (params = {}, conf = {}) => this.request.get(resourceUrl, undefined, params, conf),
      listDetail: (params = {}, conf = {}) => this.request.get(`${resourceUrl}/detail`, undefined, params, conf),
      show: (id: string, params = {}, conf = {}) =>
        this.request.get(this.getDetailUrl(id, resourceKey), undefined, params, conf),
      create: (data = {}, params = {}, conf = {}) => this.request.post(resourceUrl, data, params, conf),
      update: (id: string, data: object, params = {}, conf = {}) =>
        this.request.put(this.getDetailUrl(resourceKey, id), data, params, conf),
      patch: (id: string, data: object, params = {}, conf = {}) =>
        this.request.patch(this.getDetailUrl(resourceKey, id), data, params, conf),
      delete: (id: string, params = {}, conf = {}) =>
        this.request.delete(this.getDetailUrl(resourceKey, id), undefined, params, conf),
      head: (id: string, params = {}, conf = {}) =>
        this.request.head(this.getDetailUrl(resourceKey, id), undefined, params, conf),
      responseKey,
      extend: {},
      subs: {},
    };
    return resourceReq;
  }

  /**
   * generate Sub Resource api http request for all method by resourceKey
   * @param resourceKey resource name
   * @param subResourceKey request url
   * @param responseKey need response key name
   * @returns {} wrapped all methods of http requests for resource
   */
  private genSubResource = (resourceKey: string, subResourceKey: string, responseKey: string) => {
    const subResourceReq: BaseSubResourceReqDef = {
      list: (id: string, params = {}, conf = {}) =>
        this.request.get(this.getSubResourceUrlById(resourceKey, subResourceKey, id), undefined, params, conf),
      listDetail: (id: string, params = {}, conf = {}) =>
        this.request.get(
          `${this.getSubResourceUrlById(resourceKey, subResourceKey, id)}/detail`,
          undefined,
          params,
          conf
        ),
      show: (id: string, subId, params = {}, conf = {}) =>
        this.request.get(
          this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId),
          undefined,
          params,
          conf
        ),
      create: (id: string, data: object, params = {}, conf = {}) =>
        this.request.post(this.getSubResourceUrlById(resourceKey, subResourceKey, id), data, params, conf),
      update: (id: string, subId: string, data: object, params = {}, conf = {}) =>
        this.request.put(this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId), data, params, conf),
      patch: (id: string, subId: string, data: object, params = {}, conf = {}) =>
        this.request.patch(this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId), data, params, conf),
      delete: (id: string, subId: string, params = {}, conf = {}) =>
        this.request.delete(
          this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId),
          undefined,
          params,
          conf
        ),
      head: (id: string, subId: string, params = {}, conf = {}) =>
        this.request.head(
          this.getSubResourceUrlBySubId(resourceKey, subResourceKey, id, subId),
          undefined,
          params,
          conf
        ),
      responseKey,
      subs: {},
    };
    return subResourceReq;
  };

  private genSubSonResource = (
    resourceKey: string,
    subResourceKey: string,
    subSonResourceKey: string,
    responseKey: string
  ) => {
    const subSonResourceReq: BaseSubSonResourceReqDef = {
      list: (id: string, subId: string, params = {}, conf = {}) =>
        this.request.get(
          this.getSubSonResourceUrlById(resourceKey, subResourceKey, subSonResourceKey, id, subId),
          undefined,
          params,
          conf
        ),
      listDetail: (id: string, subId: string, params = {}, conf = {}) =>
        this.request.get(
          `${this.getSubSonResourceUrlById(resourceKey, subResourceKey, subSonResourceKey, id, subId)}/detail`,
          undefined,
          params,
          conf
        ),

      show: (id: string, subId: string, subSubId: string, params = {}, conf = {}) =>
        this.request.get(
          this.getSubSonResourceUrlBySonId(id, subId, subSubId, resourceKey, subResourceKey, subSonResourceKey),
          undefined,
          params,
          conf
        ),
      create: (id: string, subId: string, data: object, params = {}, conf = {}) =>
        this.request.post(
          this.getSubSonResourceUrlById(resourceKey, subResourceKey, subSonResourceKey, id, subId),
          data,
          params,
          conf
        ),
      update: (id: string, subId: string, subSubId: string, data: object, params = {}, conf = {}) =>
        this.request.put(
          this.getSubSonResourceUrlBySonId(id, subId, subSubId, resourceKey, subResourceKey, subSonResourceKey),
          data,
          params,
          conf
        ),
      patch: (id: string, subId: string, subSubId: string, data: object, params = {}, conf = {}) =>
        this.request.patch(
          this.getSubSonResourceUrlBySonId(id, subId, subSubId, resourceKey, subResourceKey, subSonResourceKey),
          data,
          params,
          conf
        ),
      delete: (id: string, subId: string, subSubId: string, params = {}, conf = {}) =>
        this.request.delete(
          this.getSubSonResourceUrlById(resourceKey, subResourceKey, subSonResourceKey, id, subId),
          undefined,
          params,
          conf
        ),
      head: (id: string, subId: string, subSubId: string, params = {}, conf = {}) =>
        this.request.head(
          this.getSubSonResourceUrlBySonId(id, subId, subSubId, resourceKey, subResourceKey, subSonResourceKey),
          undefined,
          params,
          conf
        ),
      responseKey,
    };
    return subSonResourceReq;
  };

  private genAllResource = () => {
    this.resources.forEach((resource: ResourcesDef) => {
      const { name, key, responseKey, subResources = [], extendOperations = [] } = resource;
      // 生成 获取 resource 的所有 request 接口，例如 get=>list create=>post ...
      const result: BaseResourceReqDef = this.genResource(key, responseKey);
      // this.allResources = isResource ? this.genResource(key, responseKey) : {};
      // extendOperations 表示常用的这些操作外，还有什么具体的 request 请求
      extendOperations.forEach((operation: ExtendOperationsDef) => {
        const { otherKey, otherName, method = 'get', isDetail, generateFunc } = operation;

        const subIsDetail = !!isDetail;
        if (generateFunc) {
          //  这里是 定义好的 request 函数
          Object.defineProperty(result.extend, otherName, { value: generateFunc });
        } else if (subIsDetail) {
          //  获取 详情页的 子资源 的 request 函数
          Object.defineProperty(result.extend, otherName, {
            value: (id: string, args?: object) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
              this.request[method.toLowerCase()](this.getSubResourceUrlById(id, otherKey, otherName), args),
          });
        } else {
          //  获取 子资源的 request 函数
          Object.defineProperty(result.extend, otherName, {
            value: (args: object) => this.request[method.toLowerCase()](this.getSubResourceUrl(key, otherKey), args),
          });
        }
      });
      //  subResource 表示 资源下的子资源，url 有嵌套关系，例如 部门/用户
      //  最多嵌套两个 subResource /部门/用户/配额
      subResources.forEach((subResource) => {
        const {
          name: subName,
          key: subKey,
          responseKey: subResponseKey,
          subResources: subSubResources = [],
        } = subResource;

        const subResult: BaseSubResourceReqDef = this.genSubResource(key, subKey, subResponseKey);

        // 二级  子资源
        subSubResources.forEach((subSonRes) => {
          const { key: subSonKey, name: subSonName, responseKey: subSonResponseKey } = subSonRes;
          Object.defineProperty(subResult.subs, subSonName, {
            value: this.genSubSonResource(key, subKey, subSonKey, subSonResponseKey),
          });
          // subResult[subSonName] = this.genSubSonResource(key, subKey, subSonKey, subSonResponseKey);
        });
        Object.defineProperty(result.subs, subName, { value: subResult });
        // result[subName] = subResult;
      });
      // 将生成的各个资源的 request 请求，放到 baseClient 类的属性中
      Object.defineProperty(this.allResources, name, { value: result });
      // this[name] = result;
    });
  };
}
