# StackFile – Playwright QA Automation Demo

![Playwright Tests](https://github.com/mace-stev/StackFile/actions/workflows/playwright.yml/badge.svg)

End-to-end UI automation demo built with **Playwright** to validate real user behavior on a web application with intentionally complex structure.

This project demonstrates reliable locator strategy, cross-browser testing, HTML reporting, and CI execution suitable for real client environments.

---

## Project Purpose

This repository showcases production-style QA automation for:

- End-to-end user flow validation  
- Cross-browser compatibility  
- Stable selectors without test IDs  
- Failure visibility through reports and artifacts  
- Continuous Integration via GitHub Actions  

The StackFile interface is intentionally structured to simulate real-world scenarios where clean selectors are limited.

---

## Test Coverage

### File Management
- Create multiple files through the UI  
- Verify file count after creation  
- Remove a specific file and confirm deletion  
- Cancel deletion and confirm the file remains  

### Sorting Behavior
- Click once → Ascending order  
- Click twice → Descending order  
- Click three times → No sorting (preserves current order)  

### Modal Behavior
- Add file modal opens and closes correctly  
- Clicking outside modal closes it  
- Cancel action does not create a file  
- Blank submission uses fallback naming (`File-#`)  

### Edge Cases
- UI state verification through attributes and visual indicators  
- Async DOM updates handled using `expect.poll()`  
- Visibility and interaction safety checks  

---

## Technology

- Playwright  
- Node.js  
- Cross-browser testing:
  - Chromium  
  - Firefox  
  - WebKit  

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mace-stev/StackFile.git
cd StackFile
npm install
npx playwright install
```

---

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run with browser UI:

```bash
npx playwright test --headed
```

Run a specific file:

```bash
npx playwright test tests/mdn.spec.js
```

---

## HTML Test Report

After running tests:

```bash
npx playwright show-report
```

This opens an interactive report showing:

- Passed/failed tests  
- Execution time  
- Error details  
- Screenshots and traces (if enabled)  

---

## Continuous Integration (GitHub Actions)

This project runs automated tests on every push using GitHub Actions.

### Browsers tested in CI

- Chromium  
- Firefox  
- WebKit  

Workflow file location:

```
.github/workflows/playwright.yml
```

### CI pipeline steps

1. Install dependencies  
2. Install Playwright browsers  
3. Run full test suite  
4. Upload test report and artifacts  

---

## Viewing CI Test Results (Artifacts)

After a workflow run:

1. Go to the repository on GitHub  
2. Click **Actions**  
3. Select the latest workflow run  
4. Scroll down to **Artifacts**  
5. Download:

```
playwright-report
```

Unzip the folder and open:

```
index.html
```

This opens the full interactive Playwright report locally.

---

## Artifact Contents

Artifacts may include:

- HTML test report  
- Failure screenshots  
- Execution traces  
- Timing information  
- Browser logs  

This allows debugging test failures without running tests locally.

---

## Test Design Approach

This demo avoids relying on `data-testid` attributes to simulate real client environments.

Stability techniques used:

- Scoped locators  
- Visibility checks before interaction  
- Attribute validation for UI state  
- `expect.poll()` for async DOM updates  
- Behavior-based assertions instead of implementation details  

---

## Example Output

Successful run:

- All tests passing across Chromium, Firefox, and WebKit  
- HTML report generated  
- Artifacts available in CI  

(Screenshot example included in this repository.)

---

## Use Case

This setup reflects a real-world QA workflow:

- Automated regression testing  
- Cross-browser validation  
- CI integration  
- Failure diagnostics via artifacts  

Suitable for:

- Web applications  
- Startup QA setup  
- Continuous deployment environments  

---

## Contact

If you need automated testing or a website audit:

**masonwp.help@gmail.com**
