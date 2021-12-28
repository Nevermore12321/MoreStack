import { getLocalStorageItem, setLocalStorageItem } from '@utils/localStorage';
import { getCookie, setCookie } from '@utils/cookies';

export interface CurrentLocaleDef {
  sessionStorageLocaleKey: string;
  cookieLocaleKey: string;
  localStorageLocaleKey: string;
}

//  get current local language from local storage
const getLocaleFromLocalStorage = (options: CurrentLocaleDef): string => {
  const { localStorageLocaleKey } = options;
  return getLocalStorageItem(localStorageLocaleKey) as string;
};

//  get current local language from session
const getLocaleFromSessionStorage = (options: CurrentLocaleDef): string => {
  const { sessionStorageLocaleKey } = options;
  return getLocalStorageItem(sessionStorageLocaleKey) as string;
};

//  get current local language from cookie
const getLocaleFromCookie = (options: CurrentLocaleDef): string => {
  const { cookieLocaleKey } = options;
  const params: string = getCookie(cookieLocaleKey);
  return params || '';
};

/**
 * determine current selected loacl language
 * @param {CurrentLocaleDef} key name for search current language
 * @return {string} value for local language
 */
export const determineSelectedLocale = (options: CurrentLocaleDef): string =>
  getLocaleFromLocalStorage(options) || getLocaleFromSessionStorage(options) || getLocaleFromCookie(options);
