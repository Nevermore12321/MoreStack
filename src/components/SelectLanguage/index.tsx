import React, { useState } from 'react';
import { determineSelectedLocale } from '@utils/translate';
import ChineseIcon from '@assets/icons/chinese-icon.svg';
import EnglishIcon from '@assets/icons/english-icon.svg';
import { AppstoreTwoTone } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import i18n from '@core/i18n';
import { MenuInfo } from 'rc-menu/es/interface';
import { useTranslation } from 'react-i18next';
import './index.less';

interface LanguageLabels {
  [index: string]: string;
}

interface LanguageIcons {
  [index: string]: string;
}

const SelectLanguage: React.FC = function SelectLanguage() {
  const curLang: string = determineSelectedLocale({
    sessionStorageLocaleKey: 'i18nextLng',
    cookieLocaleKey: 'i18nextLng',
    localStorageLocaleKey: 'i18nextLng',
  });
  const { t } = useTranslation();
  const [language, setLanguage] = useState<string>(curLang);

  // language menu info
  const locales = ['zh-CN', 'en-GB'];

  const languageLabels: LanguageLabels = {
    'zh-CN': '简体中文',
    'en-GB': 'English',
  };
  const languageIcons: LanguageIcons = {
    'zh-CN': ChineseIcon,
    'en-GB': EnglishIcon,
  };
  console.log(languageIcons);

  const handleChangeLang = (e: MenuInfo) => {
    void i18n.changeLanguage(e.key);
    setLanguage(e.key);
  };

  // dropDown Select Menu
  const langMenu = (
    <Menu className="menu" selectedKeys={[language]} onClick={handleChangeLang}>
      {locales.map((locale: string) => (
        <Menu.Item key={locale}>
          <span>
            <img className="langIcon" src={languageIcons[locale]} alt={t('can not display picture')} />
            {'  '}
            {languageLabels[locale]}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown.Button
      className="dropDown"
      overlay={langMenu}
      placement="bottomCenter"
      icon={<AppstoreTwoTone twoToneColor="#eb2f96" />}
    >
      {languageLabels[language]}
    </Dropdown.Button>
  );
};

export default SelectLanguage;
