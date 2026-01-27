# GAD MCP Copilot - Playwright Testing Framework

[![Playwright CI](https://github.com/bike7/gad-mcp-copilot/actions/workflows/playwright.yml/badge.svg)](
https://github.com/bike7/gad-mcp-copilot/actions/workflows/playwright.yml
)

Link to report: (Playwright report)[https://bike7.github.io/gad-mcp-copilot/]

A comprehensive end-to-end testing framework built with Playwright, featuring functional and non-functional tests, multiple reporting options and accessibility testing capabilities.

## GAD Application

Repository: https://github.com/jaktestowac/gad-gui-api-demo
Follow instructions in app README

## Features

- 🎭 **Playwright-based** testing framework
- 🧪 **Comprehensive test suites**:
  - **Functional tests**: Smoke tests, integration tests, and end-to-end (E2E) tests validating application behavior and user workflows
  - **Non-functional tests**: Performance testing, accessibility audits and quality metrics, visual testing and snapshots
- 📊 **Multiple reporting options**:
  - Allure Reports
  - Lighthouse Performance Reports
  - Accessibility Reports (axe-core)
  - Native Playwright HTML Reports
- 👁️ **Visual testing** with screenshot comparison
- 🤖 **AI-assisted development** using GitHub Copilot chatmodes (Planner, Generator, Healer) for test creation and planning
- 🏭 **Factory pattern** Faker for test data generation
- 📄 **Page Object Model** for maintainable test structure
- 🔧 **TypeScript** support for type safety

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gad-mcp-copilot
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Project Structure

```
├── src/
│   ├── factories/          # Test data factories
│   ├── fixtures/           # Custom Playwright fixtures
│   ├── helpers/            # Helper utilities (axe, etc.)
│   ├── models/             # Data models
│   └── pages/              # Page Object Models
├── tests/
│   ├── functional/         # Functional test suites
│   └── nonfunctional/      # Non-functional tests
├── scripts/                # Utility scripts
├── accessibility-reports/  # Accessibility test results
├── allure-report/          # Generated Allure reports
├── allure-results/         # Raw Allure test results
├── lighthouse-reports/     # Performance audit reports
└── playwright-report/      # Native Playwright reports
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run specific test suites

```bash
# Functional tests
npx playwright test tests/functional

# Non-functional tests
npx playwright test tests/nonfunctional

# Smoke tests
npx playwright test --grep @smoke
```

### Run tests in UI mode

```bash
npx playwright test --ui
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

## Reports

### Playwright HTML Report

After running tests, view the report:

```bash
npx playwright show-report
```

### Allure Report

Generate and open Allure report:

```bash
# Generate report
npx allure generate allure-results --clean -o allure-report

# Open report
npx allure open allure-report
```

### Lighthouse Reports

Generate performance reports:

```bash
node scripts/generate-lighthouse-report.js
```

Reports are saved in the `lighthouse-reports/` directory.

### Accessibility Reports

Accessibility test results using axe-core are automatically generated and saved in the `accessibility-reports/` directory.

### Visual Testing

Playwright's built-in visual comparison captures and compares screenshots to detect visual regressions:

```bash
# Update visual baselines
npx playwright test --update-snapshots

# Run visual tests
npx playwright test
```

Screenshot comparisons are automatically performed during test execution, with differences highlighted in test results.

## Configuration

- **playwright.config.ts** - Main Playwright configuration
- **tsconfig.json** - TypeScript compiler options
- **eslint.config.js** - ESLint rules and settings

## Test Data Management

The project uses the **Factory Pattern** for generating test data. Factories are located in `src/factories/` and provide consistent, reusable test data across test suites.

## Page Object Model

Page objects are organized in `src/pages/` directory, following the Page Object Model pattern for better maintainability and reusability.

## AI-Assisted Development

This project leverages various GitHub Copilot chatmodes to enhance test development:

- **Generator & Healer** - Used for creating and maintaining functional tests:
  - Smoke tests
  - Integration tests
  - End-to-end (E2E) tests
- **Planner** - Used for strategic test planning:
  - Performance test planning documented in [tests/nonfunctional/performance-plan.md](tests/nonfunctional/performance-plan.md)

These AI-powered tools help accelerate test creation, improve test quality, and maintain consistency across the test suite.
