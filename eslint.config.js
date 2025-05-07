import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { ignores: ['build/*','coverage/*'] },
  {
    plugins: {
      'react-refresh': reactRefresh,
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'warn',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/jsx-uses-vars': 'error',
    }
  },
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]