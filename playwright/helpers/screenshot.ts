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

//
// Candidates for replicating a lesson's own screenshot, taken only when
// REPLICATE_DIR is set.
//
// A lesson image shows one moment - often the open menu before the click the
// step ends with, not the screen after it - and one frame, cropped and zoomed
// by whoever took it. Rather than guess the moment, every action in a step
// that has an image records the full screen before and after itself, and
// replicate.py afterwards picks the candidate the lesson image matches, finds
// its frame inside it, and crops the replica. With REPLICATE_DIR unset, none
// of this runs.
//
const REPLICATE_DIR = process.env.REPLICATE_DIR;

const armed = new WeakMap<Page, {folder: string; names: string[]; seq: number}>();

/** Start recording candidates for the images this step's lesson shows. */
export async function armCapture(page: Page, names: string[]) {
	if (!REPLICATE_DIR || !names.length) {
		return;
	}

	const folder = path.join(REPLICATE_DIR, names[0].replace(/\.png$/, ''));

	fs.mkdirSync(folder, {recursive: true});

	fs.writeFileSync(
		path.join(folder, 'images.json'),
		JSON.stringify({names}, null, 1)
	);

	armed.set(page, {folder, names, seq: 0});

	await candidate(page, 'start of step');
}

/** One candidate: the whole screen, as it is now. */
export async function candidate(page: Page, tag: string) {
	const state = armed.get(page);

	if (!REPLICATE_DIR || !state) {
		return;
	}

	state.seq += 1;

	//
	// Settled first. An action returns before what it opened has finished
	// drawing, and a candidate taken at once showed the Index Actions list
	// without its Reindex buttons - the right screen, not yet the lesson's.
	//
	await page
		.waitForLoadState('networkidle', {timeout: 3000})
		.catch(() => undefined);

	await page.waitForTimeout(400);

	const slug = tag
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 50);

	await page
		.screenshot({
			path: path.join(
				state.folder,
				`${String(state.seq).padStart(2, '0')}-${slug}.png`
			),
		})
		.catch(() => undefined);
}

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

	const base = root
		? path.resolve(root, 'courses/latest/en')
		: path.resolve(process.cwd(), 'screenshots');

	const target = path.resolve(base, shot.name);

	//
	// Contained. path.join resolves "..", and the generator builds this name
	// with os.path.relpath, which emits "../.." for any lesson that is not
	// under courses/latest/en - so a scenario exported from a docs article or
	// with an absolute path would send every capture in the run outside the
	// tree, overwriting whatever it landed on.
	//
	if (target !== base && !target.startsWith(base + path.sep)) {
		throw new Error(
			`the screenshot name "${shot.name}" resolves outside ${base}`
		);
	}

	//
	// These overwrite published course images by design: that is how a run
	// leaves a reviewable diff. It also means a careless run replaces them
	// with whatever is on screen, so writing a NEW file - which no article
	// references - is refused unless asked for. A capture that invents a path
	// is a mistake, not a new screenshot.
	//
	if (root && !fs.existsSync(target) && !process.env.ALLOW_NEW_IMAGES) {
		throw new Error(
			`${shot.name} does not exist in liferay-learn, so no article ` +
				`references it. Set ALLOW_NEW_IMAGES=1 to add it.`
		);
	}

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

	await candidate(page, `end of step ${path.basename(shot.name)}`);

	armed.delete(page);

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
