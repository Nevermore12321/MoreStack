import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './index.less';
import userClient from '@apis/user';
import { BaseResourceReqDef } from '@apis/base/reqestTypes';
import { clickOptions } from '@testing-library/user-event/dist/click';

const Login: React.FC = function Login() {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const { t } = useTranslation();

  console.log(userClient);
  const client: BaseResourceReqDef = userClient.allResources.catalog;
  const test = client.list?.();

  return (
    <div className="login_form">
      <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: t('Please input your Username!') }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t('Username')} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: t('Please input your Password!') }]}>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={t('Password')}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="login-form-remember">{t('Remember me')}</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="/login">
            {t('Forgot password')}
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {t('Log in')}
          </Button>
          <Button type="ghost" href="/login" className="login-form-register">
            {t('register now!')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
