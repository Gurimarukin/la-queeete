module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['deprecation', 'functional', 'fp-ts', 'tailwindcss'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:functional/strict',
    'plugin:fp-ts/all',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['src/**/libs/**/*.ts', 'src/**/libs/**/*.tsx'],
  rules: {
    '@typescript-eslint/array-type': ['warn', { default: 'array', readonly: 'generic' }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', disallowTypeAnnotations: false },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    '@typescript-eslint/no-base-to-string': [
      'error',
      {
        ignoredTypeNames: [
          'AccessToken',
          'ChallengeId',
          'ChampionEnglishName',
          'ChampionId',
          'ChampionKey',
          'DDragonVersion',
          'DiscordUserId',
          'GameName',
          'MsDuration',
          'Puuid',
          'SummonerId',
          'SummonerName',
          'SummonerSpellId',
          'SummonerSpellKey',
          'TagLine',
          'UserId',
          'UserName',
        ],
      },
    ],
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-namespace': 'warn',
    '@typescript-eslint/no-restricted-imports': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'warn',
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
      },
    ],
    'arrow-parens': ['warn', 'as-needed'],
    'arrow-body-style': ['warn', 'as-needed'],
    'array-callback-return': 'off',
    'comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'deprecation/deprecation': 'warn',
    eqeqeq: ['error', 'always'],
    'fp-ts/no-module-imports': ['warn', { allowTypes: true }],
    'functional/functional-parameters': [
      'error',
      {
        allowRestParameter: true,
        enforceParameterCount: false,
      },
    ],
    'functional/no-conditional-statements': 'off', // switch aren't bad :/
    'functional/no-expression-statements': [
      'warn',
      {
        ignorePattern: [
          '^afterEach\\(',
          '^beforeEach\\(',
          '^console\\.',
          '^describe(\\.only)?\\(',
          '^expectT(\\.only)?\\(',
          '^it(\\.only)?\\(',
          '^useEffect\\(',
        ],
      },
    ],
    'functional/no-mixed-types': 'off',
    'functional/no-return-void': ['error', { ignoreInferredTypes: true }],
    'functional/prefer-immutable-types': 'off',
    'functional/type-declaration-immutability': 'off',
    'max-len': [
      'warn',
      {
        code: 100,
        tabWidth: 2,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'no-console': 'off',
    'no-else-return': ['warn', { allowElseIf: false }],
    'no-empty-function': 'off',
    'no-inner-declarations': 'off',
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-multi-spaces': 'warn',
    'no-redeclare': 'off',
    'no-restricted-imports': 'off',
    'no-shadow': ['warn', { builtinGlobals: true, hoist: 'functions' }],
    'no-undef': 'off',
    'no-unneeded-ternary': 'warn',
    'no-use-before-define': 'off',
    'no-useless-computed-key': 'warn',
    'no-useless-rename': 'warn',
    'nonblock-statement-body-position': ['warn', 'beside'],
    'object-shorthand': 'warn',
    'prettier/prettier': 'off',
    quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'react/button-has-type': 'warn',
    'react/display-name': 'off',
    'react/hook-use-state': 'warn',
    'react/jsx-boolean-value': ['warn', 'always'],
    'react/jsx-no-bind': [
      'warn',
      {
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
      },
    ],
    'react/no-array-index-key': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': ['warn', { component: true, html: true }],
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
    'space-in-parens': ['warn', 'never'],
    strict: 'warn',
    'tailwindcss/no-custom-classname': 'warn',
  },
}
