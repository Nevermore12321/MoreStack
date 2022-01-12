interface EndpointVersionDef {
  [endpintName: string]: string;
}
interface BaseEndpointDef {
  [endpintName: string]: string;
}

export const endpointVersionMap: EndpointVersionDef = {
  identityManagement: 'v1',
};

export const endpointsDefault = {
  ironic: '/api/openstack/ironic',
  ironicInspector: '/api/openstack/ironic-inspector',
  octavia: '/api/openstack/octavia',
};

export const baseEndpointsMap: BaseEndpointDef = {
  identityManagement: '/api/idm',
};

const getOriginEndpoint = (key: string) => {
  const version: string = endpointVersionMap[key];
  const baseEndpoint: string = baseEndpointsMap[key];
  return version ? `${baseEndpoint}/${version}` : baseEndpoint;
};

export const userBase = () => getOriginEndpoint('identityManagement');
