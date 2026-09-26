/**
 * Doing what a course step says, to a running Liferay.
 *
 * Every function here is shaped by a failure seen against a real bundle, and
 * each carries the reason, because the obvious version of each one is wrong
 * in a way that is not obvious until it has cost an afternoon.
 */
import {expect, Frame, Locator, Page} from '@playwright/test';

/**
 * How Liferay's two menus open. Taken from liferay-portal's own page objects
 * rather than guessed, and two handles apiece because the attribute differs
 * by release: a 2026.q1 LTS bundle answers to applicationsMenu, a 2026.q3
 * bundle to globalMenu. A test pinned to either reports the other release as
 * a product with no menus at all.
 */
//
// How to open each menu, across DXP versions.
//
// The trigger is not the same from one release to the next: on 2026.q3 the
// Applications Menu button announces itself as "Open Applications Menu",
// while on 2026.q1 LTS it carries no aria-label at all - only
// data-qa-id="applicationsMenu". A course workspace pins its own release, so
// both have to work or a suite passes on one bundle and cannot find the menu
// on another.
//
// data-qa-id is the stable anchor and is listed first for that reason; the
// aria-labels follow as a fallback for builds that lack it.
//
//
// What a lesson calls a control, and what the product calls it.
//
// These are not guesses. Each comes from liferay-portal's own Playwright page
// objects, which address the real element: the row menu a lesson calls
// "Actions" is named "Open Page Options Menu" in the Pages application
// (pages/layout-admin-web/PagesAdminPage.ts), and a lesson has no reason to
// use that name because it is not what the reader sees.
//
// A lesson naming the visible label is correct. The map is how the visible
// label reaches the element underneath it.
//
const LABEL_ALIASES: Record<string, string[]> = {
	Actions: [
		'Open Page Options Menu',
		'Open Options Menu',
		'Show Actions',
		'Options',
	],
	Configure: ['Configuration'],
	New: ['Add', 'Plus'],
};

const MENUS: Record<string, {root: string; trigger: string}> = {
	'Global Menu': {
		//
		// And it is not the same kind of thing either: on 2026.q1 LTS this
		// menu is a modal (.applications-menu-modal), on 2026.q3 a dropdown
		// (.global-menu). A root matching only one means the menu opens and
		// the code concludes it did not.
		//
		root:
			'.applications-menu-modal.show, .applications-menu-wrapper, ' +
			'.global-menu, .dropdown-menu.show',
		trigger:
			'[data-qa-id="applicationsMenu"], [data-qa-id="globalMenu"], ' +
			'[data-testid="globalMenu"], ' +
			'[aria-label="Open Applications Menu"], ' +
			'[aria-label="Applications Menu"]',
	},
	'Site Menu': {
		//
		// Left as the dropdown alone. Adding the q1 sidebar class here made
		// this match a panel that is always present, so the code believed a
		// menu was standing over every screen - and Enabling the
		// Accessibility Menu, which had been passing, stopped being able to
		// click anything. Verified by reverting this line alone.
		//
		root: '.product-menu',
		trigger:
			'[data-qa-id="productMenu"], ' +
			'[data-qa-id="sideNavigationToggler"], ' +
			'[aria-label="Open Product Menu"], ' +
			'[aria-label="Toggle Product Menu"]',
	},
};

/** Long enough for a panel or dialog to arrive after the network goes quiet. */
//
// How long a control is given to appear before it is treated as absent.
//
const FIND_TIMEOUT = 8000;

//
// How long a click is given to change the screen before the absence of a
// change is treated as evidence.
//
const CHANGE_TIMEOUT = 10000;

const SETTLE = 900;

/**
 * Fill the field a step names.
 *
 * Searches every frame, because Liferay opens a create form inside an iframe
 * modal and a page level locator cannot see into it. The field is on the
 * screen; it is one frame down.
 *
 * Reads the value back afterwards. A field that fills itself in from another
 * accepts the typing and ends up holding both values, and nothing throws.
 */
