import { derived, writable } from 'svelte/store';

/*** TREE VIEW ***/
export let personNodePositions = writable([]);
export let personNodeConnectionLineCanvasRef = writable(undefined);
export let personNodeConnectionLineCanvasRefHover = writable(undefined);

/*** TIMELINE ***/
export let timelineCanvasScrollState = writable({ top: true, bottom: true });
export let timelineFirstEventHeight = writable(0);
export let timelineLastEventHeight = writable(0);

/*** UNSAVED CHANGES ***/
export let cachedPersonForUnsavedChanges = writable(undefined);

/*** MODALS ***/
export let doShowChooseTreeModal = writable(false);
export let doShowPersonDetailView = writable(false);

/*** DEV TOOLS ***/
export let doShowDevTools = writable(false);
export let doShowStoreView = writable(false);

// create a combined store to display in footer dev tools
const uiStateMap = {
	personNodePositions,
	personNodeConnectionLineCanvasRef,
	personNodeConnectionLineCanvasRefHover,
	timelineCanvasScrollState,
	timelineFirstEventHeight,
	timelineLastEventHeight,
	cachedPersonForUnsavedChanges,
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
