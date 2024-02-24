module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSortSpecifiers: true,
};
