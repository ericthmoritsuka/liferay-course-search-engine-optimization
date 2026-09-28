# What Playwright's Own Docs Recommend, and Where This Engine Stands

Read from playwright.dev on 2026-09-28. LESSONS.md records what runs against
Liferay taught this engine; this file records what Playwright itself says to
do, so a change to the helpers can be checked against both. Where the two
disagree, the reason is written down here, so nobody "fixes" a deliberate
deviation back into a failure.

Sources: [best practices](https://playwright.dev/docs/best-practices),
[locators](https://playwright.dev/docs/locators),
[actionability](https://playwright.dev/docs/actionability),
[assertions](https://playwright.dev/docs/test-assertions),
[frames](https://playwright.dev/docs/frames),
[authentication](https://playwright.dev/docs/auth),
[timeouts](https://playwright.dev/docs/test-timeouts),
[UI mode](https://playwright.dev/docs/test-ui-mode),
[ARIA snapshots](https://playwright.dev/docs/aria-snapshots),
[page objects](https://playwright.dev/docs/pom),
[test.step](https://playwright.dev/docs/api/class-test#test-step),
[downloads](https://playwright.dev/docs/downloads),
[dialogs](https://playwright.dev/docs/dialogs).

## The Rules

**Test what a user sees.** Not function names or CSS classes. Our tests
follow the lesson's own words, which is this rule taken literally.

**Locators, in this order of preference:** `getByRole` (with its accessible
name), `getByText`, `getByLabel`, `getByPlaceholder`, `getByAltText`,
`getByTitle`, `getByTestId`, and CSS or XPath only as a last resort. Text
matching normalizes whitespace; `{exact: true}` or a regex narrows it.

**Locators are strict.** An action on a locator matching several elements
throws. The docs say to refine the locator - `filter({hasText})`,
`filter({has})`, `filter({visible: true})`, chaining, `and()` - rather than
reach for `first()`, `last()`, or `nth()`, because "when the page changes,
Playwright may click on an element you did not intend."

**Actions wait for actionability.** click and check wait for visible, stable,
receiving events, and enabled; fill waits for visible, enabled, editable;
selectOption for visible and enabled; press, focus, and setInputFiles check
nothing. `force: true` skips the non-essential checks - never use it to get
past a covered control, since a reader cannot click through a covering
dialog either.

**Assertions: web-first, which retry.** `toBeVisible`, `toHaveText`,
`toContainText`, `toHaveValue`, `toHaveAttribute`, `toBeChecked`,
`toHaveCount`, `toHaveURL`, `toBeFocused` re-read the page until they pass or
time out. Plain `toBe`, `toEqual`, and `toContain` on a value read once do
not retry, and "can lead to a flaky test". For values that are not a locator,
`expect.poll(fn)` retries a function and `expect(...).toPass()` retries a
block. `expect.soft` records a failure and carries on. Every assertion takes
a message as its second argument.

**Frames:** `page.frameLocator(selector)` or `locator.contentFrame()` reach
into an iframe and keep auto-waiting; `page.frame({url})` gets a Frame object.

**Isolation:** each test gets a fresh browser context; tests should not
depend on each other.

**Authentication:** sign in once in a setup project, save
`page.context().storageState({path})` under `playwright/.auth/` (never
committed - it holds live cookies), and give other projects
`storageState` and `dependencies: ['setup']`. One file per role.

**Timeouts:** test 30s, expect 5s, action and navigation none, by default.
`test.slow()` triples a test's timeout.

**Steps:** `test.step(title, body)` shows as a named step in the HTML report
and the trace viewer, and a failure is attributed to its step.

**Downloads:** start `page.waitForEvent('download')` before the click, then
read `download.path()` or `saveAs()`. Files are deleted when the context
closes.

**Native dialogs** - `alert`, `confirm`, `prompt`, `beforeunload` - are
dismissed automatically unless a `page.on('dialog')` handler accepts them.

**Tooling:** `npx playwright test --ui` (UI mode: timeline, DOM snapshots
per action, pick locator, watch mode), `--debug` (the Inspector),
`npx playwright show-trace <trace.zip>`, `npx playwright codegen <url>` to
record locators, and ARIA snapshots (`toMatchAriaSnapshot`) to assert a
screen's accessible structure. Lint with `tsc --noEmit` and the
`@typescript-eslint/no-floating-promises` rule, which catches a missing
`await`.

## Deliberate Deviations

**The tests are not isolated.** A course is a sequence - exercise four edits
what exercise one created - so the tests run in course order, one worker, no
retries (playwright.config.ts). Isolating them would test a state no reader
is ever in. The database reset in run-live.sh is the isolation, per run
rather than per test.

**Frames are searched rather than named.** A lesson never says which iframe a
field is in, and Liferay's modals are iframes whose URLs vary, so
`scopesFor` walks `page.frames()` newest first, the open dialog ahead of the
frame behind it. `frameLocator` needs a selector the generator cannot know.
Keep the walk, and keep the dialog first.

**Some locators are CSS.** Where Liferay's controls carry no accessible name
or none a lesson uses - `data-qa-id="applicationsMenu"`,
`.input-localized-trigger`, `.index-actions-sheet .list-group-item` - the
selector comes from liferay-portal's own page objects or a probe of the live
DOM, and says where it came from.

**Sign-in is not saved state yet.** Every test signs in through the UI. See
the gaps.

## Gaps, Most Worth Fixing First

1. **No dialog handler.** Liferay asks some confirmations with a native
   `confirm()`. Playwright dismisses it, so a step like "click *Delete* and
   confirm" is silently cancelled and can still change the screen enough to
   pass. Add a handler that accepts when the lesson's step confirms, and
   fails loudly on any dialog it did not expect.
2. **Steps are comments, not `test.step`.** The generator writes
   `// Step 3. ...` and report.py maps a failing line back to a step. Wrapping
   each lesson step in `test.step('Step 3. ...', ...)` puts the lesson's own
   steps in the HTML report and the trace, attributes failures natively, and
   is what a course author would read.
3. **Single reads where a retrying assertion exists.** `verifyHead` reads the
   head once and compares with `toBe`; the screen-change check compares two
   fingerprints with `not.toBe`. The head check can become
   `expect(page.locator('meta[name="description"]')).toHaveAttribute('content', value)`,
   which retries; `expect.soft` would then report every wrong tag in one run
   instead of the first.
4. **41 uses of `first()`, `last()`, or `nth()`.** Some are deliberate - the
   newest dialog, a switch addressed by position because the unchecked
   selector moves - and say so. Each of the rest is a place a changed page
   could send a click somewhere unintended. Review them against
   "refine the locator instead".
5. **26 fixed waits (`waitForTimeout`).** Each is a guess at how long Liferay
   takes. Where a condition exists - a panel shown, a request finished, a
   value set - wait for it instead.
6. **No type check or lint.** The workspace has no TypeScript compiler, so a
   generated test missing an `await` would run and pass without waiting. Add
   `typescript` and run `tsc --noEmit` in the generator's check.
7. **Sign-in through the UI in every test.** A setup project saving
   `storageState` per Clarity user would be faster - but Page Audit and the
   Accessibility Menu store per-user state server-side, so saved state does
   not make tests independent. Weigh speed only.
8. **No navigation timeout.** Set `navigationTimeout` so a hung page load
   fails with a named timeout.

## Worth Using

- `npx playwright test --ui` against a freshly reset bundle, to step through a
  failing exercise with DOM snapshots per action.
- `npx playwright show-trace <run>/test-results/<test>/trace.zip` on any
  failure; run-live.sh keeps the traces with the run.
- `npx playwright codegen http://localhost:8080` to find the locator the
  product actually exposes, before guessing one.
- ARIA snapshots to assert a lesson's screen: "the dialog shows these four
  switches" is a stricter check than any single element, and ignores
  styling.
