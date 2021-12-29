import React from 'react';
import DocumentTitle from 'react-document-title';
import { useTranslation } from 'react-i18next';
import styles from './index.less';
// import renderRoutes from "@utils/routeRender";

const BlankBase: React.FC = function BlankBase(props) {
  const { t } = useTranslation();
  console.log('test');
  console.log(props);
  return (
    <DocumentTitle title={t('MoreStack Cloud Management system')}>
      <div className="test">
        <div className={styles.main} />
      </div>
    </DocumentTitle>
  );
};
export default BlankBase;
