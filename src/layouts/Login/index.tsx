import React from 'react';
import { useTranslation } from 'react-i18next';

const Login: React.FC = function Login() {
  const { t } = useTranslation();
  return <div>{t('this is a test')}</div>;
};
