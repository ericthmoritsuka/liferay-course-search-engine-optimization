/**
 * Using the Content Dashboard to Analyze Content
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

test('Using the Content Dashboard to Analyze Content', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Applications* tab, and click
	await test.step('Step 1. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Applications* tab, and click', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/03.png']);
		await openMenu(page, 'Global Menu', 'Applications', 'Content Dashboard');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/03.png'});
	});

	// Step 2. Click *Configure* (![](../../images/icon-cog.png)) for the Content Chart.
	await test.step('Step 2. Click *Configure* (![](../../images/icon-cog.png)) for the Content Chart.', async () => {
		await press(page, 'Configure', 'Content Chart', 'cog');
	});

	// Step 3. Use the *left arrow* (![](../../images/icon-caret-left.png)) to remove the *Audience* and *Stage* vocabularies
	await test.step('Step 3. Use the *left arrow* (![](../../images/icon-caret-left.png)) to remove the *Audience* and *Stage* vocabularies', async () => {
		await transfer(page, 'left', ['Audience', 'Stage']);
	});

	// Step 4. Use the *right arrow* (![](../../images/icon-caret-right.png)) to add the *Job Positions* and *Region* vocabul
	await test.step('Step 4. Use the *right arrow* (![](../../images/icon-caret-right.png)) to add the *Job Positions* and *Region* vocabul', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/04.png']);
		await transfer(page, 'right', ['Job Positions', 'Region']);

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/04.png'});
	});

	// Step 5. Click *Save* and close the modal window.
	await test.step('Step 5. Click *Save* and close the modal window.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/05.png']);
		await press(page, 'Save');
		await closeModal(page);

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/05.png'});
	});

	// Step 6. Scroll down to the Content List panel.
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 6. Scroll down to the Content List panel. - not performed: no control or value named in this step', async () => {});

	// Step 7. Click *Filter*, check *Author*, select *Walter Douglas*, and click *Select*.
	await test.step('Step 7. Click *Filter*, check *Author*, select *Walter Douglas*, and click *Select*.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/06.png']);
		await press(page, 'Filter');
		await toggle(page, 'Author', true);
		await press(page, 'Walter Douglas');
		await press(page, 'Select');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/06.png'});
	});

	// Step 8. Click *Export XLS* to download a spreadsheet report of Walter Douglas's content.
	await test.step('Step 8. Click *Export XLS* to download a spreadsheet report of Walter Douglas\'s content.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/07.png']);
		await download(page, 'Export XLS');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/07.png'});
	});

});
