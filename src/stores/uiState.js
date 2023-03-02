import { writable } from 'svelte/store';

const uiState = {
	sPersonIdForNodeEdit: 'undefined'
};

export default writable(uiState);