export async function fill(
	page: Page,
	field: string,
	value: string,
	where: {language?: string; section?: string} = {}
) {
	//
	// The panel the field sits in, opened when the lesson named one.
	//
	// A page's configuration repeats field names across its panels, and a
	// collapsed panel's fields are not on the screen at all - so naming the
	// panel is both how the right field is found and how it becomes
	// reachable.
	//
	if (where.section) {
		await openSection(page, where.section);
	}

	//
	// The locale the value belongs to.
	//
	// A localised field renders one input per language, all carrying the same
	// label. Typing by label alone puts the Spanish text in the English box
	// and then reads it back successfully - a wrong result that reports
	// itself as a right one, which is the worst thing this can do.
	//
	if (where.language) {
		await chooseLanguage(page, where.language);
	}

	const input = await findField(page, field);

	expect(
		input,
		where.language
			? `no field named "${field}" for ${where.language} is on this ` +
				`screen, in any frame`
			: `no field named "${field}" is on this screen, in any frame`
	).not.toBeNull();

	await input!.scrollIntoViewIfNeeded({timeout: 4000}).catch(() => undefined);

	await input!.fill(value);

	await expect(
		input!,
		`the field "${field}" does not hold what was typed into it`
	).toHaveValue(value);
}

/** Open a named panel of a configuration sidebar, if it is not already open. */
async function openSection(page: Page, section: string) {
	const escaped = section.replace(/"/g, '\\"');

	for (const frame of page.frames()) {
		const heading = frame
			.locator(
				`button:has-text("${escaped}"), [role="button"]:has-text("${escaped}"), ` +
					`[role="tab"]:has-text("${escaped}"), a:has-text("${escaped}")`
			)
			.first();

		if (!(await heading.count().catch(() => 0))) {
			continue;
		}

		const open = await heading
			.evaluate(
				(node) =>
					node.getAttribute('aria-expanded') === 'true' ||
					node.getAttribute('aria-selected') === 'true'
			)
			.catch(() => false);

		if (!open) {
			await heading.click({timeout: 4000}).catch(() => undefined);

			await page.waitForTimeout(SETTLE);
		}

		return;
	}
}

/** Switch a localisable form to the language a value belongs to. */
async function chooseLanguage(page: Page, language: string) {
	const escaped = language.replace(/"/g, '\\"');

	for (const frame of page.frames()) {
		const selector = frame
			.locator(
				'[data-qa-id="languageSelector"], [aria-label*="anguage"], ' +
					'button[class*="language"], .language-flags button'
			)
			.first();

		if (!(await selector.count().catch(() => 0))) {
			continue;
		}

		await selector.click({timeout: 4000}).catch(() => undefined);

		await page.waitForTimeout(SETTLE);

		const option = frame
			.locator(
				`[role="menuitem"]:has-text("${escaped}"), ` +
					`[role="option"]:has-text("${escaped}"), ` +
					`button:has-text("${escaped}"), a:has-text("${escaped}")`
			)
			.first();

		if (await option.count().catch(() => 0)) {
			await option.click({timeout: 4000}).catch(() => undefined);

			await page.waitForTimeout(SETTLE);
		}

		return;
	}
}

/**
 * Reach a page's configuration, for an exercise that continues from another.
 *
 * A lesson splits a long procedure across exercises and resumes with "While
 * configuring the Quality Sunglasses page, go to the Open Graph tab". A
 * reader still has that screen open; a test does not, because each one starts
 * in a fresh browser. Without this the exercise fails on its first step
 * looking for a tab that is nowhere on the home page - which reads as a
 * missing control rather than as a missing starting point.
 *
 * This is the route a reader takes to get back: the Pages application, the
 * page's own Actions, then Configure.
 */
export async function openPageSettings(page: Page, name: string) {
	await openMenu(page, 'Site Menu', 'Site Builder', 'Pages');

	await press(page, 'Actions', name);

	await press(page, 'Configure');
}

/**
 * Drag one thing onto another, as a page-editor step describes.
 *
 * Playwright's dragTo() dispatches HTML5 drag events, which Liferay's page
 * editor does not listen for - it tracks the pointer. So the pointer is what
 * this moves, which is how liferay-portal's own page editor tests do it
 * (modules/test/playwright/pages/layout-content-page-editor-web).
 *
 * Hovering the target at its centre matters: dropping on an edge lands the
 * fragment in the neighbouring container, which looks like a passing step and
 * builds the wrong page.
 */
export async function drag(page: Page, source: string, target: string) {
	const from = await findDraggable(page, source);

	expect(
		from,
		`nothing named "${source}" on this screen can be dragged`
	).not.toBeNull();

	const onto = await findDropTarget(page, target);

	expect(
		onto,
		`there is nowhere named "${target}" on this screen to drop "${source}" into`
	).not.toBeNull();

	await from!.scrollIntoViewIfNeeded({timeout: 4000}).catch(() => undefined);

	await from!.hover({timeout: 8000});

	await page.mouse.down();

	//
	// Moved in steps rather than jumped. A single hover can land without the
	// editor registering a drag at all, because it needs pointer movement to
	// decide something is being dragged.
	//
	const box = await onto!.boundingBox();

	if (box) {
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
			steps: 12,
		});
	}
	else {
		await onto!.hover({force: true, timeout: 8000});
	}

	await page.waitForTimeout(300);

	await page.mouse.up();

	await page.waitForTimeout(SETTLE);
}

