import { writable } from 'svelte/store';

const uiState = {};

const sPersonIdForNodeEdit = '0';

uiState['sPersonIdForNodeEdit'] = sPersonIdForNodeEdit;

export default writable(uiState);
