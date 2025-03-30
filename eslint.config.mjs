import globals from "globals";
import pluginJs from "@eslint/js";
import eslintReccomended from "eslint-plugin-prettier/recommended"
import jest from "eslint-plugin-jest";

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
}
];