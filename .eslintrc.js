module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'react-app', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    rules: {
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/camelcase': [0, {ignoreDestructuring: true}],
        '@typescript-eslint/no-non-null-assertion': 0,
        "prettier/prettier": "error",
        '@typescript-eslint': 0,
        '@typescript-eslint/no-unused-vars': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error'
    }
}
  