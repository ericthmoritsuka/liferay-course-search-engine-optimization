/**
 * Setting Up the Clarity Workspace
 *
 * Generated from courses/latest/en/mastering-search-engine-optimization-with-liferay/02-course-environment-setup/00-course-environment-setup.md.
 * Edit the lesson and regenerate; edits here are overwritten.
 *
 * A pass means nothing blocked a reader. It does not mean the
 * exercise built the right thing - nothing records what it should
 * build.
 */
import {test} from '@playwright/test';

import {attach, closeModal, download, enableSomeOptions, fill, goHome, openMenu, openPageEditor, openPageSettings, press, pressKeys, reload, toggle, transfer, verifyHead, visitAsGuest, visitInNewBrowser, waitForReindex} from '../helpers/liferay';
import {CAPTURE, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Setting Up the Clarity Workspace', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Open your terminal and run this command according to your operating system:
	// Not performed: this step is done at a terminal, not in a browser.

	// Screenshot skipped: the step it belongs to was not performed.
	await test.step.skip('Step 1. Open your terminal and run this command according to your operating system: - not performed: this step is done at a terminal, not in a browser', async () => {});

	// Step 2. Once the "Liferay bundle initialized" message displays, verify the `liferay-course-search-engine-optimization/
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 2. Once the "Liferay bundle initialized" message displays, verify the `liferay-course-search-engine-optimization/ - not performed: no control or value named in this step', async () => {});

	// Step 3. Go to the workspace's root folder in your terminal:
	// Not performed: this step is done at a terminal, not in a browser.
	await test.step.skip('Step 3. Go to the workspace\'s root folder in your terminal: - not performed: this step is done at a terminal, not in a browser', async () => {});

	// Step 4. Run this command to start the Liferay server:
	// Not performed: this step is done at a terminal, not in a browser.
	await test.step.skip('Step 4. Run this command to start the Liferay server: - not performed: this step is done at a terminal, not in a browser', async () => {});

	// Step 5. Verify the "Tomcat started" message appears.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.
	await test.step.skip('Step 5. Verify the "Tomcat started" message appears. - not performed: no control or value named in this step', async () => {});

	// Step 6. Access your Liferay DXP instance by going to [localhost:8080](http://localhost:8080/) in your browser.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.
	await test.step.skip('Step 6. Access your Liferay DXP instance by going to [localhost:8080](http://localhost:8080/) in your browser. - not performed: no control or value named in this step', async () => {});

	// Step 7. Sign in using these credentials:
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 7. Sign in using these credentials: - not performed: no control or value named in this step', async () => {});

	// Step 8. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Control Panel* tab, and clic
	await test.step('Step 8. Open the *Global Menu* (![](../../images/icon-applications-menu.png)), go to the *Control Panel* tab, and clic', async () => {
		await openMenu(page, 'Global Menu', 'Control Panel', 'Search');
	});

	// Step 9. Go to the *Index Actions* tab and click *Reindex* for All Search Indexes.
	await test.step('Step 9. Go to the *Index Actions* tab and click *Reindex* for All Search Indexes.', async () => {
		await press(page, 'Index Actions');
		await press(page, 'Reindex', 'All Search Indexes');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/02-course-environment-setup/00-course-environment-setup/images/04.png'});
	});

	// Step 10. When prompted, click *Execute* to confirm.
	await test.step('Step 10. When prompted, click *Execute* to confirm.', async () => {
		await press(page, 'Execute');
		await waitForReindex(page);
	});

	// Step 11. Take some time to explore the site and resources included in the training workspace.
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 11. Take some time to explore the site and resources included in the training workspace. - not performed: no control or value named in this step', async () => {});

});
