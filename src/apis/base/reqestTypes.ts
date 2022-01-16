export interface ExtendOperationsDef {
  otherName: string; // 额外操作名称，
  otherKey: string; // 额外操作key，也就是 base url
  method?: string; // 额外操作的 method
  isDetail?: boolean; // 额外操作是否是获取详情, 如果是，需要 dept/deptid/user; 如果不是，需要 dept/user
  generateFunc?: (url: string, data?: object, params?: object, conf?: object) => void; //  额外操作的具体请求实现
}

export interface ResourcesDef {
  name: string; //  资源名称，也就是获取的数据，例如 user
  key: string; //  资源key，也就是 base url
  responseKey: string; //  相应的 key
  subResources?: ResourcesDef[]; // 在父资源下的资源类型，也就是 父资源/子资源
  extendOperations?: ExtendOperationsDef[]; // 额外操作
}

export interface AllResourceDef {
  [index: string]: BaseResourceReqDef;
}

export interface BaseResourceReqDef {
  list?: (params?: object, conf?: object) => void;
  listDetail?: (params?: object, conf?: object) => void;
  show?: (id: string, params?: object, conf?: object) => void;
  create?: (data: object, params?: object, conf?: object) => void;
  update?: (id: string, data: object, params?: object, conf?: object) => void;
  patch?: (id: string, data: object, params?: object, conf?: object) => void;
  delete?: (id: string, params?: object, conf?: object) => void;
  head?: (id: string, params?: object, conf?: object) => void;
  responseKey?: string;
  extend?: {
    [name: string]: (url: string, data?: object, params?: object, conf?: object) => void;
  };
  subs?: {
    [name: string]: BaseSubResourceReqDef;
  };
}

export interface BaseSubResourceReqDef {
  list: (id: string, params?: object, conf?: object) => void;
  listDetail: (id: string, params?: object, conf?: object) => void;
  show: (id: string, subId: string, params?: object, conf?: object) => void;
  create: (id: string, data: object, params?: object, conf?: object) => void;
  update: (id: string, subId: string, data: object, params?: object, conf?: object) => void;
  patch: (id: string, subId: string, data: object, params?: object, conf?: object) => void;
  delete: (id: string, subId: string, params?: object, conf?: object) => void;
  head: (id: string, subId: string, params?: object, conf?: object) => void;
  responseKey: string;
  subs: {
    [name: string]: BaseSubSonResourceReqDef;
  };
}

export interface BaseSubSonResourceReqDef {
  list: (id: string, subId: string, params?: object, conf?: object) => void;
  listDetail: (id: string, subId: string, params?: object, conf?: object) => void;
  show: (id: string, subId: string, subSonId: string, params?: object, conf?: object) => void;
  create: (id: string, subId: string, data: object, params?: object, conf?: object) => void;
  update: (id: string, subId: string, subSonId: string, data: object, params?: object, conf?: object) => void;
  patch: (id: string, subId: string, subSonId: string, data: object, params?: object, conf?: object) => void;
  delete: (id: string, subId: string, subSonId: string, params?: object, conf?: object) => void;
  head: (id: string, subId: string, subSonId: string, params?: object, conf?: object) => void;
  responseKey: string;
}

export interface ListDef {
  (params?: object, conf?: object): void;
}
