import uiState from '../stores/uiState';
import { setPersonNameFromTemporaryState, setPersonRelationshipFromTemporaryState, updateAvailablePeopleIdsFilteredArray } from './personManagement';

// node editing mode
export const startNodeEditingMode = (sPersonId) => {
	setActiveNodeEditId(sPersonId);
	updateAvailablePeopleIdsFilteredArray('Firstname Lastname');
};

export const endNodeEditingMode = (sPersonId, sRelationshipId) => {
	setPersonNameFromTemporaryState(sPersonId);
	setPersonRelationshipFromTemporaryState(sPersonId, sRelationshipId);
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

// node editing mode - name
export const setTempNodeEditName = (sName) => {
	uiState.update((currentValue) => {
		currentValue.sPersonNameTemporaryValue = sName;
		return currentValue;
	});
};

// node editing mode - relationship
export const setTempRelationshipId = (sRelationshipId) => {
	uiState.update((currentValue) => {
		currentValue.sRelationshipIdTemporaryValue = sRelationshipId;
		return currentValue;
	});
};

// node settings
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
