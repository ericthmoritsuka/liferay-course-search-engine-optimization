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
const MENUS: Record<string, {root: string; trigger: string}> = {
	'Global Menu': {
		root: '.dropdown-menu.show',
		trigger:
			'[data-qa-id="globalMenu"], [data-testid="globalMenu"], ' +
			'[aria-label="Open Applications Menu"]',
	},
	'Site Menu': {
		root: '.product-menu',
		trigger:
			'[data-qa-id="productMenu"], ' +
			'[data-qa-id="sideNavigationToggler"], ' +
			'[aria-label="Open Product Menu"]',
	},
};

/** Long enough for a panel or dialog to arrive after the network goes quiet. */
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
export async function fill(page: Page, field: string, value: string) {
	const input = await findField(page, field);

	expect(
		input,
		`no field named "${field}" is on this screen, in any frame`
	).not.toBeNull();

	await input!.fill(value);

	await expect(
		input!,
		`the field "${field}" does not hold what was typed into it`
	).toHaveValue(value);
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
	const menu = MENUS[menuName];

	expect(menu, `there is no menu called "${menuName}"`).toBeTruthy();

	const panel = page.locator(menu.root).first();

	//
	// Opened only when closed. The Product Menu toggle keeps its state on the
	// server, so pressing it blindly closes a menu that was already open and
	// the applications vanish.
	//
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
	).toHaveCount(1, {timeout: 15000});

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
export async function press(page: Page, label: string) {
	const before = await screenPrint(page);

	const escaped = label.replace(/"/g, '\\"');

	//
	// page.frames() already includes the main frame, so listing the page
	// alongside it tried everything twice and doubled the time a miss costs.
	//
	for (const scope of page.frames()) {

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
		const exact = scope
			.locator(
				`a:text-is("${escaped}"), button:text-is("${escaped}"), ` +
					`[role="menuitem"]:text-is("${escaped}"), ` +
					`[role="tab"]:text-is("${escaped}"), ` +
					`[role="button"]:text-is("${escaped}")`
			)
			.or(scope.getByRole('button', {exact: true, name: label}))
			.or(scope.getByRole('link', {exact: true, name: label}))
			.first();

		const loose = scope
			.locator(
				`a:has-text("${escaped}"), button:has-text("${escaped}"), ` +
					`[role="menuitem"]:has-text("${escaped}"), ` +
					`[role="tab"]:has-text("${escaped}"), ` +
					`[role="button"]:has-text("${escaped}")`
			)
			.or(scope.getByRole('button', {exact: false, name: label}))
			.or(scope.getByRole('link', {exact: false, name: label}))
			.first();

		const control = (await exact.count().catch(() => 0)) ? exact : loose;

		if (!(await control.count().catch(() => 0))) {
			continue;
		}

		//
		// A click that throws moves on to the next candidate rather than
		// being swallowed. Swallowing it left the screen unchanged and the
		// check below then blamed the control for not opening anything, when
		// the truth was that nothing had been clicked at all.
		//
		try {
			//
			// Bounded. A miss must be cheap: the default wait is thirty
			// seconds, and a handful of those exhausts the whole test's
			// budget before it reaches the step that matters.
			//
			await control.click({timeout: 8000});
		}
		catch (error) {
			continue;
		}

		//
		// Bounded, and allowed to fail. Liferay polls in the background, so
		// the network rarely goes quiet and an unbounded wait spends the
		// default thirty seconds on every single step.
		//
		await page
			.waitForLoadState('networkidle', {timeout: 4000})
			.catch(() => undefined);

		await page.waitForTimeout(SETTLE);

		expect(
			await screenPrint(page),
			`"${label}" was pressed and nothing on the screen changed, so ` +
				`whatever it was meant to open did not open`
		).not.toBe(before);

		return;
	}

	throw new Error(
		`no control reading or announcing "${label}" is on this screen`
	);
}

async function findField(page: Page, field: string): Promise<Locator | null> {
	//
	// Exact label first, across every frame, before falling back to a
	// substring anywhere. getByLabel({exact: false}) is a case-insensitive
	// substring, so fill(page, 'name', ...) matched Username, Display Name,
	// Template Name and Friendly URL Name - and then read that same wrong
	// field back, so the verification agreed with itself.
	//
	for (const exact of [true, false]) {
		for (const frame of page.frames()) {
			const candidate = frame
				.getByLabel(field, {exact})
				.or(frame.getByPlaceholder(field, {exact}))
				.first();

			if (await candidate.count().catch(() => 0)) {
				return candidate;
			}
		}
	}

	return null;
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
