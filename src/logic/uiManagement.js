import familyTreeData from '../stores/familyTreeData';
import uiState from '../stores/uiState';
import { repoSaveStateStrings } from '../ui/strings';
import { getFamilyTreeDataFromRepo } from './persistenceManagement';
import {
	getPersonById,
	getGroupIdFromRelationshipId,
	setActivePerson,
	setPersonNameFromTemporaryState,
	setPersonRelationshipFromTemporaryState
} from './personManagement';
import stylingConstants from '../ui/stylingConstants';

// get a family tree by id from the repo and set it as the current UI state
export const getRepoFamilyTreeAndSetActive = async (familyTreeId, password) => {
	// get the family tree data from the id
	const newFamilyTreeData = await getFamilyTreeDataFromRepo(familyTreeId, password);

	// update the ui state
	familyTreeData.update((currentValue) => {
		currentValue = newFamilyTreeData;
		return currentValue;
	});

	uiState.update((currentValue) => {
		currentValue.activeFamilyTreeDataId = familyTreeId;
		return currentValue;
	});

	// force an update by setting the active person
	setActivePerson(getPersonById(newFamilyTreeData.lastKnownActivePersonId));
};

// node editing mode
export const startNodeEditingMode = (sPersonId) => {
	setActiveNodeEditId(sPersonId);
	updateFilteredOffScreenPeopleIdsArray('Firstname Lastname');
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
		currentValue.personIdForNodeEdit = sPersonId;
		return currentValue;
	});
};

export const unsetActiveNodeEditId = () => {
	uiState.update((currentValue) => {
		currentValue.personIdForNodeEdit = undefined;
		return currentValue;
	});
};

// node editing mode - name
export const setTempNodeEditName = (sName) => {
	uiState.update((currentValue) => {
		currentValue.personNameTemporaryValue = sName;
		return currentValue;
	});
};

// node editing mode - relationship
export const setTempRelationshipId = (sRelationshipId) => {
	uiState.update((currentValue) => {
		currentValue.relationshipIdTemporaryValue = sRelationshipId;
		return currentValue;
	});
};

// node settings
export const showNodeSettingsFlyout = (sPersonId) => {
	setActiveNodeSettingsFlyoutId(sPersonId);
};

const setActiveNodeSettingsFlyoutId = (sPersonId) => {
	uiState.update((currentValue) => {
		currentValue.personIdForNodeSettingsFlyout = sPersonId;
		return currentValue;
	});
};

export const hideNodeSettingsFlyout = () => {
	unsetActiveNodeSettingsFlyoutId();
};

const unsetActiveNodeSettingsFlyoutId = () => {
	uiState.update((currentValue) => {
		currentValue.personIdForNodeSettingsFlyout = undefined;
		return currentValue;
	});
};

export const toggleNodeSettingsFlyout = (sPersonId) => {
	uiState.update((currentValue) => {
		if (currentValue.personIdForNodeSettingsFlyout == undefined) {
			currentValue.personIdForNodeSettingsFlyout = sPersonId;
		} else {
			currentValue.personIdForNodeSettingsFlyout = undefined;
		}
		return currentValue;
	});
};

// manage on/off screen people IDs
export const initializeOffScreenPeopleIdsArray = () => {
	let allPeople = undefined;
	familyTreeData.subscribe((currentValue) => {
		allPeople = currentValue.allPeople.map((person) => person.id);
	});

	uiState.update((currentValue) => {
		currentValue.personIdsOffScreen = allPeople;
		return currentValue;
	});
};

export const updateOffScreenPeopleIdsArray = () => {
	uiState.update((currentValue) => {
		const activePersonIndex = currentValue.personIdsOffScreen.indexOf(currentValue.activePerson.id);
		if (activePersonIndex > -1) {
			currentValue.personIdsOffScreen.splice(activePersonIndex, 1);
		}
		const relationships = currentValue.activePerson.relationships;
		for (const relationship in relationships) {
			if (Array.isArray(relationships[relationship])) {
				relationships[relationship].forEach((personObject) => {
					if (personObject && typeof personObject === 'object' && personObject.id) {
						const personId = personObject.id;
						const index = currentValue.personIdsOffScreen.indexOf(personId);
						if (index > -1) {
							currentValue.personIdsOffScreen.splice(index, 1);
						}
					}
				});
			}
		}
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

export const updateFilteredOffScreenPeopleIdsArray = (sFilter) => {
	const sFilterUppercase = sFilter.toUpperCase();

	uiState.update((currentValue) => {
		currentValue.personIdsOffScreenFiltered = [];

		// for each id, get name and see if the filter is contained in the name
		currentValue.personIdsOffScreen.forEach((sPersonId) => {
			const sPersonName = getPersonById(sPersonId).name.toUpperCase();
			if (sPersonName.indexOf(sFilterUppercase) > -1) {
				currentValue.personIdsOffScreenFiltered.push(sPersonId);
			} else {
				const nPersonIdIndex = currentValue.personIdsOffScreenFiltered.indexOf(sPersonId);
				if (nPersonIdIndex != -1) {
					currentValue.personIdsOffScreenFiltered.splice(nPersonIdIndex, 1);
				}
			}
		});

		// if nothing in the text box, show all available people
		if (sFilterUppercase === '') {
			currentValue.personIdsOffScreenFiltered = currentValue.personIdsOffScreen;
		}

		return currentValue;
	});
};

export const getNotificationConfigFromSaveState = () => {
	let message;
	let color;

	uiState.subscribe((currentValue) => {
		switch (currentValue.saveToRepoStatus) {
			case repoSaveStateStrings.synced:
				message = repoSaveStateStrings.synced;
				color = stylingConstants.colors.notificationColorInformation;
				break;
			case repoSaveStateStrings.syncing:
				message = repoSaveStateStrings.syncing;
				color = stylingConstants.colors.notificationColorWarning;
				break;
			case repoSaveStateStrings.syncSuccessful:
				message = repoSaveStateStrings.syncSuccessful;
				color = stylingConstants.colors.notificationColorSuccess;
				break;
			case repoSaveStateStrings.unsavedChanges:
				message = repoSaveStateStrings.unsavedChanges;
				color = stylingConstants.colors.notificationColorWarning;
				break;
			case repoSaveStateStrings.failure0:
				message = repoSaveStateStrings.failure0;
				color = stylingConstants.colors.notificationColorError;
				break;
			default:
				message = 'No notification';
				color = stylingConstants.colors.notificationColorInformation;
		}
	});

	return { message, color };
};

export const scrollToTopAndCenter = () => {
	// Scroll to the top of the page
	window.scrollTo(0, 0);

	// Center the page horizontally
	var screenWidth = window.innerWidth;
	var scrollLeft = (document.body.scrollWidth - screenWidth) / 2;
	window.scrollTo(scrollLeft, 0);
};

export const disableScrolling = () => {
	document.body.style.overflow = 'hidden';
};

export const enableScrolling = () => {
	document.body.style.overflow = 'auto';
};
