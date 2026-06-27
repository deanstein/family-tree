// Shim for SvelteKit's $app/environment virtual module.
// jdg-ui-svelte expects this to exist, but this project is a plain Vite + Svelte
// SPA (no SvelteKit), so we provide the minimal surface the library reads.
export const browser = typeof window !== 'undefined';
export const dev = import.meta.env?.DEV ?? false;
export const building = false;
export const version = '';
