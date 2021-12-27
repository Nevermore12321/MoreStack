import { getLocalStorageItem } from '@utils/localStorage';
import { parse } from 'querystring';
import cookie from 'cookie';

interface CurrentLocaleDef {
  urlLocaleKey: string;
  cookieLocaleKey: string;
  localStorageLocaleKey: string;
}

//  get current local language from local storage
const getLocaleFromLocalStorage = (options: CurrentLocaleDef) => {
  const { localStorageLocaleKey } = options;
  if (localStorageLocaleKey && window.localStorage) {
    return getLocalStorageItem(localStorageLocaleKey);
  }
};

//  get current local language from URL
const getLocaleFromURL = (options: CurrentLocaleDef) => {
  const { urlLocaleKey } = options;
  if (urlLocaleKey) {
    const query: string[] = window.location.search.split('?');
    if (query.length >= 2) {
      const params = parse(query[1]);
      return params && params[urlLocaleKey];
    }
  }
};

//  get current local language from cookie
const getLocaleFromCookie = (options: CurrentLocaleDef) => {
  const { cookieLocaleKey } = options;
  if (cookieLocaleKey) {
    const params = cookie.parse(document.cookie);
    return params && params[cookieLocaleKey];
  }
};

/*
 *
 */
const determineSelectedLocale = (options: CurrentLocaleDef) =>
  getLocaleFromLocalStorage(options) || getLocaleFromURL(options) || getLocaleFromCookie(options);
