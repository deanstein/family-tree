import uiState from '../stores/uiState';
import { updateAvailablePeopleIdsFilteredArray } from './personManagement';

export const startNodeEditingMode = (sPersonId) => {
	setActiveNodeEditId(sPersonId);
	updateAvailablePeopleIdsFilteredArray('Firstname Lastname');
};

export const setActiveNodeEditId = (sPersonId) => {
	uiState.update((currentValue) => {
		currentValue.sPersonIdForNodeEdit = sPersonId;
		return currentValue;
	});
};

export const endNodeEditingMode = () => {
	unsetActiveNodeEditId();
};

export const unsetActiveNodeEditId = () => {
	uiState.update((currentValue) => {
		currentValue.sPersonIdForNodeEdit = undefined;
		return currentValue;
	});
};

export const setTemporaryNodeEditName = (sName) => {
	uiState.update((currentValue) => {
		currentValue.sPersonNameTemporaryValue = sName;
		return currentValue;
	});
};

export const setTemporaryRelationshipId = (sRelationshipId) => {
	uiState.update((currentValue) => {
		currentValue.sRelationshipIdTemporaryValue = sRelationshipId;
		return currentValue;
	});
};

export const showNodeSettingsFlyout = (sPersonId) => {
	setActiveNodeSettingsFlyoutId(sPersonId);
};

const setActiveNodeSettingsFlyoutId = (sPersonId) => {
	uiState.update((currentValue) => {
		currentValue.sPersonIdForNodeSettingsFlyout = sPersonId;
		return currentValue;
	});
};

export const hideNodeSettingsFlyout = () => {
	unsetActiveNodeSettingsFlyoutId();
};

const unsetActiveNodeSettingsFlyoutId = () => {
	uiState.update((currentValue) => {
		currentValue.sPersonIdForNodeSettingsFlyout = undefined;
		return currentValue;
	});
};

export const toggleNodeSettingsFlyout = (sPersonId) => {
	uiState.update((currentValue) => {
		if (currentValue.sPersonIdForNodeSettingsFlyout == undefined) {
			currentValue.sPersonIdForNodeSettingsFlyout = sPersonId;
		} else {
			currentValue.sPersonIdForNodeSettingsFlyout = undefined;
		}
		return currentValue;
	});
};
