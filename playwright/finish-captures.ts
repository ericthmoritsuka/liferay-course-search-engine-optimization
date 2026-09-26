/**
 * Finish every capture the run produced.
 *
 * A raw capture is 2560 by 1600: the style guide's 800-pixel display width at
 * twice the scale. Publishing it at that size is wrong, and the highlight box
 * is recorded beside it rather than drawn into it, so an unfinished image has
 * no box at all. This is the step that makes a capture publishable, and it
 * ran nowhere until now - the script existed and nothing called it.
 */
import {execFileSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export default function finishCaptures() {
	const root = process.env.LIFERAY_LEARN_DIR
		? path.join(process.env.LIFERAY_LEARN_DIR, 'courses/latest/en')
		: path.join(__dirname, 'screenshots');

	if (!fs.existsSync(root)) {
		return;
	}

	const script = path.join(__dirname, 'scripts/screenshot-finish.sh');

	let finished = 0;

	//
	// Driven by the sidecars, not by the images: a sidecar exists only for a
	// capture this run took, so a rerun never reprocesses an image it did not
	// produce - and finishing an already finished image would shrink it twice.
	//
	for (const sidecar of walk(root).filter((name) => name.endsWith('.box.json'))) {
		const image = sidecar.replace(/\.box\.json$/, '');

		if (!fs.existsSync(image)) {
			continue;
		}

		const box = JSON.parse(fs.readFileSync(sidecar, 'utf8'));

		try {
			execFileSync('bash', [
				script,
				image,
				'--output',
				image,
				'--highlight',
				`${box.x},${box.y},${box.width},${box.height}`,
			]);

			fs.unlinkSync(sidecar);

			finished += 1;
		}
		catch (error) {
			//
			// Said out loud. A capture left unfinished is published at twice
			// its width with no highlight, and silence here looks exactly
			// like a run that had nothing to finish.
			//
			console.error(`could not finish ${image}: ${error}`);
		}
	}

	if (finished) {
		console.log(`\nFinished ${finished} screenshot(s).`);
	}
}

function walk(directory: string): string[] {
	const found: string[] = [];

	for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
		const full = path.join(directory, entry.name);

		found.push(...(entry.isDirectory() ? walk(full) : [full]));
	}

	return found;
}
