import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './test',
	testMatch: '**/*.spec.mjs',
	fullyParallel: true,
	use: {
		baseURL: 'http://127.0.0.1:3000',
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'npm run test:server',
		url: 'http://127.0.0.1:3000',
		reuseExistingServer: true
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } }
	]
})
