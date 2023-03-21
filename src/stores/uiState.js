import { writable } from 'svelte/store';

const uiState = {
	sPersonIdForNodeEdit: undefined,
	sPersonIdForNodeSettingsFlyout: undefined
};

export default writable(uiState);
