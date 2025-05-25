import { derived, writable } from 'svelte/store';

/*** TREE VIEW ***/
export let personNodePositions = writable([]);
export let personNodeConnectionLineCanvasRef = writable(undefined);
export let personNodeConnectionLineCanvasRefHover = writable(undefined);

/*** TIMELINE ***/
export let timelineCanvasScrollState = writable({ top: true, bottom: true });
export let timelineFirstEventHeight = writable(0);
export let timelineLastEventHeight = writable(0);

/*** MODALS ***/
export let showChooseTreeModal = writable(false);
export let showNodeActionsModal = writable(false);
export let showPersonDetailViewModal = writable(false);
export let showEditAlternateNameModal = writable(false);
export let showMediaGalleryModal = writable(false);
export let showTimelineEventDetailsModal = writable(false);
export let showTimelineEventImageDetailModal = writable(false);

/*** DEV TOOLS ***/
export let showDevTools = writable(false);
export let showStoreView = writable(false);

// create a combined store to display in footer dev tools
const uiStateMap = {
	personNodePositions,
	personNodeConnectionLineCanvasRef,
	personNodeConnectionLineCanvasRefHover,
	timelineCanvasScrollState,
	timelineFirstEventHeight,
	timelineLastEventHeight,
	showChooseTreeModal,
	showPersonDetailViewModal,
	showDevTools,
	doShowStoreView: showStoreView
};
const uiStateEntries = Object.entries(uiStateMap);
// derived store containing all ui state values
export let allUiStateValues = derived(
	uiStateEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(uiStateEntries.map(([key], index) => [key, $stores[index]]))
);
