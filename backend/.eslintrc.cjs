module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  rules: {
    'import/no-unresolved': 'off',
    'no-console': 'off',
  },
};

