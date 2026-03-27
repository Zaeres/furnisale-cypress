# FurniSale — Cypress E2E & API Test Suite

This is a Cypress test suite I built for FurniSale. It covers end-to-end UI tests and some API tests as part of a test automation task.

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher

---

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/furnisale-cypress.git
cd furnisale-cypress
```

2. Install dependencies:

```bash
npm install
npm install cypress --save-dev
```

The credentials file and test images are already included in the repo under `cypress/fixtures/`, so no extra setup is needed there.

---

## Running the Tests

```bash
npx cypress open
```

Select **E2E Testing**, pick a browser, and run whichever spec files you want.

---

## Folder Structure

```
cypress/
├── e2e/
│   ├── screen2_login.cy.js
│   ├── screen5_all_listings.cy.js
│   ├── screen6_my_ads.cy.js
│   ├── screen7_post_ad.cy.js
│   └── ads_api.cy.js
├── fixtures/
│   ├── credentials.json
│   ├── test-image1.jpeg
│   ├── test-image2.jpeg
│   ├── test-image3.jpeg
│   └── invalid.pdf
└── support/
    ├── commands.js
    └── e2e.js
cypress.config.js
package.json
README.md
```

---

## Custom Commands

| Command | Description |
|---|---|
| `cy.login(email, password)` | Logs in through the UI form |
| `cy.loginAPI(email, password)` | Logs in by calling the login API directly, skipping the UI |
| `cy.createAD()` | Creates a test ad via the API, used to set up listing tests |
| `cy.fillForm()` | Fills in all the Post Ad form fields with valid test data |
| `cy.clearSystemState()` | Cleans up any ads created during the test run |

---

## Known Limitations & Skipped Tests

Some tests are skipped because of issues I found with the app during testing. I left them in the code with a comment explaining why rather than just deleting them.

| Test ID | Reason |
|---|---|
| POST-6 | The upload zone doesn't have an `<input type="file">` in the DOM, so Cypress can't interact with it for click-to-select. Would need a `data-testid` or a DOM fix from the dev side. |
| POST-12 | Files over 5MB are currently being accepted by the app, which is a bug. The test is written but skipped since it would fail on the current behaviour. |
| POST-16 | The API payload doesn't include an `order` field on image objects, so there's nothing to assert against. Skipped until that's added. |

### A note on selectors

Some parts of the app don't have `data-testid` attributes, so I used MUI class selectors like `[class*="MuiCardContent-root"]` as a fallback. It works but it's not ideal — ideally the components would have stable test IDs added.
