import type {Linter} from "eslint";

// ESLint configuration for TypeScript best practices
// Repository: polkavm-hardhat-examples
// Notes:
// - This config targets Node.js + TypeScript and typical Hardhat/ts-node usage.
// - You may need to install the listed plugins in your devDependencies:
//   eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin,
//   eslint-plugin-import, eslint-plugin-unused-imports, eslint-config-prettier (optional)
// - Run later (example): npx eslint "**/*.ts" --max-warnings=0

const config: Linter.Config = {
    root: true,
    ignorePatterns: [
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
        // Declarations
        "**/*.d.ts",
    ],
    env: {
        es2023: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // If project-wide type-aware linting is desired, uncomment below and ensure tsconfig.json exists at the root.
        // tsconfigRootDir: __dirname,
        // project: ["./tsconfig.json", "./uniswap/tsconfig.json"],
    },
    plugins: ["@typescript-eslint", "import", "unused-imports"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        // More opinionated TypeScript style helpers
        "plugin:@typescript-eslint/stylistic",
        // Import plugin with TS support
        "plugin:import/recommended",
        "plugin:import/typescript",
        // Keep ESLint from conflicting with Prettier formatting if you use it
        "prettier",
    ],
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
    overrides: [
        // Test files
        {
            files: ["**/*.test.ts", "**/*.spec.ts"],
            env: {jest: true, node: true},
            rules: {
                "@typescript-eslint/no-explicit-any": "off",
                "no-console": "off",
            },
        },
        // Hardhat config and scripts often use require/commonjs or dynamic imports
        {
            files: [
                "**/hardhat.config.ts",
                "**/hardhat.config.js",
                "**/scripts/**/*.{ts,js}",
                "**/deploy/**/*.{ts,js}",
            ],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
                "import/no-default-export": "off",
            },
        },
    ],
};

export default config;
