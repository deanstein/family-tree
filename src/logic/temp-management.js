import tempState from '../stores/temp-state';
import uiState from '../stores/ui-state';
import { replaceObjectByKeyValue, deleteObjectByKeyValue, getObjectByKeyValue } from './utils';

// bio editing mode
export const setBioEditId = (personId) => {
	tempState.update((currentValue) => {
		currentValue.bioEditPersonId = personId;
		return currentValue;
	});
};

export const unsetBioEditId = () => {
	tempState.update((currentValue) => {
		currentValue.bioEditPersonId = undefined;
		return currentValue;
	});
};

// alternate names
export const setEditAltName = (alternateName) => {
	tempState.update((currentValue) => {
		currentValue.editAltName = alternateName;
		return currentValue;
	});
};

export const unsetEditAltName = () => {
	tempState.update((currentValue) => {
		currentValue.editAltName = undefined;
		return currentValue;
	});
};

export const initializeAltNamesTempState = () => {
	let alternateNamesOriginalValue;
	uiState.subscribe((currentValue) => {
		alternateNamesOriginalValue = currentValue.activePerson.alternateNames;
	});

	tempState.update((currentValue) => {
		currentValue.altNames = alternateNamesOriginalValue;
		return currentValue;
	});
};

export const unsetAltNames = () => {
	tempState.update((currentValue) => {
		currentValue.altNames = [];
		return currentValue;
	});
};

export const addOrEditAlternateNameInTempState = (alternateName) => {
	tempState.update((currentValue) => {
		if (getObjectByKeyValue(currentValue.altNames, 'name', alternateName.name)) {
			replaceObjectByKeyValue(currentValue.altNames, 'name', alternateName.name, alternateName);
		} else {
			currentValue.altNames.push(alternateName);
		}
		return currentValue;
	});
};

export const removeAlternateNameFromTempState = (name /* just the name, not the object */) => {
	tempState.update((currentValue) => {
		deleteObjectByKeyValue(currentValue.altNames, 'name', name);
		return currentValue;
	});
};

export const writeTempAlternateNamesToUIState = () => {
	let tempStateToWrite;
	tempState.subscribe((currentValue) => {
		tempStateToWrite = currentValue.altNames;
	});

	uiState.update((currentValue) => {
		currentValue.activePerson.alternateNames = tempStateToWrite;
		return currentValue;
	});
};
