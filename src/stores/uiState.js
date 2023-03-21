import { writable } from 'svelte/store';

const uiState = {
	sPersonIdForNodeEdit: undefined,
	sPersonIdForNodeSettingsFlyout: undefined,
	sPersonNameTemporaryValue: undefined,
	sRelationshipIdTemporaryValue: undefined
};

export default writable(uiState);
