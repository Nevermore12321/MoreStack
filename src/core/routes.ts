import { RouteObject, useRoutes } from 'react-router-dom';
import AuthRoutes from '@pages/auth/Routes';

const RootRoutes: RouteObject[] = [];

RootRoutes.push(AuthRoutes);
console.log(RootRoutes);

function Router() {
  console.log(useRoutes(RootRoutes));
  return useRoutes(RootRoutes);
}

export default Router;
