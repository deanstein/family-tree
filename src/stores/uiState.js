import { writable } from 'svelte/store';

const uiState = {
	saveToRepoStatus: undefined,
	activeFamilyTreeDataId: {},
	activePerson: {},
	personIdsOnScreen: [],
	personIdsOffScreen: [],
	personIdsOffScreenFiltered: [],
	personIdForNodeEdit: undefined,
	personIdForNodeSettingsFlyout: undefined,
	personNameTemporaryValue: undefined,
	relationshipIdTemporaryValue: undefined,
	showChooseTreeModal: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
