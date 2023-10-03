import { writable } from 'svelte/store';

const uiState = {
	unsavedChanges: false,
	cachedPersonForUnsavedChanges: undefined,
	saveToRepoStatus: undefined,
	activeFamilyTreeDataId: {},
	activePerson: {},
	personIdForNodeEdit: undefined,
	personIdForNodeSettingsFlyout: undefined,
	personNodePositions: [],
	personNodeConnectionLineCanvas: undefined,
	personNodeConnectionLineCanvasHover: undefined,
	timelineCompositeScrollPos: undefined,
	timelineSpineCanvas: undefined,
	timelineFirstEventPosition: undefined,
	timelineLatestEventPosition: undefined,
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
