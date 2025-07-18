import globals from "globals";
import pluginJs from "@eslint/js";
import eslintReccomended from "eslint-plugin-prettier/recommended"
import jest from "eslint-plugin-jest";
import cypress from "eslint-plugin-cypress";

/** @type {import('eslint').Linter.Config[]} */
export default [
eslintReccomended,
  {
    languageOptions: { 
    globals: globals.browser 
  },

rules: {
  ...pluginJs.configs.recommended.rules,
  "no-unused-vars": "error",
  "semi": "error"
}
},
{
  // для тестов
  files: ["src/**/*.test.js"],
  ...jest.configs['flat/recommended'],
},
{
  files: ["cypress/**/*.js"],
    plugins: {
      cypress,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    env: {
    'cypress/globals': true,
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },
];