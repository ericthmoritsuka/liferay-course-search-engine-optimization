import {test} from '@playwright/test';

import {enableSomeOptions, verifyHead} from '../../helpers/liferay';

const CANONICAL = {'link[rel="alternate"][hreflang="es-ES"]': '/es/gafas-sol-calidad', 'link[rel="canonical"]': '/quality-sunglasses'};

async function outcome(tag: string, fn: () => Promise<unknown>) {
	try {
		await fn();
		console.log(`[${tag}] PASSED`);
	}
	catch (error) {
		console.log(`[${tag}] FAILED: ${String(error).split('\n')[0].slice(0, 150)}`);
	}
}

test('canonical control', async ({page}) => {
	await page.goto('/web/clarity/home');
	await outcome('canonical on home (expect FAILED)', () => verifyHead(page, 'canonical', CANONICAL));
	await page.goto('/web/clarity/quality-sunglasses');
	await outcome('canonical on quality-sunglasses (expect PASSED)', () => verifyHead(page, 'canonical', CANONICAL));
});

async function openMenu(page) {
	await page.goto('/web/clarity/home');
	await page.waitForLoadState('networkidle', {timeout: 8000}).catch(() => undefined);
	await page.waitForTimeout(2000);
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await page.getByRole('dialog').first().waitFor({timeout: 10000});
}

test('options control: classes blocked', async ({page}) => {
	await openMenu(page);
	await page.evaluate(() => {
		const add = DOMTokenList.prototype.add;
		DOMTokenList.prototype.add = function (...names: string[]) {
			return add.apply(this, names.filter((n) => !n.startsWith('c-prefers')));
		};
		const toggle = DOMTokenList.prototype.toggle;
		DOMTokenList.prototype.toggle = function (name: string, force?: boolean) {
			return name.startsWith('c-prefers') ? false : toggle.call(this, name, force);
		};
	});
	await outcome('options with classes blocked (expect FAILED)', () => enableSomeOptions(page));
});

test('options control: real', async ({page}) => {
	await openMenu(page);
	await outcome('options real (expect PASSED)', () => enableSomeOptions(page));
});
