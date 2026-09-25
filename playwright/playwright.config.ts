/**
 * Running this course's exercises against a local bundle.
 *
 * One worker, and no retries. The exercises are a sequence: each one builds
 * on what the one before it left behind, exactly as a reader experiences
 * them. Running them in parallel or retrying one in isolation would test a
 * state the course never puts anybody in.
 */
import {defineConfig} from '@playwright/test';

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

	reporter: [['list'], ['html', {open: 'never'}]],

	retries: 0,

	testDir: './tests',

	timeout: 180000,

	use: {
		baseURL: process.env.LIFERAY_URL || 'http://localhost:8080',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
	},

	workers: 1,
});
