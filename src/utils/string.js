function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const toCamelCase = (str) => str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
  .replace('-', '')
  .replace('_', ''));

export { capitalize, toCamelCase };
