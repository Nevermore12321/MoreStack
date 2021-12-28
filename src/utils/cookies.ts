/**
 * set key-value to the cookie, default Age is 10 days
 * @param {string} key Key name to store
 * @param {string} value Value to store
 * @param {time} time Option, How long does the key value expire
 */
export const setCookie = function setCookie(key: string, value: string, time?: number | Date) {
  // default expire is 10 days
  const defaultTime = 86400000;
  let invalid = new Date();
  if (time) {
    switch (typeof time) {
      case 'number':
        invalid.setTime(invalid.getTime() + time);
        break;
      default:
        invalid = time;
    }
  } else {
    invalid.setTime(invalid.getTime() + defaultTime);
  }
  // 字符串拼接cookie
  window.document.cookie = `${key}=${value};path=/;expires=${invalid.toUTCString()}`;
};

/**
 * get value from cookie
 * @param {string} param Key name to store
 * @returns {string | null} get value string from cookie
 */
export function getCookie(param: string): string {
  if (document.cookie.length > 0) {
    // first seperate ["key=value","path=/","expire="]
    const arr: string[] = document.cookie.split('; ');
    for (let i = 0; i < arr.length; i += 1) {
      // second seperate [key,value] [path,/] [expire, ...]
      const resArr: string[] = arr[i].split('='); // 再次切割
      if (resArr[0] === param) {
        return resArr[1];
      }
    }
  }
  return '';
}
