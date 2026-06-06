import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts'],

        plugins: {
            prettier: prettierPlugin,
            'simple-import-sort': simpleImportSort,
        },

        rules: {
            'prettier/prettier': 'error',

            // Import sorting
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    prettierConfig,
];
