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
	await press(page, 'Open Graph');

	// Step 2. Enter these values:
	// Not entered: Settings > Image, Settings > Image Alt Description, Settings > Use Custom Title, Settings > Custom Title, Settings > Use Custom Description, Settings > Custom Description - inside a panel or a language this cannot address yet.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 3. Preview your configuration.
	// Not performed: no control or value named in this step.

	// Screenshot skipped: the step it belongs to was not performed.

	// Step 4. Click *Save*.
	await press(page, 'Save');

	// Step 5. Go to the *Custom Meta Tags* tab.
	await press(page, 'Custom Meta Tags');

	// Step 6. Enter these values:
	// Not entered: Settings > Property, Settings > Property > Content - inside a panel or a language this cannot address yet.

	// Step 7. Click *Save*.
	await press(page, 'Save');

});
