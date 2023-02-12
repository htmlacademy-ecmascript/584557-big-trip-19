import { toCamelCase } from './string.js';

const isObject = function (item) {
  return item === Object(item) && !Array.isArray(item) && typeof item !== 'function';
};

const keysToCamel = function (item) {
  if (isObject(item)) {
    const n = {};

    Object.keys(item)
      .forEach((k) => {
        n[toCamelCase(k)] = keysToCamel(item[k]);
      });

    return n;
  } else if (Array.isArray(item)) {
    return item.map((i) => keysToCamel(i));
  }

  return item;
};

export { keysToCamel };
