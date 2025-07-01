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
// delete confirmation
export let showDeleteModal = writable(true);
export let customDeleteMessage = writable(undefined);
export let postDeleteFunction = writable(() => {});
// admin login
export let showAdminLoginModal = writable(false);
export let postAdminLoginFunction = writable(() => {});
// choose tree
export let showChooseTreeModal = writable(false);
export let showChooseTreeModalCloseButton = writable(false);
// node actions
export let showNodeActionsModal = writable(false);
// person detail
export let showPersonDetailViewModal = writable(false);
// alternate names
export let showEditAlternateNameModal = writable(false);
// media gallery
export let showMediaGalleryModal = writable(false);
export let mediaGalleryContent = writable(undefined);
export let mediaGalleryContentArray = writable(undefined);
// timeline events
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
	showTimelineEventDetailsModal,
	showTimelineEventImageDetailModal,
	timelineCanvasScrollState,
	timelineFirstEventHeight,
	timelineLastEventHeight,
	showAdminLoginModal,
	postAdminLoginFunction,
	showChooseTreeModal,
	showChooseTreeModalCloseButton,
	showNodeActionsModal,
	showPersonDetailViewModal,
	showEditAlternateNameModal,
	showMediaGalleryModal,
	mediaGalleryContent,
	showDevTools,
	doShowStoreView: showStoreView
};
const uiStateEntries = Object.entries(uiStateMap);
// derived store containing all ui state values
export let allUiStateValues = derived(
	uiStateEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(uiStateEntries.map(([key], index) => [key, $stores[index]]))
);
