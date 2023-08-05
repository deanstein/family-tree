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
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
