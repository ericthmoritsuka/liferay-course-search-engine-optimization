/**
 * Enabling the Accessibility Menu
 *
 * Generated from courses/latest/en/mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics.md.
 * Edit the lesson and regenerate; edits here are overwritten.
 *
 * A pass means nothing blocked a reader. It does not mean the
 * exercise built the right thing - nothing records what it should
 * build.
 */
import {test} from '@playwright/test';

import {fill, openMenu, openPageSettings, press} from '../helpers/liferay';
import {CAPTURE, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Enabling the Accessibility Menu', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Open the *Site Menu* (![](../../images/icon-menu.png)), expand *Configuration*, and click *Site Settings*.
	await openMenu(page, 'Site Menu', 'Configuration', 'Site Settings');

	// Step 2. Click *Accessibility*, check *Enable Accessibility Menu*, and click *Update*.
	await press(page, 'Accessibility');
	await press(page, 'Enable Accessibility Menu');
	await press(page, 'Update');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/08.png'});

	// Step 3. Go to the *Home* page.
	await press(page, 'Home');

	// Step 4. Refresh the browser window and hit the Tab key twice.
	// Not performed: no control or value named in this step.

	// Step 5. Once the "Open Accessibility Menu" button appears, hit Enter or click it.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 6. Enable some of the options, close the menu, and verify the changes on the page.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

});
