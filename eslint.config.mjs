import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  // JavaScript 配置
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      prettier
    },
    rules: {
      "prettier/prettier": "error",
      "semi": "off",
      "quotes": "off"
    }
  },

  // TypeScript 配置
  {
    files: ["**/*.ts"],
    ...tseslint.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true
      }
    },
    plugins: {
      prettier
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/semi": "off",
      "@typescript-eslint/quotes": "off"
    }
  }
]);