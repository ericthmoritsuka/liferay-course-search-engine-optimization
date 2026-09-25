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

import {fill, openMenu, press} from '../helpers/liferay';
import {signIn} from '../helpers/sign-in';

test('Adding URL Redirects', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Control Panel* tab, and clic
	await openMenu(page, 'Global Menu', 'Control Panel', 'System Settings');

	// Step 2. Click *Pages* and go to the *Redirection* tab.
	await press(page, 'Pages');
	await press(page, 'Redirection');

	// Step 3. Check *Enabled* and click *Save*.
	await press(page, 'Enabled');
	await press(page, 'Save');

	// Step 4. Return to *Clarity Public Enterprise Website*.
	// Not performed: no control or value named in this step.

	// Step 5. Open the *Site Menu* (![](../../images/icon-product-menu.png)), expand *Configuration*, and click *Redirection
	await openMenu(page, 'Site Menu', 'Configuration', 'Redirection');

	// Step 6. Go to the *404 URLs* tab.
	// Not performed: no control or value named in this step.

	// Step 7. Open a new browser and go to [http://localhost:8080/web/clarity/qualitysunglasses](http://localhost:8080/web/c
	// Not performed: no control or value named in this step.

	// Step 8. Return to your previous browser window and refresh the page.
	// Not performed: no control or value named in this step.

	// Step 9. Click *Actions* (![](../../images/icon-actions.png)) for the entry and select *Create Redirect*.
	await press(page, 'Actions');
	await press(page, 'Create Redirect');

	// Step 10. For Destination URL, enter `http://localhost:8080/web/clarity/quality-sunglasses`.
	await fill(page, 'Destination URL', 'http://localhost:8080/web/clarity/quality-sunglasses');

	// Step 11. For Type, select *Permanent (301)*.
	await press(page, 'Permanent (301)');

	// Step 12. Click *Create*.
	await press(page, 'Create');

	// Step 13. Go to the *Aliases* tab and confirm the redirect appears.
	// Not performed: no control or value named in this step.

	// Step 14. Go to [http://localhost:8080/web/clarity/qualitysunglasses](http://localhost:8080/web/clarity/qualitysunglasse
	// Not performed: no control or value named in this step.

});
