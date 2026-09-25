# Course Tests

These tests perform this course's exercises against a running Liferay, the way
a reader would: they sign in as the same Clarity users and enter the same
values the lessons give.

They test the course, not the product. Liferay DXP has its own tests in
`liferay-portal`.

## Running Them

1. Start a bundle from this workspace and let it finish deploying.

1. Install, once:

   ```bash
   cd playwright
   npm install
   npx playwright install chromium
   ```

1. Copy `.env.local.example` to `.env.local` and set `LIFERAY_URL` to your
   bundle.

1. Run them:

   ```bash
   npm test
   ```

   `npm run test:headed` watches it happen in a browser, which is the fastest
   way to see why a step failed.

## Run Them From a Fresh Baseline

The tests run in course order, and each one builds on what the one before it
left behind. That is how a reader experiences the course, and it is why they
run one at a time with no retries.

It also means they need the state the course starts from. Start the bundle
from this workspace's baseline branch before a full run: a bundle that has
already had the tests run against it is not the state the first exercise
expects.

## When to Run Them

- After upgrading this workspace to a new Liferay DXP release
- After adding or changing an exercise, having regenerated its test
- To refresh the screenshots

A full run catches the case a single test cannot: a change in one exercise
that breaks a later one.

## What a Pass Means, and What It Does Not

**A pass means nothing blocked a reader.** Every step named a control that was
there, and pressing it changed the screen.

**It does not mean the exercise built the right thing.** Nothing here records
what an exercise is supposed to produce, so a test cannot tell a site created
correctly from one created with the wrong template.

Some steps are not performed at all, and each says so in the test rather than
being left out: steps done at a terminal, and steps that do not name a control
or a value plainly enough to act on. A test file is meant to be read as an
honest account of what was and was not checked.

## Changing an Exercise

The lessons live in `liferay-learn`; the tests live here. Changing an
exercise's steps therefore takes two pull requests, and they should be opened
together:

- `liferay-learn`, for the article and its screenshots
- this workspace, for the test

The tests are generated from the lessons. Edit the lesson, regenerate, and
commit the result - edits made directly to a test file are overwritten.
