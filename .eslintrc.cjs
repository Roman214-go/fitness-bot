module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended",
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "array-bracket-spacing": ["error", "never"],
    "arrow-body-style": ["error", "as-needed"],
    "comma-dangle": ["error", "always-multiline"],
    "curly": ["error", "all"],
    "eqeqeq": ["error", "always"],
    "eol-last": ["error", "always"],
    "keyword-spacing": "warn",
    "linebreak-style": ["warn", "unix"],
    "object-curly-spacing": ["warn", "always"],
    "quotes": ["warn", "single"],
    "no-console": "warn",
    "no-else-return": "error",
    "no-empty": "warn",
    "no-extra-semi": "error",
    "no-multiple-empty-lines": [
      "warn",
      {
        "max": 1
      }
    ],
    "no-multi-spaces": ["warn"],
    "no-trailing-spaces": "warn",
    "no-use-before-define": "error",
    "react/self-closing-comp": ["error", { "component": true, "html": true }],
    "semi": ["error", "always"]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