/**
 * Open a menu and click through to an application, as the step describes.
 *
 * Nothing is cached. The Site Menu lists the applications of the site the
 * browser is in, and a course moves between sites and between users, so a
 * menu read once is wrong for some steps however carefully it was read.
 */
export async function openMenu(
	page: Page,
	menuName: string,
	section: string | null,
	application: string
) {
	//
	// Tried again rather than given up on, which is what a reader does when a
	// menu does not open.
	//
	// Measured: the first test run after the instance restarts fails on the
	// Global Menu, and the same test passes when it runs eighth. The page
	// renders before the menu it carries is usable, and no readiness check on
	// the server side predicts it - so the recovery belongs here.
	//
	let failure: unknown;

	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			await reachApplication(page, menuName, section, application);

			return;
		}
		catch (error) {
			failure = error;

			await page.reload({timeout: 20000}).catch(() => undefined);

			await page
				.waitForLoadState('domcontentloaded', {timeout: 10000})
				.catch(() => undefined);

			await page.waitForTimeout(SETTLE);
		}
	}

	throw failure;
}

async function reachApplication(
	page: Page,
	menuName: string,
	section: string | null,
	application: string
) {
	const menu = MENUS[menuName];

	expect(menu, `there is no menu called "${menuName}"`).toBeTruthy();

	const panel = page.locator(menu.root).first();

	//
	// Opened only when closed. The Product Menu toggle keeps its state on the
	// server, so pressing it blindly closes a menu that was already open and
	// the applications vanish.
	//
	//
	// Confirmed open, and reopened if it is not.
	//
	// The toggle keeps its state on the server, so a stale state makes this
	// skip the click and search a menu that is shut - which reported the menu
	// as offering no such application. Intermittent, and it cost a test that
	// had been passing.
	//
	for (let attempt = 0; attempt < 3; attempt++) {
		if (await panel.isVisible().catch(() => false)) {
			break;
		}

		await page
			.locator(menu.trigger)
			.first()
			.click({timeout: 4000})
			.catch(() => undefined);

		await panel
			.waitFor({state: 'visible', timeout: 4000})
			.catch(() => undefined);
	}

	if (!(await panel.isVisible().catch(() => false))) {
		await page.locator(menu.trigger).first().click();

		await page.waitForTimeout(SETTLE);
	}

	if (section) {
		const heading = page
			.locator(
				`${menu.root} [role="button"]:has-text("${section}"), ` +
					`${menu.root} button:has-text("${section}"), ` +
					`${menu.root} a:has-text("${section}")`
			)
			.first();

		if ((await heading.count()) &&
			(await heading.getAttribute('aria-expanded')) !== 'true') {

			await heading.click();

			await page.waitForTimeout(SETTLE);
		}
	}

	//
	// When the lesson names no section, every tab is opened in turn until the
	// application appears. A menu's applications are split across tabs -
	// User Groups lives under Control Panel - so a phrasing like "the User
	// Groups application in the Global Menu", which never states a tab, finds
	// nothing while standing on the tab that happened to be showing.
	//
	//
	// Looked for where the menu is already standing, before going anywhere.
	//
	// Some applications are on the menu's own first screen - a site is, and
	// "Open the Global Menu and select Clarity Public Enterprise Website"
	// names one. Walking the sections first navigated away from the panel
	// holding exactly what was wanted.
	//
	if (
		!section &&
		!(await page
			.locator(`${menu.root} a:has-text("${application}")`)
			.count()
			.catch(() => 0))
	) {

		//
		// Each section is tried in turn, reopening the menu before every one.
		//
		// Clicking a Global Menu section closes the dropdown, so walking the
		// tabs in a single pass closes the menu on the first click and then
		// searches a screen with no menu on it. The sections are read once
		// while the panel is open, and the panel is reopened for each.
		//
		//
		// A section of this menu is a link, not a tab.
		//
		// Read from a running instance rather than assumed: the Global Menu
		// holds Applications, Commerce, CMS, Control Panel, and then the
		// sites. Looking for [role="tab"] found nothing at all, so the walk
		// had no sections to try and every unsectioned path failed.
		//
		// The two that hold administrative applications are tried first, so a
		// site link - which navigates away - is only reached if neither had
		// what the lesson named.
		//
		//
		// Only the sections that hold applications are tried.
		//
		// The rest of this menu is a list of sites, and clicking one
		// navigates into it: a walk that kept going ended up editing a
		// fragment in the Global site, several screens from anything the
		// lesson mentioned. Failing to find the application is a far better
		// outcome than wandering off into unrelated administration.
		//
		const SECTIONS = ['Control Panel', 'Applications', 'Commerce'];

		const found = (
			await page
				.locator(
					`${menu.root} a, ${menu.root} [role="tab"], ` +
						`${menu.root} [role="button"][aria-expanded]`
				)
				.allInnerTexts()
				.catch(() => [] as string[])
		)
			.map((name) => name.trim().split('\n')[0].trim())
			.filter((name) => name && (name !== application));

		const names = SECTIONS.filter((name) => found.includes(name));

		for (const name of names) {
			if (
				await page
					.locator(`a:text-is("${application}")`)
					.count()
					.catch(() => 0)
			) {
				break;
			}

			if (!(await panel.isVisible().catch(() => false))) {
				await page
					.locator(menu.trigger)
					.first()
					.click({timeout: 4000})
					.catch(() => undefined);

				await page.waitForTimeout(SETTLE);
			}

			//
			// Matched by substring, as the explicit-section path already
			// does. :text-is() compares raw text content, and these anchors
			// carry nested text besides their name, so an exact comparison
			// never matched and the click silently did nothing.
			//
			await page
				.locator(
					`${menu.root} a:has-text("${name}"), ` +
						`${menu.root} [role="tab"]:has-text("${name}"), ` +
						`${menu.root} [role="button"]:has-text("${name}")`
				)
				.first()
				.click({timeout: 4000})
				.catch(() => undefined);

			await page
				.waitForLoadState('domcontentloaded', {timeout: 8000})
				.catch(() => undefined);

			//
			// Waited for, not sampled. A section navigates to a new screen,
			// and asking once whether the application is on it answers no
			// while the screen is still arriving - so the walk moved on to
			// the next section and eventually into a site.
			//
			await page
				.locator(`a:text-is("${application}")`)
				.first()
				.waitFor({state: 'attached', timeout: 8000})
				.catch(() => undefined);
		}
	}

	//
	// Searched on the page, not inside the panel. Clicking a Global Menu
	// section closes the dropdown and renders that section's applications
	// elsewhere, so a search confined to the panel finds nothing every time.
	// The panel is still where the SECTION is found, because a section name
	// like "Design" is a common word that appears in many places.
	//
	const link = page
		.locator(`a:text-is("${application}")`)
		.or(page.locator(`${menu.root} a:has-text("${application}")`))
		.first();

	await expect(
		link,
		`the ${menuName} on this screen offers no application named "${application}"`
	).toHaveCount(1, {timeout: 8000});

	await link.click();

	//
		// Bounded, and allowed to fail. Liferay polls in the background, so
		// the network rarely goes quiet and an unbounded wait spends the
		// default thirty seconds on every single step.
		//
		await page
			.waitForLoadState('networkidle', {timeout: 4000})
			.catch(() => undefined);

	await page.waitForTimeout(SETTLE);
}

