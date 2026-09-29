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

import {addComponent, attach, choose, closeModal, download, enableSomeOptions, fill, fragmentOption, goHome, openFromPageTree, openMenu, openPageEditor, openPageSettings, press, pressKeys, reload, reorderMenu, selectInEditor, toggle, transfer, verifyHead, visitAsGuest, visitInNewBrowser, waitForReindex} from '../helpers/liferay';
import {CAPTURE, armCapture, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Using Page Audit and Page Speed Insights', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Sign in as the Clarity Admin user.
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 1. Sign in as the Clarity Admin user. - not performed: no control or value named in this step', async () => {});

	// Step 2. Go to the *Home* page.
	await test.step('Step 2. Go to the *Home* page.', async () => {
		await goHome(page);
	});

	// Step 3. Click Page Audit (![Page Audit](../../images/icon-page-audit-tool.png)) in the Application Bar.
	await test.step('Step 3. Click Page Audit (![Page Audit](../../images/icon-page-audit-tool.png)) in the Application Bar.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/01.png']);
		await press(page, 'Page Audit');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/01.png'});
	});

	// Step 4. In the Performance tab, review all load times and mouse over each element to highlight it in the page.
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 4. In the Performance tab, review all load times and mouse over each element to highlight it in the page. - not performed: no control or value named in this step', async () => {});

	// Step 5. Go to the *PageSpeed Insights* tab.
	await test.step('Step 5. Go to the *PageSpeed Insights* tab.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/02.png']);
		await press(page, 'PageSpeed Insights');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/02.png'});
	});

});
