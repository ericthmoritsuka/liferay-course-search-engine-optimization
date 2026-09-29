import {defineConfig} from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.join(__dirname, '../../.env.local')});

export default defineConfig({
	outputDir: path.join(__dirname, 'out'),
	reporter: [['line']],
	retries: 0,
	testDir: __dirname,
	testMatch: /.*\.probe\.ts/,
	timeout: 120000,
	use: {
		baseURL: process.env.LIFERAY_URL || 'http://localhost:8080',
		viewport: {height: 900, width: 1440},
	},
	workers: 1,
});
