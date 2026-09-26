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

## Verification Is The Half Worth Automating

A lesson routes verification through developer tools, which no page script can
open - so every verification step was recorded as unperformable and the
exercise checked nothing. Opening devtools is not the point; seeing the tags
is, and they can be read from the document directly, which is stricter than
looking because it also fails when a tag is present but empty.

Doing this found a real failure immediately: the page answered 404, because
the publish step had never opened the editor.

## Running It

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
- **A picker is slow the first time.** Documents and Media on a freshly
  restored database takes far longer than an ordinary find timeout, which is
  why one step passed alone and failed in a suite.
