module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'google'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'prettier', '@emotion'],
    rules: {
        indent: ['error', 4],
        'quote-props': ['warn', 'as-needed'],
        'prettier/prettier': 'error',
        'object-curly-spacing': ['warn', 'always'],
        '@emotion/jsx-import': 'error',
        '@emotion/no-vanilla': 'error',
        '@emotion/import-from-emotion': 'error',
        '@emotion/styled-import': 'error',
        '@emotion/syntax-preference': ['error', 'string'],
        'max-len': ['warn', 120],
        'react/react-in-jsx-scope': 'off',
    },
};