/**
 * Press the control a step names.
 *
 * Visible text first, accessible name second. Liferay renders its create
 * button as <a aria-label="Add Site">New</a>, and an aria-label REPLACES the
 * accessible name - so asking by role for "New" finds nothing while the word
 * New is printed on screen. A lesson writes what is printed.
 *
 * Cards count as controls: a template choice is a div carrying role="button"
 * with its name in a span inside it.
 *
 * Every frame, because the button submitting a modal is inside the modal.
 *
 * And the screen has to change. Playwright clicks whatever it is given,
 * including an inert span, and raises nothing - so "the click did not throw"
 * is not the same as "the step was performed".
 */
export async function press(page: Page, label: string, within?: string) {
	const before = await screenPrint(page);

	const escaped = label.replace(/"/g, '\\"');

	//
	// The row, card, or item the lesson named.
	//
	// "Click *Actions* for Christian Carter" names one row of a table where
	// every row has an Actions control. Dropping the qualifier and taking the
	// first match acted on whoever happened to be at the top - and because
	// something did open, every check downstream agreed it had worked. This
	// is the one defect class that produces a confidently wrong result rather
	// than a failure.
	//
	const inside = within ? within.replace(/"/g, '\\"') : null;

	//
	// page.frames() already includes the main frame, so listing the page
	// alongside it tried everything twice and doubled the time a miss costs.
	//
	//
	// Searched until it appears, not once.
	//
	// A control is queried the moment the previous step's screen changed,
	// which is before Liferay has finished rendering the one that replaced
	// it. locator.count() does not wait, so a control that arrives 300ms
	// later was reported as absent and the test blamed the lesson.
	//
	const deadline = Date.now() + FIND_TIMEOUT;

	let ambiguous = 0;

	let seen = false;

	while (Date.now() < deadline) {
	for (const frame of await scopesFor(page)) {
		//
		// Narrowed to the named row where one exists, and left alone where it
		// does not. A qualifier is not always a table row: "Reindex for All
		// Search Indexes" names a control in a panel, and refusing to act
		// because no <tr> carried that text broke a step that had been
		// working. The ambiguity check below is what guards the wrong click,
		// so falling back here costs nothing.
		//
		let scope: Locator | Frame = frame;

		if (inside) {
			//
			// The smallest thing on the screen that carries the name.
			//
			// A qualifier is not always a table row. "the Language button for
			// Name" names a field, and a field's own group is what holds both
			// the label and the button - so .form-group is tried before the
			// wider containers. Taking the last match takes the innermost,
			// because containers nest.
			//
			const container = frame
				.locator(
					`.form-group:has-text("${inside}"), ` +
						`fieldset:has-text("${inside}"), ` +
						`tr:has-text("${inside}"), [role="row"]:has-text("${inside}"), ` +
						`li:has-text("${inside}"), .list-group-item:has-text("${inside}"), ` +
						`.card:has-text("${inside}")`
				)
				.last();

			if (await container.count().catch(() => 0)) {
				scope = container;
			}
		}

		//
		// Exact text first, substring only as a fallback.
		//
		// :has-text() is a case-insensitive SUBSTRING that also matches
		// ancestors, and getByRole({exact: false}) is substring too. So
		// press('New') matched Newsletter and News, press('Add') matched
		// Address, press('ID') matched Video and Hidden - and the only guard,
		// that the screen changed, is satisfied by any of them. The corpus
		// uses labels this short: ID, HR, H2, Ok, link, Text, Page, Home.
		//
		// An exact match is what a lesson means when it prints a label.
		//
		//
		// Ordered by how precisely each identifies a control, and a pass that
		// matches more than one is refused rather than resolved with first().
		//
		// The accessible name comes first because the visible text does not
		// identify a control on its own: the Add User screen carries three
		// buttons reading "Select" - one for the image, one named "Select
		// Topic", one named "Select Tags". Taking the first match clicked the
		// wrong one, opened something, and the screen-changed check called
		// that success. A wrong click that passes is worse than a miss.
		//
		//
		// Every name this control might answer to: the one the lesson used,
		// then the ones the product uses for the same thing.
		//
		const names = [label, ...(LABEL_ALIASES[label] || [])];

		let byName = scope.getByRole('button', {exact: true, name: label});

		for (const name of names) {
			byName = byName
				.or(scope.getByRole('button', {exact: true, name}))
				.or(scope.getByRole('link', {exact: true, name}))
				.or(scope.getByRole('menuitem', {exact: true, name}))
				.or(scope.locator(`[aria-label="${name.replace(/"/g, '\\"')}"]`))
				.or(scope.locator(`[title="${name.replace(/"/g, '\\"')}"]`));
		}

		const candidates = [
			byName,
			scope.locator(
				`a:text-is("${escaped}"), button:text-is("${escaped}"), ` +
					`[role="menuitem"]:text-is("${escaped}"), ` +
					`[role="tab"]:text-is("${escaped}"), ` +
					`[role="button"]:text-is("${escaped}")`
			),
			//
			// A section of a page's configuration is a plain list item, not a
			// button, a tab, or a link - the SEO, Open Graph and Custom Meta
			// Tags sections are `.portlet-body li` in portal's own page
			// object. Nothing above could ever have matched one.
			//
			scope.locator(
				`.portlet-body li:text-is("${escaped}"), ` +
					`nav li:text-is("${escaped}"), ` +
					`[role="tablist"] li:text-is("${escaped}")`
			),
			scope
				.getByRole('button', {exact: false, name: label})
				.or(scope.getByRole('link', {exact: false, name: label}))
				.or(
					scope.locator(
						`a:has-text("${escaped}"), button:has-text("${escaped}"), ` +
							`[role="menuitem"]:has-text("${escaped}"), ` +
							`[role="tab"]:has-text("${escaped}"), ` +
							`[role="button"]:has-text("${escaped}")`
					)
				),
		];

		//
		// A control the reader operates rather than clicks.
		//
		// press() knew links, buttons, tabs and menu items only, so a
		// checkbox, radio, switch, or option of a select could not be reached
		// at all - and a lesson step naming one was reported as naming a
		// control that is not on the screen. Selecting a person from a picker
		// and choosing a redirect type are both this.
		//
		const toggle = scope
			.getByRole('checkbox', {exact: true, name: label})
			.or(scope.getByRole('radio', {exact: true, name: label}))
			.or(scope.getByRole('switch', {exact: true, name: label}));

		if ((await toggle.count().catch(() => 0)) === 1) {
			seen = true;

			try {
				await toggle.first().check({timeout: 4000});

				return;
			}
			catch (error) {
				// Fall through to the controls below.
			}
		}

		const chooser = scope
			.locator('select')
			.filter({has: scope.locator(`option:text-is("${escaped}")`)});

		if ((await chooser.count().catch(() => 0)) === 1) {
			seen = true;

			try {
				await chooser.first().selectOption({label});

				return;
			}
			catch (error) {
				// Fall through to the controls below.
			}
		}

		//
		// Counted among what the reader can actually see.
		//
		// Liferay keeps a dropdown in the DOM for every row of a table, so
		// "Impersonate User" matched eleven controls when exactly one menu
		// was open. Counting hidden copies made an unambiguous screen look
		// ambiguous and stopped a step that a reader performs without
		// hesitating.
		//
		let control: Locator | null = null;

		for (const candidate of candidates) {
			const shown: Locator[] = [];

			for (const element of await candidate.all().catch(() => [])) {
				if (await element.isVisible().catch(() => false)) {
					shown.push(element);
				}
			}

			if (shown.length === 1) {
				control = shown[0];

				break;
			}

			if (shown.length > 1) {
				ambiguous = shown.length;
			}
		}

		if (!control) {
			//
				// "Select Christian Carter" in a picker means tick the box in his
			// row. The box carries no name of its own - the name is in a cell
			// beside it - so no search by label can reach it, and the step read
			// as naming a control the screen does not have.
			//
			const rowBox = scope
				.locator(
					`tr:has-text("${escaped}"), [role="row"]:has-text("${escaped}"), ` +
						`li:has-text("${escaped}"), .list-group-item:has-text("${escaped}")`
				)
				.locator('input[type="checkbox"], [role="checkbox"]');

			const rowBoxes: Locator[] = [];

			for (const element of await rowBox.all().catch(() => [])) {
				if (await element.isVisible().catch(() => false)) {
					rowBoxes.push(element);
				}
			}

			if (rowBoxes.length === 1) {
				seen = true;

				try {
					await rowBoxes[0].check({timeout: 4000});

					return;
				}
				catch (error) {
					// Fall through to the controls below.
				}
			}
			continue;
		}

		//
		// A click that throws moves on to the next candidate rather than
		// being swallowed. Swallowing it left the screen unchanged and the
		// check below then blamed the control for not opening anything, when
		// the truth was that nothing had been clicked at all.
		//
		//
		// A matching control existed. Recorded before the click so that a
		// control which is present but unclickable is reported as exactly
		// that, rather than as absent - the two need opposite fixes, and
		// reporting both as "no control reading X" sent every one of them to
		// be investigated as a wrong label in the lesson.
		//
		seen = true;

		try {
			await control.scrollIntoViewIfNeeded({timeout: 2000});
		}
		catch (error) {
			// Not fatal: a control already in view needs no scrolling.
		}

		try {
			//
			// Bounded. A miss must be cheap: the default wait is thirty
			// seconds, and a handful of those exhausts the whole test's
			// budget before it reaches the step that matters.
			//
			await control.click({timeout: 4000});
		}
		catch (error) {
			//
			// A menu left standing over the control is the usual reason a
			// click cannot land. Opening the Site Menu to reach an
			// application leaves its panel covering the screen the
			// application rendered, so the very next step is blocked by the
			// menu that got it there.
			//
			// Closing it is what a reader does without noticing, and it is
			// done only after a click has actually failed - pressing Escape
			// at every step would shut the form the previous step opened.
			//
			if (!(await closeOpenMenus(page))) {
				continue;
			}

			try {
				await control.click({timeout: 4000});
			}
			catch (again) {
				continue;
			}
		}

		//
		// Bounded, and allowed to fail. Liferay polls in the background, so
		// the network rarely goes quiet and an unbounded wait spends the
		// default thirty seconds on every single step.
		//
		await page
			.waitForLoadState('networkidle', {timeout: 4000})
			.catch(() => undefined);

		//
		// Polled until the screen differs, rather than read once after a
		// fixed wait.
		//
		// Liferay navigates and renders in its own time, and a single reading
		// called a working click a failure: pressing New on Users and
		// Organizations opens Add User, and the check read the screen before
		// Add User had arrived. A change is proof as soon as it appears; the
		// absence of one is only proof once the waiting is done.
		//
		const deadline = Date.now() + CHANGE_TIMEOUT;

		let after = before;

		while (Date.now() < deadline) {
			after = await screenPrint(page);

			if (after !== before) {
				break;
			}

			await page.waitForTimeout(250);
		}

		//
		// A control that became selected counts as having worked, even where
		// the screen reads the same.
		//
		// Pressing a tab swaps one panel for another, and the two often carry
		// almost identical text - so comparing what the screen says reported
		// a working click as a click that did nothing. What the control says
		// about itself is the better evidence here.
		//
		const selected = await control
			.evaluate(
				(node) =>
					node.getAttribute('aria-selected') === 'true' ||
					node.getAttribute('aria-expanded') === 'true' ||
					node.classList.contains('active')
			)
			.catch(() => false);

		if (!selected) {
			expect(
				after,
				`"${label}" was pressed and nothing on the screen changed, so ` +
					`whatever it was meant to open did not open`
			).not.toBe(before);
		}

		return;
	}

		await page.waitForTimeout(250);
	}

	if (ambiguous && !seen) {
		throw new Error(
			`"${label}" matches ${ambiguous} controls on this screen, so which ` +
				`one the step means cannot be told from the label alone - the ` +
				`lesson needs to say which, as in "Select for the image"`
		);
	}

	throw new Error(
		seen
			? `"${label}" is on this screen but could not be clicked - it may ` +
				`be covered, disabled, or outside the visible area`
			: `no control reading or announcing "${label}" is on this screen`
	);
}

async function findDraggable(
	page: Page,
	name: string
): Promise<Locator | null> {
	const escaped = name.replace(/"/g, '\\"');

	for (const frame of page.frames()) {
		const candidate = frame
			.locator(
				`[draggable="true"]:has-text("${escaped}"), ` +
					`.page-editor__sidebar__fragment-card:has-text("${escaped}"), ` +
					`li:has-text("${escaped}")`
			)
			.first();

		if (await candidate.count().catch(() => 0)) {
			return candidate;
		}
	}

	return null;
}

async function findDropTarget(
	page: Page,
	name: string
): Promise<Locator | null> {
	const escaped = name.replace(/"/g, '\\"');

	for (const frame of page.frames()) {
		const candidate = frame
			.locator(
				`[class*="drop"]:has-text("${escaped}"), ` +
					`[class*="container"]:has-text("${escaped}"), ` +
					`[aria-label*="${escaped}"]`
			)
			.last()
			.or(frame.getByText(name, {exact: false}).last())
			.first();

		if (await candidate.count().catch(() => 0)) {
			return candidate;
		}
	}

	return null;
}

async function findField(page: Page, field: string): Promise<Locator | null> {
	//
	// Constrained to something that can actually hold text. Without this the
	// substring pass below returned labels and wrapper elements, and the fill
	// failed with "Element is not an <input>" while naming the right field.
	//
	const FILLABLE = 'input, textarea, select, [contenteditable="true"]';

	const quoted = field.replace(/"/g, '');

	//
	// Three passes, in order of how much they prove.
	//
	// 1. The accessible name, exactly. getByLabel({exact: false}) is a
	//    case-insensitive substring, so fill(page, 'name', ...) matched
	//    Username, Display Name, Template Name and Friendly URL Name - and
	//    then read that same wrong field back, so the verification agreed
	//    with itself.
	//
	// 2. The visible label. Liferay names some controls after their helper
	//    text rather than their label: the Description box on a user group
	//    announces itself as "Characters Maximum: 4000", so a reader looking
	//    at a field clearly labelled Description cannot be matched by name at
	//    all. The label is what the lesson saw, so the label is what this
	//    follows - to the first field after it in the document.
	//
	// 3. The accessible name as a substring, which is the old behaviour and
	//    the least trustworthy.
	//
	//
	// Retried for the same reason press() is: a form is queried as soon as
	// the screen carrying it changed, which is before its fields exist.
	//
	const deadline = Date.now() + FIND_TIMEOUT;

	while (Date.now() < deadline) {
	for (const pass of ['exact', 'label', 'loose']) {
		for (const frame of await scopesFor(page)) {
			let candidate: Locator;

			if (pass === 'label') {
				candidate = frame
					.locator(
						`xpath=//label[normalize-space(translate(normalize-space(.), "*", "")) = "${quoted}"]` +
							`/following::*[self::input or self::textarea or self::select][1]`
					)
					.first();
			}
			else {
				const exact = pass === 'exact';

				candidate = frame
					.getByLabel(field, {exact})
					.or(frame.getByPlaceholder(field, {exact}))
					.and(frame.locator(FILLABLE))
					.first();
			}

			if (await candidate.count().catch(() => 0)) {
				return candidate;
			}
		}
	}

		await page.waitForTimeout(250);
	}

	return null;
}

/** Close any menu panel standing over the screen. True if one was closed. */
async function closeOpenMenus(page: Page): Promise<boolean> {
	let closed = false;

	for (const menu of Object.values(MENUS)) {
		const panel = page.locator(menu.root).first();

		if (!(await panel.isVisible().catch(() => false))) {
			continue;
		}

		await page
			.locator(menu.trigger)
			.first()
			.click({timeout: 3000})
			.catch(() => undefined);

		await panel
			.waitFor({state: 'hidden', timeout: 3000})
			.catch(() => undefined);

		closed = true;
	}

	return closed;
}

/**
 * Where to look for a control, nearest the reader first.
 *
 * Liferay opens its create forms in a modal, and that modal is an iframe -
 * so the name box a step means is in the newest frame, while the page behind
 * it still has a search box that also answers to "Name". Searching the main
 * frame first typed the page's name into the filter behind the dialog,
 * pressed Add on a form nothing had filled, and reported the step done. The
 * exercise then finished green having created nothing.
 *
 * Frames are returned newest first because a modal's frame is added last, and
 * where a modal is open in a frame, that modal is returned ahead of the frame
 * that holds it. A reader cannot touch what is behind a dialog either.
 */
async function scopesFor(page: Page): Promise<Array<Locator | Frame>> {
	const scopes: Array<Locator | Frame> = [];

	for (const frame of [...page.frames()].reverse()) {
		const dialog = frame
			.locator('.modal.show, .modal.d-block, [role="dialog"]')
			.last();

		if (await dialog.isVisible().catch(() => false)) {
			scopes.push(dialog);
		}

		scopes.push(frame);
	}

	return scopes;
}

/** The address plus the shape of the visible text, as a cheap fingerprint. */
async function screenPrint(page: Page): Promise<string> {
	//
	// Retried rather than swallowed. "Execution context was destroyed" is
	// routine when a click starts a navigation, and answering '' for it made
	// the fingerprint differ from any real one - so the check that a click
	// changed the screen passed by construction exactly when the page was
	// busiest.
	//
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const shown = await page.evaluate(() => {
				const text = document.body ? document.body.innerText : '';

				return text.replace(/\s+/g, ' ').trim();
			});

			return `${page.url()}|${shown.length}|${shown.slice(0, 400)}`;
		}
		catch (error) {
			await page.waitForTimeout(300);
		}
	}

	//
	// Still unreadable after three tries. Naming it is better than returning
	// a value that would silently satisfy a comparison.
	//
	throw new Error('the screen could not be read to compare before and after');
}
