/**
 * Verifying Your SEO Configuration
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
import {CAPTURE, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Verifying Your SEO Configuration', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Begin editing the *Quality Sunglasses* page and click *Publish*.
	await openPageEditor(page, 'Quality Sunglasses');
	await press(page, 'Publish');

	// Step 2. Log out and go to the [http://localhost:8080/web/clarity/quality-sunglasses](http://localhost:8080/web/clarity
	await visitAsGuest(page, 'http://localhost:8080/web/clarity/quality-sunglasses');

	// Step 3. Right mouse click on the page and select *Inspect*.
	// Not performed: this step uses the browser's own developer tools, which a page cannot open.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 4. Use the browser's developer tools to expand the `<head>` tag and the `<title>` tag.
	// Not performed: this step uses the browser's own developer tools, which a page cannot open.

	// Step 5. Verify the correct values appear for the title and meta tags.
	await verifyHead(page, 'title', {'title': 'Quality sunglasses for men and women, aviator, wayfarer and cat-eye'});
	await verifyHead(page, 'meta', {'meta[name="description"]': 'This page contains quality sunglasses for men and women, aviator, wayfarer and cat-eye ', 'meta[name="keywords"]': 'quality sunglasess, aviator, wayfarer, cat-eye '});

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/07.png'});

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/08.png'});

	// Step 6. Verify the canonical `<link>` tags appear.
	await verifyHead(page, 'canonical', {'link[rel="alternate"][hreflang="es-ES"]': '/es/gafas-sol-calidad', 'link[rel="canonical"]': '/quality-sunglasses'});

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/09.png'});

	// Step 7. Verify the Open Graph and custom `<meta>` tags appear.
	await verifyHead(page, 'openGraph', {'meta[property="og:description"]': 'Explore our new collection of quality sunglasses: aviator, wayfarer, and cat-eye styles for men and women.', 'meta[property="og:image:alt"]': 'Collection of aviator, wayfarer, and cat-eye sunglasses.', 'meta[property="og:title"]': 'Discover Quality Sunglasses for Men and Women', 'meta[property="viewport"]': 'width=device-width, initial-scale=1'});
	await verifyHead(page, 'meta', {'meta[name="description"]': 'This page contains quality sunglasses for men and women, aviator, wayfarer and cat-eye ', 'meta[name="keywords"]': 'quality sunglasess, aviator, wayfarer, cat-eye '});

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/10.png'});

});
