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

import {fill, openMenu, press} from '../helpers/liferay';
import {CAPTURE, capture} from '../helpers/screenshot';
import {signIn} from '../helpers/sign-in';

//
// The style guide's display width, captured at twice it.
//
test.use(CAPTURE);

test('Verifying Your SEO Configuration', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. Begin editing the *Quality Sunglasses* page and click *Publish*.
	await press(page, 'Publish');

	// Step 2. Log out and go to the [http://localhost:8080/web/clarity/quality-sunglasses](http://localhost:8080/web/clarity
	// Not performed: no control or value named in this step.

	// Step 3. Right mouse click on the page and select *Inspect*.
	await press(page, 'Inspect');

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/06.png'});

	// Step 4. Use the browser's developer tools to expand the `<head>` tag and the `<title>` tag.
	// Not performed: no control or value named in this step.

	// Step 5. Verify the correct values appear for the title and meta tags.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.
	// Screenshot skipped: the step it belongs to was not performed.

	// Step 6. Verify the canonical `<link>` tags appear.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 7. Verify the Open Graph and custom `<meta>` tags appear.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

});
