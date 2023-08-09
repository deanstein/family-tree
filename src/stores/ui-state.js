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
	personNodeConnectionLineContext2d: undefined,
	personNodeConnectionLineContext2dHover: undefined,
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
