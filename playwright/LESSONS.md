# What This Engine Learned The Hard Way

Every rule here was paid for by a test that passed while doing nothing, or
failed while blaming the wrong thing. They are recorded because the same
screens recur across every course, and because the expensive part was never
writing the fix - it was finding out which of three plausible explanations was
the real one.

Read this before changing `helpers/liferay.ts`, and add to it when a run
teaches you something a future run would otherwise rediscover.

## The Failure That Matters Most: Passing While Doing Nothing

A green test is not evidence. Three separate mechanisms each produced one.

**Liferay's create forms are modals, and a modal is an iframe.** The main
frame was searched first, so a step meaning the name box in the dialog typed
into the search filter on the page behind it, pressed Add on an untouched
form, and reported the step done. The exercise finished green having created
nothing. Frames are now searched newest first, and an open dialog ahead of the
frame that holds it - a reader cannot touch what is behind a dialog either.

**A click that changes anything satisfies a check that the screen changed.**
Pressing the wrong control still opens something. This is why an ambiguous
label is refused rather than resolved with `.first()`, and why a wrong click
is worse than a miss.

**Navigation was never verified.** `openMenu` clicked an application link and
returned. Several exercises ran their whole length on the home page while
reporting the menu step done, and every later failure named a control that was
never going to be there.

**A selected tab is not an open tab.** Page Audit's *PageSpeed Insights* tab
is marked selected at once and its pane fades in afterwards, so the capture
showed an empty panel and the step passed. The first fix - count the tab open
once its panel has text - was itself vacuous, and was recorded here as fixed:
a hidden pane still reports all of its text, so the check passed before the
pane appeared. A tab now counts as open when its pane is rendered, fully faded
in, and has text. Prove a new check fails on the defect before writing it down
as a fix.

**The reverse also happens: a save that worked, reported as doing nothing.**
A configuration dialog stays open after *Save*, its text does not change, and
the page behind it is untouched until it closes - so the screen comparison
failed a save that had persisted. The server accepting the POST is the
effect, and it is stronger evidence than anything on the screen.

**A green suite hid six failures until it was audited.** Three independent
auditors, one per slice of the course, each read the lesson, the test, the
run's captures beside the lesson's images, and the live product. Every test had
passed. They found: the English page serving the Spanish SEO title and
keywords; both descriptions never typed; a head check that could not fail; the
tab check above; an Export XLS that saves an HTML error page under a success
toast (a product defect - the server overflows its stack); and the
Accessibility Menu's own steps never run. Audit a suite this way before
presenting it as correct. Give each auditor its own Playwright config and
output folder, or one probe empties another's evidence.

**The re-audit found the fixes' own checks vacuous, four times.** Each was
written to stop a false pass and could not fail itself: the options check
compared the body's whole class list, which an open dialog changes by adding
`modal-open`; the reindex wait allowed its progress bar never to appear; the
canonical check had no value to compare; the tab check accepted "no panel
found". Each now has a positive control - a probe that shows it failing on the
defect it exists for (an unconfigured page, classes blocked by an injected
no-op) and passing on the real thing. Write that control before calling a
check done.

**Presence proves nothing about the head.** Liferay renders a title, a
canonical link, and og: tags on every page, configured or not. `verifyHead`
checks the values the course set: the title contains the HTML Title, and every
other tag equals its value exactly.

**A success toast is not a download.** Content Dashboard reports "XLS was
successfully generated." when the server has answered 500: its fetch never
checks the response. `download` checks the saved file - it exists, is not
HTML, and starts with its type's signature.

The lesson: **verify the effect, not the action.** After a run, check the
product - the page exists, the redirect answers 301, the user is in the list.

## Version Differences Are Real And Silent

A course workspace pins its own DXP release, and the same menu is not the same
thing across them.

| | 2026.q1 LTS | 2026.q3 |
| --- | --- | --- |
| Global Menu | a modal (`.applications-menu-modal`) | a dropdown (`.global-menu`) |
| Its button | no `aria-label` at all, only `data-qa-id="applicationsMenu"` | `aria-label="Open Applications Menu"` |
| Its sections | `button[role="tab"]` | links |

`data-qa-id` is the stable anchor. A suite that knows one shape reports the
other as a menu offering no applications, which reads like a product fault.

**The course's home page differs per course too** - `/web/clarity/home` for
one, `/web/clarity-public-enterprise-website/home` for another. Liferay
answers an unknown path with a 404 rendered inside the *Guest* site, and that
site carries the same company name, so a wrong `COURSE_HOME` looks like a
working instance whose menus are all missing applications. One wrong character
cost a run of 71 tests, 21 of which failed for no other reason. `signIn` now
refuses to continue from a 404 and names the variable.

