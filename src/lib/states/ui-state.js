import { derived, writable } from 'svelte/store';

/*** ACTIVE TREE AND PERSON ***/
export let activeFamilyTreeDataId = writable(undefined);
export let activeFamilyTreeFileOrFolderName = writable(undefined);
export let activePerson = writable(undefined);

/*** TREE VIEW ***/
export let personNodePositions = writable([]);
export let personNodeConnectionLineCanvasRef = writable(undefined);
export let personNodeConnectionLineCanvasRefHover = writable(undefined);

/*** TIMELINE ***/
export let timelineCanvasScrollState = writable({ top: true, bottom: true });
export let timelineFirstEventHeight = writable(0);
export let timelineLastEventHeight = writable(0);

/*** UNSAVED CHANGES ***/
export let hasUnsavedChanges = writable(false);
export let cachedPersonForUnsavedChanges = writable(undefined);
export let saveToRepoStatus = writable(undefined);

/*** MODALS ***/
export let doShowChooseTreeModal = writable(false);
export let doShowPersonDetailView = writable(false);

/*** DEV TOOLS ***/
export let doShowDevTools = writable(true);
export let doShowStoreView = writable(true);

// create a combined store to display in footer dev tools
const uiStateMap = {
	activeFamilyTreeDataId,
	activeFamilyTreeFileOrFolderName,
	activePerson,
	personNodePositions,
	personNodeConnectionLineCanvasRef,
	personNodeConnectionLineCanvasRefHover,
	timelineCanvasScrollState,
	timelineFirstEventHeight,
	timelineLastEventHeight,
	hasUnsavedChanges,
	cachedPersonForUnsavedChanges,
	saveToRepoStatus,
	doShowChooseTreeModal,
	doShowPersonDetailView,
	doShowDevTools,
	doShowStoreView
};
const uiStateEntries = Object.entries(uiStateMap);
// derived store containing all ui state values
export let allUiStateValues = derived(
	uiStateEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(uiStateEntries.map(([key], index) => [key, $stores[index]]))
);
