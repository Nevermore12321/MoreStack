import BaseClient from '@apis/base/baseClient';
import { userBase } from '@apis/base/endpoints';
import { ResourcesDef } from '@apis/base/reqestTypes';

class UserClient extends BaseClient {
  get baseUrl() {
    return userBase;
  }

  get resources() {
    return [
      {
        name: 'catalog',
        key: 'auth/catalog',
        responseKey: 'catalog',
      },
      {
        name: 'projects',
        key: 'projects',
        responseKey: 'project',
        extendOperations: [
          {
            otherName: 'updateTags',
            otherKey: 'tags',
          },
        ],
        subResources: [
          {
            name: 'tags',
            key: 'tags',
            responseKey: 'tag',
          },
        ],
      },
    ] as ResourcesDef[];
  }
}

const userClient: UserClient = new UserClient();
export default userClient;
