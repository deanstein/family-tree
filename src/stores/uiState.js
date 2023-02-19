import { writable } from 'svelte/store';

const uiState = {};

const personIdForNodeEdit = '0';

uiState['personIdForNodeEdit'] = personIdForNodeEdit;

export default writable(uiState);
