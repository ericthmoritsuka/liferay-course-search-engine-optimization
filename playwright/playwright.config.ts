/**
 * Running this course's exercises against a local bundle.
 *
 * One worker, and no retries. The exercises are a sequence: each one builds
 * on what the one before it left behind, exactly as a reader experiences
 * them. Running them in parallel or retrying one in isolation would test a
 * state the course never puts anybody in.
 */
import {defineConfig} from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

//
// .env.local names the liferay-learn clone the screenshots are written into,
// and the bundle under test. It was documented in the README and read by
// nothing, so step three of the install instructions did nothing at all and
// screenshots quietly went to the workspace instead.
//
dotenv.config({path: path.join(__dirname, '.env.local')});

//
// A local bundle, unless someone says otherwise in as many words. This suite
// signs in as an administrator and creates sites, users, roles and content,
// and one of its exercises rewrites instance-wide settings - the default home
// and landing pages, which would redirect every user on a shared instance.
//
const url = process.env.LIFERAY_URL || 'http://localhost:8080';

if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url) &&
	!process.env.ALLOW_REMOTE_LIFERAY) {

	throw new Error(
		`${url} is not a local bundle. This suite changes instance settings ` +
			`and creates content as an administrator. Set ` +
			`ALLOW_REMOTE_LIFERAY=1 if that is really what you want.`
	);
}

export default defineConfig({
	//
	// A step that waits on a real Liferay screen needs longer than the
	// default. A whole exercise needs longer still.
	//
	expect: {timeout: 15000},

	//
	// Alphabetical by filename, which is why the tests are numbered in course
	// order.
	//
	fullyParallel: false,

	//
	// Finishing runs after the suite: every capture is resized to the
	// published width and has its highlight drawn. Doing it here rather than
	// inside each test keeps the raw captures intact, so a box can be moved
	// without taking the picture again.
	//
	globalTeardown: './finish-captures.ts',

	reporter: [['list'], ['html', {open: 'never'}]],

	//
	// One failure stops the run. The tests build on each other, so after the
	// first genuine failure every later test runs against state the course
	// never produces - and each of those still takes screenshots, overwriting
	// published images with pictures of a broken sequence.
	//
	maxFailures: 1,

	retries: 0,

	testDir: './tests',

	timeout: 180000,

	use: {
		//
		// Bounded. Unset, actionTimeout is 0 - no per-action limit at all -
		// so one unclickable element consumes the whole test budget and
		// reports as a timeout that names nothing.
		//
		actionTimeout: 15000,

		baseURL: process.env.LIFERAY_URL || 'http://localhost:8080',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
	},

	workers: 1,
});
