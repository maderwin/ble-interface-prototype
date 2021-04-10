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
    plugins: ['react', '@typescript-eslint', 'prettier', 'babel'],
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'quote-props': ['warn', 'as-needed'],
        'prettier/prettier': 'error',
        'object-curly-spacing': ['warn', 'always'],
        'max-len': ['warn', 120],
        'react/react-in-jsx-scope': 'off',
        'require-jsdoc': 'off',
        'no-invalid-this': 'off',
        'babel/no-invalid-this': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'space-before-function-paren': [
            'warn',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'react/prop-types': 'off',
    },
};
