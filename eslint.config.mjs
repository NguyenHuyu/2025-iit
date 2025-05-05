import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import globals from 'globals'
import tailwind from 'eslint-plugin-tailwindcss'
import importX from 'eslint-plugin-import-x'
import regexPlugin from 'eslint-plugin-regexp'
import security from 'eslint-plugin-security'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
// import tailwind from 'eslint-plugin-tailwindcss'

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
    ...compat.config({
        extends: [
            'next',
            'eslint:recommended',
            'next/core-web-vitals',
            'next/typescript',
            'plugin:@typescript-eslint/recommended',
            'plugin:react-hooks/recommended',
            'plugin:tailwindcss/recommended',
            'plugin:@next/next/recommended',
            'prettier',
        ],
    }),
    prettier,
    eslintPluginPrettier,
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: { jsx: true },
            },
            globals: { ...globals.browser, ...globals.node },
        },
        plugins: {
            react,
            tailwind,
            importX,
            regexPlugin,
            security,
        },

        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',
            'jsx-quotes': ['warn', 'prefer-single'],
            semi: ['warn', 'never'],
            quotes: ['warn', 'single'],
            'tailwindcss/no-custom-classname': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',

            'prefer-arrow-callback': ['warn'],
            'prefer-template': ['warn'],
            'no-var': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            'tailwindcss/no-contradicting-classname': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'tailwindcss/classnames-order': 'off',
            'prettier/prettier': [
                'warn',
                {
                    jsxSingleQuote: true,
                    semi: false,
                    tabWidth: 4,
                    trailingComma: 'es5',
                    endOfLine: 'auto',
                    printWidth: 100,
                    plugins: ['prettier-plugin-tailwindcss'],
                },
            ],
            'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0, maxBOF: 0 }],
        },
        ignores: ['postcss.config.mjs', 'eslint.config.mjs'],
    },
]

export default eslintConfig
