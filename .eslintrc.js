module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
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
  plugins: [
    "simple-import-sort"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "simple-import-sort/sort": "warn",
    "react/jsx-sort-props": ["warn", {
      "callbacksLast": true,
      "shorthandFirst": true,
      "reservedFirst": true,
    }],
    "react/prop-types": ["off"],
  }
};
