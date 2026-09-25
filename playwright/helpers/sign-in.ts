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

	await page.goto(HOME);

	await page
		.waitForLoadState('networkidle', {timeout: 4000})
		.catch(() => undefined);
}
