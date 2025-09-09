# Contributing Guidelines

Thank you for your interest in contributing to this project! This document outlines the process and best practices to
help you make successful contributions.

If you’re unsure about anything, feel free to open a draft issue or pull request (PR) and ask questions—early feedback
is welcome.

## Table of Contents

- Code of Conduct
- Ways to Contribute
- Getting Started
- Development Workflow
- Branching Strategy
- Commit Message Convention
- Pull Request Guidelines
- Coding Standards
    - TypeScript / JavaScript
    - Solidity
- Tests and Coverage
- Documentation
- Security Policy
- License and Attribution

## Code of Conduct

This project follows the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.

- Read: https://www.contributor-covenant.org/version/2/1/code_of_conduct/
- To report unacceptable behavior, please file a confidential report via your platform’s built‑in reporting tools (e.g.,
  GitHub’s “Report a vulnerability”/“Report abuse”) or contact the maintainers.

## Ways to Contribute

- Report bugs and issues
- Propose or implement features
- Improve documentation and examples
- Improve developer experience (tooling, scripts, CI)
- Add or improve tests

Before starting significant work, consider opening an issue to discuss your proposal.

## Getting Started

1. Fork the repository and clone your fork.
2. Create a new branch for your work (see Branching Strategy).
3. Install dependencies:
    - If the project uses a root package.json: `npm ci` or `npm install`
    - Some examples live under subfolders (e.g., `uniswap/`). If needed, also run `npm install` inside those example
      folders.
4. Ensure you can build and test locally (see Tests and Coverage).

Recommended tooling:

- Node.js LTS (e.g., 18 or 20)
- npm (or yarn/pnpm if the repo specifies)
- Hardhat for Solidity development (already included in example projects)

## Development Workflow

- Keep changes focused and small; submit multiple PRs if needed.
- Write or update tests alongside your code.
- Keep documentation up to date (README, docs/, example READMEs).
- Run linters and formatters before committing.

Common scripts (may vary by subproject):

- Install: `npm ci` or `npm install`
- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm test` or `npm run test`
- Coverage: `npm run coverage`

If a particular example lives under a subdirectory (e.g., `uniswap/`), run the commands in that folder.

## Branching Strategy

- Base: main (or default) branch is protected.
- Feature branches: `feat/short-description`
- Bugfix branches: `fix/short-description`
- Chore/Docs branches: `chore/...`, `docs/...`

Example: `feat/add-liquidity-example` or `fix/revert-on-zero-liquidity`.

## Commit Message Convention

Follow Conventional Commits:

- Format: `<type>(optional scope): <subject>`
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `perf`
- Examples:
    - `feat(uniswap): add pair creation example`
    - `fix(contracts): prevent overflow in reserve update`
    - `docs: clarify local test instructions`

Write clear, imperative subjects (e.g., “add”, “fix”, “update”), and include body/footers when useful (breaking changes,
issue links).

## Pull Request Guidelines

- Keep PRs small and focused; link related issues (e.g., “Closes #123”).
- Ensure:
    - All tests pass locally
    - New/changed code is covered by tests when applicable
    - Linting and formatting pass
    - Documentation is updated
- Provide a clear description of the change, rationale, and any trade-offs.
- Mark PR as draft if it’s a work in progress.

## Coding Standards

### TypeScript / JavaScript

- Prefer TypeScript in TS-enabled areas; keep strict typing where possible.
- Run linters/formatters (ESLint/Prettier) if configured.
- Avoid introducing new runtime dependencies unless necessary; prefer devDependencies for tooling.
- Keep functions small and composable; add JSDoc/TSdoc for non-obvious code.

### Solidity

- Use a fixed compiler pragma across contracts (avoid floating pragmas) consistent with the project examples.
- Follow NatSpec for public/external functions; include clear `@dev` and `@notice` where relevant.
- Validate inputs with `require` and meaningful error messages; prefer custom errors when supported.
- Emit events for state-changing operations users may need to track.
- Avoid unnecessary state writes and expensive operations; be mindful of gas.
- Prefer Checked Math or compiler’s built-in checked arithmetic (>=0.8.x), avoid overflows.
- Keep interfaces in `contracts/interfaces/` and libraries in `contracts/libraries/` organized.
- Write thorough tests for critical paths and edge cases.

## Tests and Coverage

- Place tests in the appropriate test directory (e.g., `uniswap/test/`).
- Use Hardhat test runners (Mocha/Chai) unless the example specifies otherwise.
- Aim for meaningful coverage (logic branches, failure modes). Avoid brittle tests tied to implementation details.
- Run `npm test` (or the equivalent in the example subfolder). Add `npm run coverage` if configured.

## Documentation

- Update README.md or docs/ when behavior or setup changes.
- Add inline comments for complex logic and public APIs.
- Include example usage where helpful.

## Security Policy

Please do not file public issues for security vulnerabilities.

- If using GitHub: create a private “Security advisory” for this repository or contact the maintainers privately.
- Provide as much detail as possible to reproduce and assess impact.
- We will coordinate a fix and disclosure timeline.

## License and Attribution

By contributing, you agree that your contributions will be licensed under the repository’s license. See the LICENSE file
at the root of this repository.

- License: ../../LICENSE

Thank you for helping improve this project!