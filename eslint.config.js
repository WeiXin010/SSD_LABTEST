// eslint.config.js (flat config)
import js from "@eslint/js"; // ESLint's built-in base rules
import globals from "globals"; // Common global variables (like window, document)
import { defineConfig } from "eslint/config"; // Flat config helper
import pluginSecurity from "eslint-plugin-security";
import pluginSecurityNode from "eslint-plugin-security-node";
import pluginUnsantized from "eslint-plugin-no-unsanitized";

export default defineConfig([
  js.configs.recommended,             // ESLint core rules
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Apply to all JS/JSX files
    languageOptions: {
      ecmaVersion: 2020, // Enable modern JavaScript features
      sourceType: "module", // Support ESModules (i.e., `import/export`)
      globals: globals.node, // Enable browser globals like `window`, `document`
    },
    plugins: {
      js, // ESLint core rules
      security: pluginSecurity,
      "security-node": pluginSecurityNode,
      "no-unsanitized": pluginUnsantized,
    },
    rules: {
      // Start with recommended React rules
      ...js.configs.recommended.rules,
      ...pluginSecurity.configs.recommended.rules,
      ...pluginSecurityNode.configs.recommended.rules,
      ...pluginUnsantized.configs.recommended.rules,

      "security/detect-eval-with-expression": "error",
      "no-console": "warn",
    },
  },
]);