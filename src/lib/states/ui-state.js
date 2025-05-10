import { derived, writable } from 'svelte/store';

export let unsavedChanges = writable(false);

// create a combined store to display in footer dev tools
const storeMap = {
	unsavedChanges
};
const storeEntries = Object.entries(storeMap);
// derived store containing all ui state values
export let allStateValues = derived(
	storeEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(storeEntries.map(([key], index) => [key, $stores[index]]))
);
