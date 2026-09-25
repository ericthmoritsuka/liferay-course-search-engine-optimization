/**
 * Capturing a course screenshot from inside an exercise test.
 *
 * The shape of a shot - a name, the thing to highlight, what must be visible
 * first, what to mask - follows Abhner Ramos Barbosa's /screenshot-docs skill
 * (abhnerramos/liferay-learn pull request 191), as does the capture profile
 * and the finishing script this writes a sidecar for. A course image and a
 * documentation image are the same picture taken for a different article, so
 * they should not be captured two different ways.
 *
 * WHERE THE IMAGES GO. Into the lesson's own images folder inside a
 * liferay-learn clone, named for its position in the article: 01.png, 02.png.
 * The clone is named by LIFERAY_LEARN_DIR in .env.local, which stays out of
 * Git. Without it the images are written beside the tests instead, so a run
 * on a machine that has no liferay-learn still works and simply leaves them
 * somewhere obvious.
 *
 * WHY A SIDECAR. The highlight box is drawn after the capture, not in the
 * browser, so the raw image stays clean and the box can be moved or redrawn
 * without taking the picture again. This records the box; the finishing
 * script draws it.
 */
import {Locator, Page} from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * The published width the style guide asks for, captured at twice that so the
 * image survives being shown on a dense display.
 */
export const CAPTURE = {
	colorScheme: 'light' as const,
	deviceScaleFactor: 2,
	locale: 'en-US',
	viewport: {height: 800, width: 1280},
};

export type Shot = {
	/** Capture this element alone rather than the whole screen. */
	frame?: Locator;

	/** The thing the image is about. Its box is recorded for the highlight. */
	highlight?: Locator;

	/** Regions to hide before capturing: reference codes, ids, addresses. */
	mask?: Locator[];

	/** The article-relative path, for example `05-site-building/.../images/02.png`. */
	name: string;

	/** Must be visible before the shutter. A shot of a half-drawn screen is worse than none. */
	shows?: Locator[];
};

export async function capture(page: Page, shot: Shot) {
	const root = process.env.LIFERAY_LEARN_DIR;

	const target = root
		? path.join(root, 'courses/latest/en', shot.name)
		: path.join(process.cwd(), 'screenshots', shot.name);

	fs.mkdirSync(path.dirname(target), {recursive: true});

	//
	// Waited for, not assumed. A capture taken while a panel is still
	// arriving shows a reader something no reader sees, and it looks like a
	// successful shot.
	//
	for (const locator of shot.shows || []) {
		await locator.first().waitFor({state: 'visible', timeout: 15000});
	}

	//
	// Waited for before measuring. boundingBox() answers null for an element
	// that is present but not yet laid out, and a null box means no sidecar,
	// which means the finishing script silently draws no highlight - a
	// missing box looks exactly like a shot that never wanted one.
	//
	let box = null;

	if (shot.highlight) {
		const target = shot.highlight.first();

		await target.waitFor({state: 'visible', timeout: 10000}).catch(
			() => undefined);

		await target.scrollIntoViewIfNeeded().catch(() => undefined);

		box = await target.boundingBox().catch(() => null);

		if (!box) {
			throw new Error(
				`the highlight for ${shot.name} could not be measured, so the ` +
					`image would be published without the box it needs`);
		}
	}

	await (shot.frame ? shot.frame.first() : page).screenshot({
		mask: shot.mask,
		path: target,
	});

	//
	// The box in CSS pixels beside the image, for the finishing script. Its
	// own comment explains why it is drawn there and not here.
	//
	if (box) {
		fs.writeFileSync(
			`${target}.box.json`,
			JSON.stringify(
				{
					height: Math.round(box.height),
					width: Math.round(box.width),
					x: Math.round(box.x),
					y: Math.round(box.y),
				},
				null,
				1
			)
		);
	}
}
