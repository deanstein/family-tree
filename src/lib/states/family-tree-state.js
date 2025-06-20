import { derived, writable } from 'svelte/store';

import { familyTree } from '$lib/schemas/family-tree';
import { instantiateObject } from '$lib/utils';

/*** ACTIVE TREE ***/
// this session's family tree, where all family tree modifications are written
export let activeFamilyTreeData = writable(instantiateObject(familyTree));
// the .json file name in the repo and also the folder name used for tree photos
export let activeFamilyTreeName = writable(undefined);

/*** ACTIVE PERSON ***/
// the person that's currently viewed in the tree
// this is kept in sync with activeFamilyTree
export let activePerson = writable(undefined);

/*** UNSAVED CHANGES ***/
export let hasUnsavedChanges = writable(false);
export let persistenceStatus = writable(undefined);

// create a combined store to display in footer dev tools
const familyTreeStateMap = {
	persistenceStatus,
	hasUnsavedChanges,
	activeFamilyTreeData,
	activeFamilyTreeName,
	activePerson
};
const familyTreeStateEntries = Object.entries(familyTreeStateMap);
// derived store containing all ui state values
export let allFamilyTreeStateValues = derived(
	familyTreeStateEntries.map(([key, store]) => store),
	($stores) =>
		Object.fromEntries(familyTreeStateEntries.map(([key], index) => [key, $stores[index]]))
);
