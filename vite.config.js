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
			$lib: path.resolve('./src/lib')
		}
	},
	build: {
		outDir: 'build'
	}
});
