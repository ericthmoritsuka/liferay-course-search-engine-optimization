/**
 * Using Page Audit and Page Speed Insights
 *
 * Generated from courses/latest/en/mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics.md.
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

test('Using Page Audit and Page Speed Insights', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Sign in as the Clarity Admin user.
	// Not performed: no control or value named in this step.

	// Step 2. Go to the *Home* page.
	await press(page, 'Home');

	// Step 3. Click Page Audit (![Page Audit](../../images/icon-page-audit-tool.png)) in the Application Bar.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 4. In the Performance tab, review all load times and mouse over each element to highlight it in the page.
	// Not performed: no control or value named in this step.

	// Step 5. Go to the *PageSpeed Insights* tab.
	await press(page, 'PageSpeed Insights');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/02.png'});

});
