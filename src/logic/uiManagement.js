import uiState from '../stores/uiState';
import { updateAvailablePeopleIdsFilteredArray } from './personManagement';

export const startNodeEditingMode = (sPersonId) => {
	setActiveNodeEditId(sPersonId);
	updateAvailablePeopleIdsFilteredArray('Firstname Lastname')
};

export const endNodeEditingMode = () => {
	unsetActiveNodeEditId();
};

export const setActiveNodeEditId = (sPersonId) => {
	uiState.update((currentValue) => {
		currentValue.sPersonIdForNodeEdit = sPersonId;
		return currentValue;
	});
};

export const unsetActiveNodeEditId = () => {
	uiState.update((currentValue) => {
		currentValue.sPersonIdForNodeEdit = undefined;
		return currentValue;
	});
};
