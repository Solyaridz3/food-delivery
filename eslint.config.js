import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules", "dist", "build"], // Directories to ignore
  },
  {
    languageOptions: {
      ecmaVersion: "latest", // Latest ECMAScript version
      sourceType: "module", // Set to "module" if using ES Modules
    },
    plugins: {
      prettier: prettierPlugin, // Register Prettier as a plugin
    },
    rules: {
      // Include Prettier rules
      ...prettierConfig.rules,
      "prettier/prettier": "error", // Treat Prettier formatting issues as errors
      indent: ["error", 2],
    },
  },
];
