module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': "off",
    'import/extensions': "off",
    'radix': "off",
    'no-restricted-syntax': 0,
    'guard-for-in': "off",
    'no-unused-vars': "off",
    'no-use-v-if-with-v-for': "off"
  },
};
