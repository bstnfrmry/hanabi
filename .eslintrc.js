module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: [
    "simple-import-sort"
  ],
  rules: {
    "simple-import-sort/sort": "error",
    "@typescript-eslint/interface-name-prefix": [0],
    "@typescript-eslint/explicit-function-return-type": [0],
    "@typescript-eslint/no-use-before-define": [0],
    "react/jsx-sort-props": ["error", {
      "callbacksLast": true,
      "shorthandFirst": true,
      "reservedFirst": true,
    }],
    "react/no-unescaped-entities": [0]    
  }
};
