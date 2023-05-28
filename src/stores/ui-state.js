import { writable } from 'svelte/store';

const uiState = {
	unsavedChanges: false,
	cachedFamilyTreeData: {},
	saveToRepoStatus: undefined,
	activeFamilyTreeDataId: {},
	activePerson: {},
	cachedActivePerson: {},
	personIdForNodeEdit: undefined,
	personIdForNodeSettingsFlyout: undefined,
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
