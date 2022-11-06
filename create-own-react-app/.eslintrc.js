module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["evt"] }],
    'react/react-in-jsx-scope': 0
  }
};