## How Liferay Names Things

- **A field's label carries its help text.** The Description box on a user
  group announces itself as `Characters Maximum: 4000`; a role's Title as
  `Title A title is a localizable human-readable name...`. Match the accessible
  name exactly first, then follow the *visible* label to the field after it,
  then fall back to a substring.
- **A lesson's word is not always the product's.** The row menu a lesson calls
  *Actions* is `Open Page Options Menu` in the Pages application. Aliases are
  sourced from `liferay-portal/modules/test/playwright` page objects, never
  guessed - `Configure -> Configuration` and `New -> Add` both looked
  reasonable and were both wrong, because Configuration is a menu section and
  Add is the commit button on half the forms in the product.
- **A configuration section is a plain `li`**, not a tab, button or link. The
  SEO, Open Graph and Custom Meta Tags sections are `.portlet-body li`.
- **Some controls carry no name at all.** The cog that configures a chart has
  no text and no `aria-label`. The lesson identifies it by printing its icon,
  and that icon's file name is the icon the product draws - so
  `icon-cog.png` finds `svg use[href$="#cog"]`. An icon is a weak identifier,
  so it is only ever searched inside the row the sentence named.
- **A lesson sometimes names a control without emphasis**, because the
  icon beside it stands in: "Click Page Audit (![Page Audit](...))". The
  name is still what the button announces (`getByLabel('Page Audit')` in
  portal's `contentPage.spec.ts`). Generic words - "the Right Arrow button"
  - are a shape, not a name, and stay unperformed rather than guessed.
- **A dual list box is two native multiple selects** with arrows named
  `Transfer Item Left to Right` and `Transfer Item Right to Left` (Clay's
  `ClayDualListBox`, as portal's `SiteSettingsLocalizationPage.ts` drives
  it). Its options carry their scope - "Audience (Global)" - and a column
  can be capped, which disables the arrow silently. Check the item arrived.
- **A switch can update after the click returns.** The Accessibility Menu's
  options are `role="switch"` checkboxes that turn on a moment later, so
  `check()` reports that clicking changed nothing. Click, then wait for the
  switch to read checked - and address switches by position, because a
  selector for unchecked ones moves to the next the moment one turns on.
- **A localized field is one input with its own language button.** The
  button is `.input-localized-trigger` in the field's `.form-group`; it opens
  a menu of `a[role="menuitem"]` entries carrying `data-languageid="es_ES"`
  and reading "es-ES Not Translated", and afterwards reads the locale shown.
  Switching the first language button on the page, and returning quietly when
  no option read "Spanish", typed every SEO value into English.
- **A lesson's value can be long.** Values in backticks were capped at 80
  characters, so both 87- and 106-character descriptions were silently
  reported as "chosen from a control" and never typed.
- **Every row of a table keeps a hidden copy of its own menu.** Count only
  what is visible, or an unambiguous screen looks ambiguous.

## Things A Lesson Says That Are Not Controls

These were all rendered as clicks on controls that do not exist.

| The lesson says | What it means |
| --- | --- |
| "Enter these details:" + a table | Type each row before pressing the commit button |
| "enter `X` for name, and click *Add*" | The value is in the sentence, and belongs *before* the Add |
| "Use Custom Title \| *Enabled*" | A switch to operate. Skipping it leaves the field it governs disabled |
| "Path: `.../image.jpeg`" | A file from the workspace, handed over with `setInputFiles` |
| "While configuring the *X* page" | Resume a screen a previous exercise left open |
| "Begin editing the *X* page and click *Publish*" | Open the editor first, or the page stays a draft |
| "Return to *Clarity Public Enterprise Website*" | Navigate back to the site; the steps after need its menu |
| "Return to your previous browser window" | **Not** a return-to-site. A site is named in emphasis |
| "Log out and go to <url>" | End the session; everything after is as a guest |
| "Open a new browser and go to <url>" | A side trip. Keep the session and come back |
| "Right click and select *Inspect*" | Developer tools. Not performable - but see below |
| "*Actions* for Christian Carter" | Scope to that row, or it acts on whoever is first |
| "the *Language* button for Name" | Scope to the field's own `.form-group` |
| "Use the *left arrow* to remove the *Audience* and *Stage* vocabularies" | Select those items in their column, then transfer. The arrow alone moves nothing |
| "Click *Save* and close the modal window" | The dialog stays open after saving. Close it where the sentence does - "Close the modal window and click *Publish*" closes first |
| "Refresh the browser window and hit the Tab key twice" | A reload, then keys. The Accessibility Menu's entry point exists only for keyboard users |
| "In the second browser tab, refresh the page" | Not performable: the engine drives one page, and reloading it refreshes the wrong one |
| "Enable some of the options, close the menu, and verify the changes" | Turn on two, close, and check the page body's classes changed |
| "Create these three FAQ articles:" + a table whose first column is values | Items to create, one per row - not fields named by the first cell |
| "Since X is not configured... there's a button for setting it up" | The expected end state. Read the prose before calling an exercise unautomatable: PageSpeed Insights never calls Google here, it shows the setup screen |

## The Course Starts Before Exercise One

A course's environment setup lesson has no "Exercise:" heading, so it produced
no test - and in 24 courses it ends by reindexing all search indexes. Every
run therefore started from an empty index. Nothing failed where the setup was
skipped: the Content Dashboard, five exercises later, listed one item and its
Author picker said "No users were found" about a user who exists. The parser
now reads a setup lesson's required sections as test `00`, and a failure that
names a missing user, item, or result is first a question about the index.

## State That Outlives A Test

The database is reset between runs, not between exercises, and some state is
not in the database at all. **Page Audit remembers it is open** for the
signed-in user (`setSessionValue` in `layout-reports-web`), so it opens again
on the next page load, and a later "Go to the *Home* page" can change nothing
on the screen. Expect a panel a previous exercise opened to still be there.

Also seen and not reproduced alone: page settings stopped answering - even
counting elements hung - while three auditors drove the instance at once. The
same screens answered normally afterwards, before and after the Accessibility
Menu exercise. The console's "Failed to execute 'removeChild'" error appears
either way and is harmless. Do not report it as a product defect without a
repeat on an otherwise idle instance.

Seen once and not reproduced: on a fresh database the *Add Page* dialog
rendered Clarity's 404 page inside its frame, so there was no Name field. The
next run from the same reset passed. If it recurs, the failure capture shows
the broken glasses.

**The course database can already hold what an exercise sets.** The SEO
workspace's shipped database has the Accessibility Menu enabled for the
company and for Clarity, so "check *Enable Accessibility Menu*" finds it
checked and the step proves nothing. That is a course issue, not a test one;
report it.

**Page Audit's open state survives a new sign-in**, not only a page load: it
is stored for the user. On a database a course has already run against, the
panel opens by itself and "Page Audit" names two controls.

## Verification Is The Half Worth Automating

A lesson routes verification through developer tools, which no page script can
open - so every verification step was recorded as unperformable and the
exercise checked nothing. Opening devtools is not the point; seeing the tags
is, and they can be read from the document directly, which is stricter than
looking because it also fails when a tag is present but empty.

Doing this found a real failure immediately: the page answered 404, because
the publish step had never opened the editor.

## Running It

Everything below is automated by `run-live.sh` in the generator repository
(`.claude/scripts/course-check/playwright`), and this engine lives there once:
edit it there and run `sync-engine.sh <workspace>`, never edit a workspace
copy. After changing the generator, run `check-generated.sh` - it shows what
the change does to every course's tests. Its first run showed a fix for one
course pressing *Publish* behind an open dialog in four steps of other courses.

- **Wait for readiness as a guest.** Basic auth does not sign a page request
  in, so a check for signed-in markup never succeeds. One did exactly that,
  and spent five minutes of every run timing out.

- **Reset the database between runs.** These exercises create things; a second
  run without a reset fails on what the first built, and every later failure
  becomes a guess. Restore `configs/local/data/hypersonic`, and **delete
  `lportal.log`** - it is a write-ahead journal and will replay the old run
  straight back over the clean database.
- **Wait for the interface, not just the port.** Tomcat logs startup while
  Liferay is still deploying. The first test after a restart used to fail on
  the Global Menu; `openMenu` retries for that reason.
- **Measure steps reached, not the failing line number.** Inserting one `fill`
  shifts every line below it, so a test getting deeper looks like a regression.
- **Run the whole course before believing a fix.** A change that unblocks one
  module can break another: row scoping broke a passing test because
  "Reindex for All Search Indexes" is not a table row.
- **So is the first click after a restart.** Reindex's confirmation opened
  in 225ms warm and outlasted the ten second change timeout cold, and the
  step failed with the dialog on the screen. The change check now keeps
  waiting while the page is still fetching.
- **Keep the evidence before running anything else.** Playwright empties
  `test-results` at the start of every run, so a probe written to explain a
  failure deleted that failure's trace. `run-live.sh` copies it into the
  run's own folder.
- **A picker is slow the first time.** Documents and Media on a freshly
  restored database takes far longer than an ordinary find timeout, which is
  why one step passed alone and failed in a suite.
