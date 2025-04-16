# Playwright Test Automation Framework

This repository contains an automated testing framework using Playwright, demonstrating both UI and API testing capabilities. The framework is built with TypeScript and includes tests for the Sauce Demo website and a local API server.

## 🚀 Features

- UI Testing with Playwright
- API Testing capabilities
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Parallel test execution
- HTML report generation
- Screenshot and video capture on failure
- TypeScript support

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## 🛠️ Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🧪 Running Tests

### UI Tests

Run UI tests in different modes:

```bash
# Run all UI tests
npm run test:ui

# Run UI tests in Chromium only
npm run test:ui:chrome

# Run UI tests in Chromium with browser visible
npm run test:ui:chrome:headed
```

### API Tests

Run API tests (requires local JSON server):

```bash
# Run API tests
npm run test:api
```

### All Tests

Run all tests (both UI and API):

```bash
npm run test
```

## 📊 Test Reports

To view the HTML test report:

```bash
npm run show-report
```

## 🏗️ Project Structure

```
├── tests/
│   ├── ui/                 # UI test files
│   │   └── sauce-demo.spec.ts
│   └── api/               # API test files
├── playwright.config.ts   # Playwright configuration
├── package.json          # Project dependencies and scripts
└── db.json              # Mock data for API testing
```

## 🧪 Test Scenarios

### UI Tests (Sauce Demo)
- Login functionality
- Inventory page navigation
- Shopping cart operations
- Checkout process
- Product sorting
- Logout functionality

### API Tests
- API endpoints testing using local JSON server

## 📝 Configuration

The framework is configured using `playwright.config.ts` with the following features:

- Multiple browser support
- Mobile viewport testing
- Screenshot capture on test failure
- Video recording on test failure
- Parallel test execution
- Retries for failed tests
- HTML report generation

## 🛠️ Available Scripts

- `test`: Run all tests
- `test:api`: Run API tests with local server
- `test:ui`: Run all UI tests
- `test:ui:chrome`: Run UI tests in Chromium
- `test:ui:chrome:headed`: Run UI tests in Chromium with browser visible
- `show-report`: Show HTML test report
- `start-server`: Start local JSON server for API testing

## 📱 Supported Browsers and Devices

- Desktop Browsers:
  - Chromium
  - Firefox
  - WebKit (Safari)

- Mobile Viewports:
  - Pixel 5
  - iPhone 12

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details