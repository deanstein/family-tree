import { writable } from 'svelte/store';

const uiState = {
	unsavedChanges: false,
	saveToRepoStatus: undefined,
	activeFamilyTreeDataId: {},
	activePerson: {},
	cachedActivePerson: {},
	personIdsOnScreen: [],
	personIdsOffScreen: [],
	personIdsOffScreenFiltered: [],
	personIdForNodeEdit: undefined,
	personIdForNodeSettingsFlyout: undefined,
	personNameTemporaryValue: undefined,
	relationshipIdTemporaryValue: undefined,
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
