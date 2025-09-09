// ESLint Flat Config for TypeScript best practices (ESLint v9+)
// Repository: polkavm-hardhat-examples
// Notes:
// - This flat config is compatible with ESLint's new configuration system.
// - It mirrors the existing .eslintrc.ts rules to support both setups.
// - You may need to install (devDependencies):
//   eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin,
//   eslint-plugin-import, eslint-plugin-unused-imports, eslint-config-prettier (optional)

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
    // Global ignores
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/lib/**",
            "**/out/**",
            "**/coverage/**",
            "**/.nyc_output/**",
            // Hardhat / TypeChain artifacts
            "**/artifacts/**",
            "**/cache/**",
            "**/typechain-types/**",
            "**/artifacts-pvm/**",
            "**/cache-pvm/**",
            // Type declarations
            "**/*.d.ts",
        ],
    },

    // TypeScript files
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                // Enable project-aware linting by uncommenting below and providing valid tsconfig paths:
                // project: ["./tsconfig.json", "./uniswap/tsconfig.json"],
                // tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            import: require("eslint-plugin-import"),
            "unused-imports": require("eslint-plugin-unused-imports"),
        },
        settings: {
            // Let import plugin resolve TS paths
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
        rules: {
            // General JS/TS hygiene
            "no-console": ["warn", {allow: ["warn", "error"]}],
            "no-debugger": "warn",
            "prefer-const": "warn",
            eqeqeq: ["error", "smart"],

            // TypeScript
            "@typescript-eslint/explicit-function-return-type": "off", // allow inference
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                {prefer: "type-imports", disallowTypeAnnotations: false},
            ],

            // Unused imports/vars (prefer plugin for auto-fixable import removal)
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "unused-imports/no-unused-vars": [
                "warn",
                {vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_"},
            ],

            // Imports organization
            "import/no-unresolved": "off", // TS resolver handles this when configured
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                        "type",
                    ],
                    "newlines-between": "always",
                    alphabetize: {order: "asc", caseInsensitive: true},
                },
            ],
        },
    },

    // Test files overrides
    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "no-console": "off",
        },
    },

    // Hardhat configs and scripts often rely on require/commonjs or dynamic imports
    {
        files: [
            "**/hardhat.config.ts",
            "**/hardhat.config.js",
            "**/scripts/**/*.{ts,js}",
            "**/deploy/**/*.{ts,js}",
        ],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
        },
        rules: {
            "@typescript-eslint/no-var-requires": "off",
            "import/no-default-export": "off",
        },
    },

    // Optionally include Prettier compatibility (keeps ESLint from fighting Prettier formatting)
    // Uncomment if prettier is installed and used in the project:
    // require("eslint-config-prettier"),
];
