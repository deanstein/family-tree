import { writable } from 'svelte/store';

const uiState = {
	activePerson: {},
	aPersonIdsOnScreen: [],
	aPersonIdsOffScreen: [],
	aPersonIdsOffScreenFiltered: [],
	sPersonIdForNodeEdit: undefined,
	sPersonIdForNodeSettingsFlyout: undefined,
	sPersonNameTemporaryValue: undefined,
	sRelationshipIdTemporaryValue: undefined
};

export default writable(uiState);
