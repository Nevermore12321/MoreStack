import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUsTrans from '@locales/en.json';
import zhCnTrans from '@locales/zh.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // import translate file
    resources: {
      en: {
        translation: enUsTrans,
      },
      zh: {
        translation: zhCnTrans,
      },
    },
    // 选择默认语言，选择内容为上述配置中的key，即en/zh
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

i18n.changeLanguage(get);

export default i18n;
