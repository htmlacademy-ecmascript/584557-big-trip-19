import { toCamelCase } from './string.js';

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

const isObject = function (obj) {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';
};

const keysToCamel = function (obj) {
  if (isObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[toCamelCase(k)] = keysToCamel(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToCamel(i));
  }

  return obj;
};

export { updateItem, keysToCamel };
