/**
 * Setting Up Clarity's Summer Campaign Page
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

test('Setting Up Clarity\'s Summer Campaign Page', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Sign in as the Clarity Admin user.
	// Not performed: no control or value named in this step.

	// Step 2. Open the *Site Menu* (![](../../images/icon-product-menu.png)), expand *Site Builder*, and click *Pages*.
	await openMenu(page, 'Site Menu', 'Site Builder', 'Pages');

	// Step 3. Click *New*, select *Primary Master Page*, enter `Quality Sunglasses` for name, and click *Add*.
	await press(page, 'New');
	await press(page, 'Primary Master Page');
	await press(page, 'Add');

	// Step 4. Click *Actions* (![](../../images/icon-actions.png)) in the Application Bar and select *Configure*.
	await press(page, 'Actions');
	await press(page, 'Configure');

	// Step 5. In the General tab, click the *Language* button for Name, select *es-ES*, and set these values:
	await press(page, 'Language');
	await press(page, 'es-ES');

	// Step 6. Click *Save*.
	await press(page, 'Save');

	// Step 7. Go to the *SEO* tab and set these values:
	// Not performed: no control or value named in this step.

	// Step 8. Keep the other default values and click *Save*.
	await press(page, 'Save');

});
