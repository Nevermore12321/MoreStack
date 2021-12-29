import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter } from 'react-router-dom';
import renderRoutes from '@utils/routeRender';
import routes from '@core/routes';

const Demo: FC = function Demo() {
  // return <LoginLayout />;
  return <HashRouter>{renderRoutes(routes)}</HashRouter>;
};

export default Demo;
