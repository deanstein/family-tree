import uiState from '../stores/uiState';
import {
	getPersonById,
	getGroupIdFromRelationshipId,
	setPersonNameFromTemporaryState,
	setPersonRelationshipFromTemporaryState
} from './personManagement';

// node editing mode
export const startNodeEditingMode = (sPersonId) => {
	setActiveNodeEditId(sPersonId);
	updateOffScreenPeopleIdsArray('Firstname Lastname');
};

export const endNodeEditingMode = (sPersonId, sRelationshipId) => {
	setPersonNameFromTemporaryState(sPersonId);
	if (sRelationshipId) {
		setPersonRelationshipFromTemporaryState(sPersonId, sRelationshipId);
	}
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

// manage on/off screen people IDs
export const addPersonIdToOnScreenPeopleIdsArray = (sPersonId) => {
	uiState.update((currentValue) => {
		const nActiveRelatedPersonIdSpliceIndex = currentValue.aPersonIdsOnScreen.indexOf(sPersonId);
		const nAvailableRelatedPersonIdSpliceIndex =
			currentValue.aPersonIdsOffScreen.indexOf(sPersonId);

		if (nActiveRelatedPersonIdSpliceIndex === -1) {
			currentValue.aPersonIdsOnScreen.push(sPersonId);
		}

		if (nAvailableRelatedPersonIdSpliceIndex > -1) {
			currentValue.aPersonIdsOffScreen.splice(nAvailableRelatedPersonIdSpliceIndex, 1);
		}

		//console.log('Added', sPersonId)

		return currentValue;
	});
};

export const addPersonIdToOffScreenPeopleIdsArray = (sPersonId) => {
	uiState.update((currentValue) => {
		const nActiveRelatedPersonIdSpliceIndex = currentValue.aPersonIdsOnScreen.indexOf(sPersonId);
		const nAvailableRelatedPersonIdSpliceIndex =
			currentValue.aPersonIdsOffScreen.indexOf(sPersonId);

		if (nActiveRelatedPersonIdSpliceIndex > -1) {
			currentValue.aPersonIdsOnScreen.splice(nActiveRelatedPersonIdSpliceIndex, 1);
		}

		if (nAvailableRelatedPersonIdSpliceIndex === -1) {
			currentValue.aPersonIdsOffScreen.push(sPersonId);
		}

		//console.log('Removed', sPersonId)

		return currentValue;
	});
};

export const addOrUpdatePersonInActivePersonGroup = (sPersonId, sRelationshipId) => {
	uiState.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = {
			id: sPersonId,
			relationshipId: sRelationshipId
		};

		const foundPersonReferenceObject = currentValue.activePerson.relationships[sGroupId].find(
			(personObject) => {
				if (personObject.id === sPersonId) return personReferenceObject;
			}
		);
		const nGroupIndex = currentValue.activePerson.relationships[sGroupId].indexOf(
			foundPersonReferenceObject
		);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			currentValue.activePerson.relationships[sGroupId].push(personReferenceObject);
			// but if it exists, update with the new relationship id
		} else {
			console.log('blocked from adding');
			currentValue.activePerson.relationships[sGroupId][nGroupIndex].relationshipId =
				sRelationshipId;
		}

		return currentValue;
	});
};

export const removePersonFromActivePersonGroup = (sPersonId, sRelationshipId) => {
	uiState.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = {
			id: sPersonId,
			relationshipId: sRelationshipId
		};

		const foundPersonReferenceObject = currentValue.activePerson.relationships[sGroupId].find(
			(personObject) => {
				if (personObject.id === sPersonId) return personReferenceObject;
			}
		);

		const nSpliceIndex = currentValue.activePerson.relationships[sGroupId].indexOf(
			foundPersonReferenceObject
		);

		if (nSpliceIndex > -1) {
			currentValue.activePerson.relationships[sGroupId].splice(nSpliceIndex, 1);
		}

		return currentValue;
	});
};

export const updateOffScreenPeopleIdsArray = (sFilter) => {
	const sFilterUppercase = sFilter.toUpperCase();

	uiState.update((currentValue) => {
		currentValue.aPersonIdsOffScreenFiltered = [];

		// for each id, get name and see if the filter is contained in the name
		currentValue.aPersonIdsOffScreen.forEach((sPersonId) => {
			const sPersonName = getPersonById(sPersonId).name.toUpperCase();
			if (sPersonName.indexOf(sFilterUppercase) > -1) {
				currentValue.aPersonIdsOffScreenFiltered.push(sPersonId);
			} else {
				const nPersonIdIndex = currentValue.aPersonIdsOffScreenFiltered.indexOf(sPersonId);
				if (nPersonIdIndex != -1) {
					currentValue.aPersonIdsOffScreenFiltered.splice(nPersonIdIndex, 1);
				}
			}
		});

		// if nothing in the text box, show all available people
		if (sFilterUppercase === '') {
			currentValue.aPersonIdsOffScreenFiltered = currentValue.aPersonIdsOffScreen;
		}

		return currentValue;
	});
};