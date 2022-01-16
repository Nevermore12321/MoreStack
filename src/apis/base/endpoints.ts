interface EndpointVersionDef {
  [versionName: string]: string;
}
interface BaseEndpointDef {
  [endpintName: string]: string;
}

export const endpointVersionMap: EndpointVersionDef = {
  identityManagement: 'v1',
};

export const baseEndpointsMap: BaseEndpointDef = {
  userManagement: '/api/morestack/idm',
};

const getOriginEndpoint = (key: string) => {
  const version: string = endpointVersionMap[key];
  const baseEndpoint: string = baseEndpointsMap[key];
  return version ? `${baseEndpoint}/${version}` : baseEndpoint;
};

export const userBase: string = getOriginEndpoint('userManagement');
