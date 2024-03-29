import { writable } from 'svelte/store';

const uiState = {
	unsavedChanges: false,
	cachedPersonForUnsavedChanges: undefined,
	saveToRepoStatus: undefined,
	activeFamilyTreeDataId: {},
	activeFamilyTreeFileOrFolderName: undefined,
	activePerson: {},
	personNodePositions: [],
	personNodeConnectionLineCanvas: undefined,
	personNodeConnectionLineCanvasHover: undefined,
	timelineCanvasScrollState: { top: true, bottom: true },
	timelineFirstEventHeight: 0,
	timelineLastEventHeight: 0,
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
