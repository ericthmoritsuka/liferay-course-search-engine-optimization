import {test} from '@playwright/test';

import {press} from '../../helpers/liferay';
import {signIn} from '../../helpers/sign-in';

test('page audit tab DOM', async ({page}) => {
	await signIn(page, 'admin');
	console.log(`PROBE landed ${page.url()}`);
	const panelOpen = await page.locator('text=Page Audit').first().isVisible().catch(() => false);
	console.log(`PROBE page audit panel visible before step 3: ${panelOpen}`);
	if (!panelOpen) { console.log('PROBE panel closed; not opening it'); return; }
	const inspect = () => page.evaluate(() => {
		const tabs = [...document.querySelectorAll('[role="tab"]')].map((t) => ({
			text: (t as HTMLElement).innerText.trim(), tag: t.tagName, sel: t.getAttribute('aria-selected'), controls: t.getAttribute('aria-controls'),
		}));
		const ids = ['tabpanel-0', 'tabpanel-1'].map((id) => {
			const all = document.querySelectorAll(`[id="${id}"]`);
			const el = document.getElementById(id) as HTMLElement | null;
			return {id, count: all.length, cls: el?.className, opacity: el ? getComputedStyle(el).opacity : null, shown: el ? el.offsetParent !== null : null, text: el?.innerText.trim().slice(0, 120)};
		});
		return {tabs, ids};
	});
	console.log(`PROBE after Page Audit: ${JSON.stringify(await inspect())}`);
	await press(page, 'PageSpeed Insights');
	console.log(`PROBE after PageSpeed: ${JSON.stringify(await inspect())}`);
	const configure = page.getByRole('link', {name: 'Configure', exact: true});
	console.log(`PROBE Configure link visible: ${await configure.isVisible().catch(() => false)} href=${await configure.getAttribute('href').catch(() => null)}`);
});
