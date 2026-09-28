import {test} from '@playwright/test';

import {verifyHead} from '../../helpers/liferay';

const CALLS: Array<[any, Record<string, string>]> = [
	['title', {'title': 'Quality sunglasses for men and women, aviator, wayfarer and cat-eye'}],
	['meta', {'meta[name="description"]': 'This page contains quality sunglasses for men and women, aviator, wayfarer and cat-eye ', 'meta[name="keywords"]': 'quality sunglasess, aviator, wayfarer, cat-eye '}],
	['canonical', {}],
	['openGraph', {'meta[property="og:description"]': 'Explore our new collection of quality sunglasses: aviator, wayfarer, and cat-eye styles for men and women.', 'meta[property="og:image:alt"]': 'Collection of aviator, wayfarer, and cat-eye sunglasses.', 'meta[property="og:title"]': 'Discover Quality Sunglasses for Men and Women', 'meta[property="viewport"]': 'width=device-width, initial-scale=1'}],
];

for (const address of ['/web/clarity/home', '/web/clarity/quality-sunglasses']) {
	test(`verifyHead on ${address}`, async ({page}) => {
		await page.context().clearCookies();
		const response = await page.goto(address);
		console.log(`PROBE ${address} status ${response?.status()}`);
		for (const [kind, expected] of CALLS) {
			try {
				await verifyHead(page, kind, expected);
				console.log(`PROBE ${address} ${kind}: PASS`);
			}
			catch (error) {
				console.log(`PROBE ${address} ${kind}: FAIL ${String((error as Error).message).split('\n').slice(0, 4).join(' / ')}`);
			}
		}
	});
}
