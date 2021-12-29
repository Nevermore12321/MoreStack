import React from 'react';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import exp from 'constants';

interface RedirectDef {
  from: string;
  to: string;
}

export interface RoutesDef {
  component?: React.FC;
  redirect?: RedirectDef;
  path?: string;
  routes?: RoutesDef[];
  key?: string;
}
const renderRoutes = (routes: RoutesDef[], extraProps = {}, RoutesProps = {}) => {
  if (routes) {
    return (
      <Routes {...RoutesProps}>
        {routes.map((route, i) => {
          const key: string = route.key || String(i);
          if (route.redirect) {
            const { redirect } = route;
            return <Route key={key} path={redirect.from} element={<Navigate to={redirect.to} />} />;
          }
          return <Route key={key} path={route.path as string} element={route.component} />;
        })}
      </Routes>
    );
  }
  return null;
};

export default renderRoutes;
