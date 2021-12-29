import React from 'react';
import { Layout } from 'antd';
import LogoImage from '@assets/logos/logo-no-words-big.png';
import { useTranslation } from 'react-i18next';
import Route from '@utils/routeRender';

const LoginLayout: React.FC = function LoginLayout() {
  console.log(Route);
  return (
    <Layout className="my-login">
      <div className="my-login-form-wrapper">
        <div className="my-login-form-wrapper-brand">
          <img src={LogoImage} alt="logo" />
        </div>
        <div className="my-login-form-wrapper-card">
          <h2>Login</h2>
          {/* <LoginForm /> */}
        </div>
        <div className="my-login-form-wrapper-footer">Copyright &copy; 2020 &mdash; Shaohe Guo</div>
      </div>
    </Layout>
  );
};

export default LoginLayout;
