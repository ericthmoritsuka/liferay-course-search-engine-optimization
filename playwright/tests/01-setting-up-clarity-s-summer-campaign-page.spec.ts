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

import {attach, closeModal, download, enableSomeOptions, fill, goHome, openMenu, openPageEditor, openPageSettings, press, pressKeys, reload, toggle, transfer, verifyHead, visitAsGuest, visitInNewBrowser, waitForReindex} from '../helpers/liferay';
import {CAPTURE, armCapture, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Setting Up Clarity\'s Summer Campaign Page', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Sign in as the Clarity Admin user.
	// Not performed: no control or value named in this step.
	await test.step.skip('Step 1. Sign in as the Clarity Admin user. - not performed: no control or value named in this step', async () => {});

	// Step 2. Open the *Site Menu* (![](../../images/icon-product-menu.png)), expand *Site Builder*, and click *Pages*.
	await test.step('Step 2. Open the *Site Menu* (![](../../images/icon-product-menu.png)), expand *Site Builder*, and click *Pages*.', async () => {
		await openMenu(page, 'Site Menu', 'Site Builder', 'Pages');
	});

	// Step 3. Click *New*, select *Primary Master Page*, enter `Quality Sunglasses` for name, and click *Add*.
	await test.step('Step 3. Click *New*, select *Primary Master Page*, enter `Quality Sunglasses` for name, and click *Add*.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/01.png']);
		await press(page, 'New');
		await press(page, 'Primary Master Page');
		await fill(page, 'name', 'Quality Sunglasses');
		await press(page, 'Add');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/01.png'});
	});

	// Step 4. Click *Actions* (![](../../images/icon-actions.png)) in the Application Bar and select *Configure*.
	await test.step('Step 4. Click *Actions* (![](../../images/icon-actions.png)) in the Application Bar and select *Configure*.', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/02.png']);
		await press(page, 'Actions', undefined, 'actions');
		await press(page, 'Configure');

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/02.png'});
	});

	// Step 5. In the General tab, click the *Language* button for Name, select *es-ES*, and set these values:
	await test.step('Step 5. In the General tab, click the *Language* button for Name, select *es-ES*, and set these values:', async () => {
		await press(page, 'Language', 'Name');
		await press(page, 'es-ES');
		await fill(page, 'Name', 'Gafas de sol de calidad', {language: 'Spanish', section: 'Basic Info'});
		await fill(page, 'Friendly URL', '/gafas-sol-calidad', {language: 'Spanish', section: 'URL'});
	});

	// Step 6. Click *Save*.
	await test.step('Step 6. Click *Save*.', async () => {
		await press(page, 'Save');
	});

	// Step 7. Go to the *SEO* tab and set these values:
	await test.step('Step 7. Go to the *SEO* tab and set these values:', async () => {
		await armCapture(page, ['mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/03.png']);
		await press(page, 'SEO');
		await fill(page, 'HTML Title', 'Quality sunglasses for men and women, aviator, wayfarer and cat-eye', {language: 'English', section: 'Settings'});
		await fill(page, 'HTML Title', 'Gafas de sol de calidad para hombre y mujer, aviador, wayfarer y cat-eye', {language: 'Spanish', section: 'Settings'});
		await fill(page, 'Description', 'This page contains quality sunglasses for men and women, aviator, wayfarer and cat-eye ', {language: 'English', section: 'Settings'});
		await fill(page, 'Description', 'Esta página contiene gafas de sol de calidad para hombre y mujer, aviador, wayfarer y cat-eye', {language: 'Spanish', section: 'Settings'});
		await fill(page, 'Keywords', 'quality sunglasess, aviator, wayfarer, cat-eye ', {language: 'English', section: 'Settings'});
		await fill(page, 'Keywords', 'gafas de sol de calidad, aviador, wayfarer, cat-eye', {language: 'Spanish', section: 'Settings'});

		await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/03.png'});
	});

	// Step 8. Keep the other default values and click *Save*.
	await test.step('Step 8. Keep the other default values and click *Save*.', async () => {
		await press(page, 'Save');
	});

});
