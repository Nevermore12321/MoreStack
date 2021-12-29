import { lazy } from 'react';
import BlankBaseLayout from '@layouts/BlankBase';
import { RoutesDef } from '@utils/routeRender';

// Dynamic load routing
const Auth = lazy(() => import('@layouts/Auth'));

const rootRoutes: RoutesDef[] = [
  {
    component: BlankBaseLayout,
    routes: [
      {
        path: '/',
        redirect: { from: '/', to: '/base/overview' },
      },
      {
        path: '/login',
        redirect: { from: '/login', to: '/auth/login' },
      },
      {
        path: '/auth',
        component: Auth,
      },
    ],
  },
];

export default rootRoutes;
