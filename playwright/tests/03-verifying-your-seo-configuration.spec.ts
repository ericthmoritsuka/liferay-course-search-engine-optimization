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

import {attach, fill, goHome, openMenu, openPageEditor, openPageSettings, press, toggle, verifyHead, visitAsGuest, visitInNewBrowser} from '../helpers/liferay';
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
	await verifyHead(page, 'title');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/07.png'});

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/08.png'});

	// Step 6. Verify the canonical `<link>` tags appear.
	await verifyHead(page, 'canonical');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/09.png'});

	// Step 7. Verify the Open Graph and custom `<meta>` tags appear.
	await verifyHead(page, 'openGraph');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/10.png'});

});
