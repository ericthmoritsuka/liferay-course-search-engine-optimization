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

import {attach, fill, openMenu, openPageSettings, press, toggle} from '../helpers/liferay';
import {CAPTURE, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Using the Content Dashboard to Analyze Content', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Applications* tab, and click
	await openMenu(page, 'Global Menu', 'Applications', 'Content Dashboard');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/03.png'});

	// Step 2. Click *Configure* (![](../../images/icon-cog.png)) for the Content Chart.
	await press(page, 'Configure', 'Content Chart');

	// Step 3. Use the *left arrow* (![](../../images/icon-caret-left.png)) to remove the *Audience* and *Stage* vocabularies
	// Not performed: no control or value named in this step.

	// Step 4. Use the *right arrow* (![](../../images/icon-caret-right.png)) to add the *Job Positions* and *Region* vocabul
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 5. Click *Save* and close the modal window.
	await press(page, 'Save');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/05.png'});

	// Step 6. Scroll down to the Content List panel.
	// Not performed: no control or value named in this step.

	// Step 7. Click *Filter*, check *Author*, select *Walter Douglas*, and click *Select*.
	await press(page, 'Filter');
	await press(page, 'Author');
	await press(page, 'Walter Douglas');
	await press(page, 'Select');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/06.png'});

	// Step 8. Click *Export XLS* to download a spreadsheet report of Walter Douglas's content.
	await press(page, 'Export XLS');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/06-improving-claritys-seo-with-analytics-and-performance-metrics/00-improving-claritys-seo-with-analytics-and-performance-metrics/images/07.png'});

});
