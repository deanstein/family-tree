import tempState from '../stores/temp-state';
import uiState from '../stores/ui-state';
import { replaceObjectByKeyValue, deleteObjectByKeyValue, getObjectByKeyValue } from './utils';

// node actions modal
export const setNodeActionsModalId = (personId) => {
	tempState.update((currentValue) => {
		currentValue.nodeActionsModalPersonId = personId;
		return currentValue;
	});
};

export const unsetNodeActionsModalId = () => {
	tempState.update((currentValue) => {
		currentValue.nodeActionsModalPersonId = undefined;
		return currentValue;
	});
};

// node edit
export const setNodeEditId = (personId) => {
	tempState.update((currentValue) => {
		currentValue.nodeEditPersonId = personId;
		return currentValue;
	});
};

export const unsetNodeEditId = () => {
	tempState.update((currentValue) => {
		currentValue.nodeEditPersonId = undefined;
		return currentValue;
	});
};

export const setNodeEditName = (name) => {
	tempState.update((currentValue) => {
		currentValue.nodeEditName = name;
		return currentValue;
	});
};

export const unsetNodeEditName = () => {
	tempState.update((currentValue) => {
		currentValue.nodeEditName = undefined;
		return currentValue;
	});
};

export const setNodeEditRelationshipId = (relationshipId) => {
	tempState.update((currentValue) => {
		currentValue.nodeEditRelationshipId = relationshipId;
		return currentValue;
	});
};

export const unsetNodeEditRelationshipId = () => {
	tempState.update((currentValue) => {
		currentValue.nodeEditRelationshipId = undefined;
		return currentValue;
	});
};

export const setNodeEditCompatibleGroups = (compatibleGroups) => {
	tempState.update((currentValue) => {
		currentValue.nodeEditCompatibleGroups = compatibleGroups;
		return currentValue;
	});
};

export const unsetNodeEditCompatibleGroups = () => {
	tempState.update((currentValue) => {
		currentValue.nodeEditCompatibleGroups = undefined;
		return currentValue;
	});
};
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
		currentValue.bioEditAltName = alternateName;
		return currentValue;
	});
};

export const unsetEditAltName = () => {
	tempState.update((currentValue) => {
		currentValue.bioEditAltName = undefined;
		return currentValue;
	});
};

export const initializeAltNamesTempState = () => {
	let alternateNamesOriginalValue;
	uiState.subscribe((currentValue) => {
		alternateNamesOriginalValue = currentValue.activePerson.alternateNames;
	});

	tempState.update((currentValue) => {
		currentValue.bioEditAltNames = alternateNamesOriginalValue;
		return currentValue;
	});
};

export const unsetAltNames = () => {
	tempState.update((currentValue) => {
		currentValue.bioEditAltNames = [];
		return currentValue;
	});
};

export const addOrEditAlternateNameInTempState = (alternateName) => {
	tempState.update((currentValue) => {
		if (getObjectByKeyValue(currentValue.bioEditAltNames, 'name', alternateName.name)) {
			replaceObjectByKeyValue(
				currentValue.bioEditAltNames,
				'name',
				alternateName.name,
				alternateName
			);
		} else {
			currentValue.bioEditAltNames.push(alternateName);
		}
		return currentValue;
	});
};

export const removeAlternateNameFromTempState = (name /* just the name, not the object */) => {
	tempState.update((currentValue) => {
		deleteObjectByKeyValue(currentValue.bioEditAltNames, 'name', name);
		return currentValue;
	});
};

export const writeTempAlternateNamesToUIState = () => {
	let tempStateToWrite;
	tempState.subscribe((currentValue) => {
		tempStateToWrite = currentValue.bioEditAltNames;
	});

	uiState.update((currentValue) => {
		currentValue.activePerson.alternateNames = tempStateToWrite;
		return currentValue;
	});
};
