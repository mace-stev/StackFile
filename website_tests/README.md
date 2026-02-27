StackFiles Playwright Test Suite

This repository is a proof-of-skill Playwright test suite for a small web application called StackFiles.
The goal of this project is to demonstrate real world UI automation practices using Playwright on a deliberately difficult DOM structure.

The application uses minimal semantic markup and heavily nested divs to simulate the kind of DOMs commonly found in production apps.

What This Repo Demonstrates

This test suite focuses on realistic user flows and edge cases rather than synthetic examples.

Key skills demonstrated:

Writing stable Playwright tests against non semantic, div heavy DOMs

Scoping locators correctly to avoid brittle selectors

Testing stateful UI behavior

Handling modal dialogs and backdrop interactions

Avoiding flaky pointer interception issues

Verifying sorting logic and no-op states

Testing destructive actions with confirmation dialogs

Using expect.poll for reliable async assertions

Features Covered by Tests
File Creation

Creating multiple files via the Add File modal

Verifying correct row counts after creation

Handling blank input and fallback file naming logic

Sorting

Sorting file names in ascending order

Sorting file names in descending order

Verifying that a third click sets sort state to none without reordering the list

Deletion

Removing a specific file via the Remove dialog

Ensuring only the selected row is removed

Canceling a removal action

Verifying file rows persist when deletion is canceled

Modal Behavior

Opening and closing modals via buttons

Closing modals via backdrop clicks

Ensuring modals close without side effects

Avoiding pointer interception flakiness by clicking safe backdrop coordinates

Why This Project Exists

This repository is intentionally scoped as a proof repo, not a full production test suite.

It is designed to answer the question:

Can this person write reliable, thoughtful Playwright tests against a real UI?

Rather than testing authentication, APIs, or backend logic, this project focuses on UI behavior, DOM traversal, and test stability, which are core skills for QA automation and frontend testing roles.

Running the Tests

Install dependencies:

npm install


Run the Playwright test suite:

npx playwright test


To view the HTML report after a run:

npx playwright show-report

Notes on Test Design

Locators are scoped to logical containers to minimize coupling to DOM structure

Explicit waits are used only where state transitions occur

Backdrop clicks are performed with explicit positions to avoid dialog interception

Assertions verify both UI state and rendered content

Tech Stack

Playwright

JavaScript

Node.js

Author

This project was built as a skills demonstration for QA automation and Playwright focused roles.