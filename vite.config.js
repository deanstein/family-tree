import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const packageJsonFile = fileURLToPath(new URL('package.json', import.meta.url));
const packageJsonData = readFileSync(packageJsonFile, 'utf8');
const packageJson = JSON.parse(packageJsonData);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	define: {
		packageJson: packageJson
	},
	publicDir: 'static',
	base: '',
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			// jdg-ui-svelte v3 ships components that import SvelteKit's virtual
			// $app/* modules. This is a plain Vite + Svelte SPA (no SvelteKit),
			// so point those imports at local shims.
			'$app/environment': path.resolve('./src/shims/app-environment.js'),
			'$app/stores': path.resolve('./src/shims/app-stores.js')
		}
	},
	optimizeDeps: {
		// jdg-ui-svelte ships raw .svelte sources that import the $app/* modules
		// above. Excluding it from esbuild pre-bundling routes those files through
		// Vite's normal resolver, where the aliases actually apply.
		exclude: ['jdg-ui-svelte']
	},
	build: {
		outDir: 'build'
	}
});
