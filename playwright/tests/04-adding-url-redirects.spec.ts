/**
 * Adding URL Redirects
 *
 * Generated from courses/latest/en/mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy.md.
 * Edit the lesson and regenerate; edits here are overwritten.
 *
 * A pass means nothing blocked a reader. It does not mean the
 * exercise built the right thing - nothing records what it should
 * build.
 */
import {test} from '@playwright/test';

import {addComponent, attach, choose, closeModal, download, enableSomeOptions, fill, fragmentOption, goHome, openFromPageTree, openMenu, openPageEditor, openPageSettings, press, pressKeys, reload, reorderMenu, selectInEditor, toggle, transfer, verifyHead, visitAsGuest, visitInNewBrowser, waitForReindex} from '../helpers/liferay';
import {CAPTURE, armCapture, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Adding URL Redirects', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Control Panel* tab, and clic
	await test.step('Step 1. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Control Panel* tab, and clic', async () => {
		await openMenu(page, 'Global Menu', 'Control Panel', 'System Settings');
	});

	// Step 2. Click *Pages* and go to the *Redirection* tab.
	await test.step('Step 2. Click *Pages* and go to the *Redirection* tab.', async () => {
		await press(page, 'Pages');
		await press(page, 'Redirection');
	});

	// Step 3. Check *Enabled* and click *Save*.
	await test.step('Step 3. Check *Enabled* and click *Save*.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/11.png']);
		await toggle(page, 'Enabled', true);
		await press(page, 'Save');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/11.png'});
	});

	// Step 4. Return to *Clarity Public Enterprise Website*.
	await test.step('Step 4. Return to *Clarity Public Enterprise Website*.', async () => {
		await goHome(page);
	});

	// Step 5. Open the *Site Menu* (![](../../images/icon-product-menu.png)), expand *Configuration*, and click *Redirection
	await test.step('Step 5. Open the *Site Menu* (![](../../images/icon-product-menu.png)), expand *Configuration*, and click *Redirection', async () => {
		await openMenu(page, 'Site Menu', 'Configuration', 'Redirection');
	});

	// Step 6. Go to the *404 URLs* tab.
	await test.step('Step 6. Go to the *404 URLs* tab.', async () => {
		await press(page, '404 URLs');
	});

	// Step 7. Open a new browser and go to [http://localhost:8080/web/clarity/qualitysunglasses](http://localhost:8080/web/c
	await test.step('Step 7. Open a new browser and go to [http://localhost:8080/web/clarity/qualitysunglasses](http://localhost:8080/web/c', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/12.png']);
		await visitInNewBrowser(page, 'http://localhost:8080/web/clarity/qualitysunglasses');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/12.png'});
	});

	// Step 8. Return to your previous browser window and refresh the page.
	await test.step('Step 8. Return to your previous browser window and refresh the page.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/13.png']);
		await reload(page);

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/13.png'});
	});

	// Step 9. Click *Actions* (![](../../images/icon-actions.png)) for the entry and select *Create Redirect*.
	await test.step('Step 9. Click *Actions* (![](../../images/icon-actions.png)) for the entry and select *Create Redirect*.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/14.png']);
		await press(page, 'Actions', 'entry', 'actions');
		await press(page, 'Create Redirect');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/14.png'});
	});

	// Step 10. For Destination URL, enter `http://localhost:8080/web/clarity/quality-sunglasses`.
	await test.step('Step 10. For Destination URL, enter `http://localhost:8080/web/clarity/quality-sunglasses`.', async () => {
		await fill(page, 'Destination URL', 'http://localhost:8080/web/clarity/quality-sunglasses');
	});

	// Step 11. For Type, select *Permanent (301)*.
	await test.step('Step 11. For Type, select *Permanent (301)*.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/15.png']);
		await press(page, 'Permanent (301)');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/15.png'});
	});

	// Step 12. Click *Create*.
	await test.step('Step 12. Click *Create*.', async () => {
		await press(page, 'Create');
	});

	// Step 13. Go to the *Aliases* tab and confirm the redirect appears.
	await test.step('Step 13. Go to the *Aliases* tab and confirm the redirect appears.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/16.png']);
		await press(page, 'Aliases');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/16.png'});
	});

	// Step 14. Go to [http://localhost:8080/web/clarity/qualitysunglasses](http://localhost:8080/web/clarity/qualitysunglasse
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.
	await test.step.skip('Step 14. Go to [http://localhost:8080/web/clarity/qualitysunglasses](http://localhost:8080/web/clarity/qualitysunglasse - not performed: no control or value named in this step', async () => {});

});
