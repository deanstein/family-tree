import { writable } from 'svelte/store';

const uiState = {
	activeFamilyTreeData: {},
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
