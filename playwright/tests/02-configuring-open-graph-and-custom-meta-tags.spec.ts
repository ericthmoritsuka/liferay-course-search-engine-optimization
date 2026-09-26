/**
 * Configuring Open Graph and Custom Meta Tags
 *
 * Generated from courses/latest/en/mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy.md.
 * Edit the lesson and regenerate; edits here are overwritten.
 *
 * A pass means nothing blocked a reader. It does not mean the
 * exercise built the right thing - nothing records what it should
 * build.
 */
import {test} from '@playwright/test';

import {attach, fill, goHome, openMenu, openPageEditor, openPageSettings, press, toggle, verifyHead, visitAsGuest, visitInNewBrowser} from '../helpers/liferay';
import {CAPTURE, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Configuring Open Graph and Custom Meta Tags', async ({page}) => {
	await signIn(page, 'admin');

	//
	// This exercise continues from the one before it, which left a
	// screen open that a fresh browser does not have.
	//
	await openPageSettings(page, 'Quality Sunglasses');

	// Step 1. While configuring the Quality Sunglasses page, go to the *Open Graph* tab.
	await press(page, 'Open Graph');

	// Step 2. Enter these values:
	await attach(page, 'Image', 'liferay-course-search-engine-optimization/exercises/quality-sunglasses-01.jpeg');
	await toggle(page, 'Use Custom Title', true);
	await toggle(page, 'Use Custom Description', true);
	await fill(page, 'Image Alt Description', 'Collection of aviator, wayfarer, and cat-eye sunglasses.', {section: 'Settings'});
	await fill(page, 'Custom Title', 'Discover Quality Sunglasses for Men and Women', {section: 'Settings'});
	// Not entered: Settings > Custom Description - chosen from a control rather than typed.

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/04.png'});

	// Step 3. Preview your configuration.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 4. Click *Save*.
	await press(page, 'Save');

	// Step 5. Go to the *Custom Meta Tags* tab.
	await press(page, 'Custom Meta Tags');

	// Step 6. Enter these values:
	await fill(page, 'Property', 'viewport', {section: 'Settings'});
	await fill(page, 'Content', 'width=device-width, initial-scale=1', {section: 'Settings'});

	// Step 7. Click *Save*.
	await press(page, 'Save');

});
