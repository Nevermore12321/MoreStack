interface LocalStorageValue {
  expires: number;
  value: string;
}

/**
 * set key-value to the local storage, default Age is 10 days
 * @param {string} key Key name to store
 * @param {string} value Value to store
 * @param {number} maxAge Option, How long does the key value expire
 * @param {number} expiry Option, key value expire time
 */
export const setLocalStorageItem = (key: string, value: string, maxAge = 864000000, expiry = 0) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        expires: expiry || Date.now() + maxAge,
        value,
      })
    );
  } catch (e) {
    console.warn(e);
  }
};

/**
 * get value from the local storage
 * @param {string} key Key name to store
 * @returns {string | null} get value string from local storage
 */
export const getLocalStorageItem = (key: string): string | null => {
  const item: string = localStorage.getItem(key) as string;
  try {
    const { expires, value } = JSON.parse(item) as LocalStorageValue;
    if (Date.now() > expires) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (e) {
    return item;
  }
};
