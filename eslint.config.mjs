import globals from "globals";
import pluginJs from "@eslint/js";
import eslintReccomended from "eslint-plugin-prettier/recommended"

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
}
];