import React from 'react';
import LogoImg from '@assets/logos/logo-no-words-big.png';
import HeaderLogoImg from '@assets/logos/logo-words-big.png';
import BackgroundImg from '@assets/images/login-background-img.jpg';
import { Layout } from 'antd';
import SelectLanguage from '@components/SelectLanguage';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.less';

const AuthLayout: React.FC = function AuthLayout() {
  const { t } = useTranslation();
  return (
    <Layout style={{ backgroundImage: `url(${BackgroundImg})` }} className="MSlogin">
      <div className="MSlogin-header-logo">
        <img src={HeaderLogoImg} alt="header-logo" />
      </div>
      <div className="MSlogin-lang">
        <SelectLanguage />
      </div>
      <div className="MSlogin-form-wrapper">
        <div className="MSlogin-form-wrapper-brand">
          <img src={LogoImg} alt="logo" />
        </div>
        <div className="MSlogin-form-wrapper-card">
          <h1>{t('Login')}</h1>
        </div>
        <Outlet />
        <div className="MSlogin-form-wrapper-footer">Copyright &copy; 2021 &mdash; Shaohe Guo</div>
      </div>
    </Layout>
  );
};

export default AuthLayout;
