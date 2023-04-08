import { writable } from 'svelte/store';

const uiState = {
	activeFamilyTreeDataId: {},
	activePerson: {},
	personIdsOnScreen: [],
	personIdsOffScreen: [],
	personIdsOffScreenFiltered: [],
	personIdForNodeEdit: undefined,
	personIdForNodeSettingsFlyout: undefined,
	personNameTemporaryValue: undefined,
	relationshipIdTemporaryValue: undefined
};

export default writable(uiState);
