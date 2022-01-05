import { lazy } from 'react';
import { LazyLoad } from '@components/Common/LazyLoad';
import AuthLayout from '@layouts/Auth';
import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('@pages/auth/views/Login'));
const PATH = '/auth';

const authRoutes: RouteObject = {
  path: PATH,
  caseSensitive: true,
  element: <AuthLayout />,
  children: [
    {
      caseSensitive: true,
      path: 'login',
      element: LazyLoad(<Login />),
    },
  ],
};

export default authRoutes;
