/**
 * Configuring Open Graph and Custom Meta Tags
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

test('Configuring Open Graph and Custom Meta Tags', async ({page}) => {
	await signIn(page, 'admin');

	// Step 1. While configuring the Quality Sunglasses page, go to the *Open Graph* tab.
	// Not performed: no control or value named in this step.

	// Step 2. Enter these values:
	// Not performed: the step does not name a field and a value plainly enough.

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/04.png'});

	// Step 3. Preview your configuration.
	// Not performed: no control or value named in this step.

	await capture(page, {name: 'mastering-search-engine-optimization-with-liferay/04-implementing-claritys-seo-strategy/00-implementing-claritys-seo-strategy/images/05.png'});

	// Step 4. Click *Save*.
	await press(page, 'Save');

	// Step 5. Go to the *Custom Meta Tags* tab.
	// Not performed: no control or value named in this step.

	// Step 6. Enter these values:
	// Not performed: the step does not name a field and a value plainly enough.

	// Step 7. Click *Save*.
	await press(page, 'Save');

});
