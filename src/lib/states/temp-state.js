import { derived, writable } from 'svelte/store';

// if true, node add/action buttons and relationship placeholders
// will display for tree editing
export let isTreeEditActive = writable(false);

// only one PersonNode edit instance can be active at a time
export let isNodeEditActive = writable(false);
// individual fields for PersonNode editing
export let nodeEditId = writable(undefined);
export let nodeEditName = writable(undefined);
export let nodeEditRelationshipId = writable(undefined);
export let nodeEditGroupId = writable(undefined);
export let nodeEditCompatibleGroups = writable(undefined);

// if set, bio edit mode becomes active
// and the inputs will be enabled
export let bioEditId = writable(undefined);
// if set, the alternate name modal will display
export let bioEditAltName = writable(undefined);
// the various alternate names associated with the active person
export let bioEditAltNames = writable([]);

// create a combined store to display in footer dev tools
const storeMap = {
	isTreeEditActive,
	isNodeEditActive,
	nodeEditId,
	nodeEditName,
	nodeEditRelationshipId,
	nodeEditGroupId,
	nodeEditCompatibleGroups,
	bioEditId,
	bioEditAltName
};
const storeEntries = Object.entries(storeMap);
// derived store containing all ui state values
export let allStateValues = derived(
	storeEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(storeEntries.map(([key], index) => [key, $stores[index]]))
);
