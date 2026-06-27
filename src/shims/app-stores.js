// Shim for SvelteKit's $app/stores virtual module.
// Provides a minimal `page` store so jdg-ui-svelte components that read
// $page can run inside this plain Vite + Svelte SPA.
import { readable } from 'svelte/store';

const initialPage = {
	url: typeof window !== 'undefined' ? new URL(window.location.href) : new URL('http://localhost'),
	params: {},
	route: { id: null },
	status: 200,
	error: null,
	data: {},
	form: undefined
};

export const page = readable(initialPage, (set) => {
	if (typeof window === 'undefined') return;
	const update = () => set({ ...initialPage, url: new URL(window.location.href) });
	window.addEventListener('popstate', update);
	window.addEventListener('hashchange', update);
	return () => {
		window.removeEventListener('popstate', update);
		window.removeEventListener('hashchange', update);
	};
});

export const navigating = readable(null);
export const updated = { subscribe: readable(false).subscribe, check: async () => false };
