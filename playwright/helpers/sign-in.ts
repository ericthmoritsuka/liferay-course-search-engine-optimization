/**
 * Sign in as one of the course's Clarity users.
 *
 * Exercises are performed by different people on purpose - the site is built
 * by Walter Douglas, objects by Ian Miller, content by Christian Carter - and
 * a test that signs in as an administrator throughout proves the exercise
 * works for somebody the reader is not. Permissions are part of what a course
 * teaches, so they are part of what a test has to exercise.
 */
import {Page, expect} from '@playwright/test';

/**
 * The course's users, by the first name a lesson calls them. The password is
 * the same for all of them and the course README prints it, so there is no
 * secret here to keep out of the repository.
 */
export const USERS: Record<string, string> = {
	admin: 'admin@clarityvisionsolutions.com',
	christian: 'christian.carter@clarityvisionsolutions.com',
	clara: 'clara.murphy@clarityvisionsolutions.com',
	harper: 'harper.roberts@clarityvisionsolutions.com',
	ian: 'ian.miller@clarityvisionsolutions.com',
	sara: 'sara.abbey@clarityvisionsolutions.com',
	walter: 'walter.douglas@clarityvisionsolutions.com',
};

const PASSWORD = process.env.CLARITY_PASSWORD || 'learn';

/**
 * The page the course's exercises start from.
 *
 * Signing in lands wherever the instance sends you, which is not this
 * course's site - and the Site Menu lists the applications of the site the
 * browser is in, so a step saying "open the Site Menu and click Pages" finds
 * a menu belonging to somewhere else. Standing where the reader stands is
 * part of signing in as the reader.
 */
const HOME = process.env.COURSE_HOME || '/web/clarity/home';

export async function signIn(page: Page, who: string) {
	const emailAddress = USERS[who] || who;

	await page.goto('/c/portal/login');

	await page.getByLabel(/email|username/i).first().fill(emailAddress);

	await page.getByLabel(/password/i).first().fill(PASSWORD);

	//
	// Scoped to the sign-in form. An unscoped "submit" matched the search
	// box's button, which submits an empty search and leaves the reader
	// signed out while the step reports success.
	//
	await page
		.getByLabel(/password/i)
		.first()
		.locator('xpath=ancestor::form//button[@type="submit"]')
		.first()
		.click();

	await page
		.waitForLoadState('networkidle', {timeout: 4000})
		.catch(() => undefined);

	//
	// A wrong password returns the sign-in page with an error rather than an
	// exception, so the test has to look.
	//
	await expect(
		page.locator('text=/authentication failed|please enter a valid/i'),
		`signing in as ${emailAddress} was rejected`
	).toHaveCount(0);

	//
	// And proof that it worked, not just absence of a known error string.
	// The check above depends on Liferay's English wording; a localised
	// instance, or a rejection phrased any other way, would leave the browser
	// signed out as a guest while every later step blamed a missing control.
	// A signed-in session has a personal menu; a guest does not.
	//
	await expect(
		page.locator(
			'[data-qa-id="userMenu"], [aria-label*="user" i][aria-haspopup], ' +
				'.user-avatar, [data-qa-id="globalMenu"]'
		).first(),
		`signing in as ${emailAddress} appeared to work but the session is ` +
			`not signed in`
	).toBeVisible({timeout: 15000});

	await page.goto(HOME);

	await page
		.waitForLoadState('networkidle', {timeout: 4000})
		.catch(() => undefined);

	//
	// And that the course's home page is really where we landed.
	//
	// Liferay renders its 404 inside the Guest site rather than failing, and
	// the Guest site here is named after the same company - so a wrong
	// COURSE_HOME looks like a working instance whose every menu is missing
	// applications. One wrong character in a path was measured turning into
	// 21 separate "the Site Menu offers no application named X" failures, and
	// nothing in a run of 67 said the word 404 once.
	//
	await expect(
		page.locator('text=/^\\s*404\\s*$/').first(),
		`COURSE_HOME (${HOME}) is not a page on this instance, so the ` +
			`exercise would run against Liferay's 404 page in the Guest site`
	).toHaveCount(0);
}
