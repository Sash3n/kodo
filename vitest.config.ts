import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/lib/test/setup.ts'],
		// Component tests require browser-mode Svelte — run separately with pnpm test:component
		include: [
			'src/lib/stores/**/*.test.ts',
			'src/lib/utils/**/*.test.ts',
			'src/lib/schemas/**/*.test.ts',
		],
	},
});
