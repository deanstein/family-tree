import familyTreeData from '../stores/family-tree-data';
import uiState from '../stores/ui-state';
import stylingConstants from '../ui/styling-constants';
import { repoStateStrings } from '../ui/strings';

import { getFamilyTreeDataFromRepo } from './persistence-management';
import {
	getPersonById,
	getGroupIdFromRelationshipId,
	setActivePerson,
	setPersonNameFromTemporaryState,
	setPersonRelationshipFromTemporaryState
} from './person-management';
import { areObjectsEqual, setNestedObjectProperty } from './utils';
import {
	setNodeActionsModalId,
	setNodeEditCompatibleGroups,
	setNodeEditGroupId,
	setNodeEditName,
	setNodeEditRelationshipId,
	unsetEditAltName,
	unsetNodeActionsModalId,
	unsetNodeEditCompatibleGroups,
	unsetNodeEditId,
	unsetNodeEditRelationshipId
} from './temp-management';

// might be expensive, so try not to call too often
export const checkForUnsavedChanges = () => {
	uiState.update((currentValue) => {
		let unsavedChanges = !areObjectsEqual(
			currentValue.activePerson,
			currentValue.cachedActivePerson
		);
		if (unsavedChanges) {
			currentValue.unsavedChanges = true;
			currentValue.saveToRepoStatus = repoStateStrings.unsavedChanges;
		}
		return currentValue;
	});
};

export const writeUIStateValueAtPath = (path, value, originalValue = undefined) => {
	// only bother doing anything if the value is different
	if (originalValue) {
		if (value === originalValue) {
			return;
		}
	}
	// otherwise, proceed to writing
	uiState.update((currentValue) => {
		if (path) {
			setNestedObjectProperty(currentValue, path, value);
		}
		return currentValue;
	});
};

export const setCachedActivePerson = () => {
	uiState.update((currentValue) => {
		let cachedPerson = JSON.stringify(currentValue.activePerson);
		currentValue.cachedActivePerson = JSON.parse(cachedPerson);
		return currentValue;
	});
};

// get a family tree by id from the repo and set it as the current UI state
export const getRepoFamilyTreeAndSetActive = async (
	familyTreeId,
	password,
	showLoadNotifications = true
) => {
	// get the family tree data from the id
	const newFamilyTreeData = await getFamilyTreeDataFromRepo(
		familyTreeId,
		password,
		showLoadNotifications
	);

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

// person node actions modal
export const showPersonNodeActionsModal = (
	personId,
	name,
	relationshipId,
	groupId,
	compatibleGroups
) => {
	setNodeActionsModalId(personId);
	setNodeEditName(name);
	setNodeEditRelationshipId(relationshipId);
	setNodeEditGroupId(groupId);
	setNodeEditCompatibleGroups(compatibleGroups);
};

export const hidePersonNodeActionsModal = () => {
	unsetNodeActionsModalId();
	unsetEditAltName();
	unsetNodeEditRelationshipId();
	unsetNodeEditCompatibleGroups();
};

// node settings
const setActiveNodeSettingsFlyoutId = (sPersonId) => {
	uiState.update((currentValue) => {
		currentValue.personIdForNodeSettingsFlyout = sPersonId;
		return currentValue;
	});
};

export const showNodeSettingsFlyout = (sPersonId) => {
	setActiveNodeSettingsFlyoutId(sPersonId);
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
	let activePersonName;
	uiState.subscribe((currentValue) => {
		activePersonName = currentValue.activePerson.id;
	});

	uiState.update((currentValue) => {
		currentValue.personIdsOffScreenFiltered = [];

		// for each id, get name and see if the filter is contained in the name
		currentValue.personIdsOffScreen.forEach((sPersonId) => {
			const sPersonName = getPersonById(sPersonId).name.toUpperCase();
			if (sPersonName.indexOf(sFilterUppercase) > -1 && sPersonName !== activePersonName) {
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

export const getNotificationConfigFromRepoState = () => {
	let message;
	let color;

	uiState.subscribe((currentValue) => {
		switch (currentValue.saveToRepoStatus) {
			case repoStateStrings.loading:
				message = repoStateStrings.loading;
				color = stylingConstants.colors.notificationColorInProgress;
				break;
			case repoStateStrings.loadSuccessful:
				message = repoStateStrings.loadSuccessful;
				color = stylingConstants.colors.notificationColorSuccess;
				break;
			case repoStateStrings.saved:
				message = repoStateStrings.saved;
				color = stylingConstants.colors.notificationColorInformation;
				break;
			case repoStateStrings.saving:
				message = repoStateStrings.saving;
				color = stylingConstants.colors.notificationColorInProgress;
				break;
			case repoStateStrings.saveSuccessful:
				message = repoStateStrings.saveSuccessful;
				color = stylingConstants.colors.notificationColorSuccess;
				break;
			case repoStateStrings.unsavedChanges:
				message = repoStateStrings.unsavedChanges;
				color = stylingConstants.colors.notificationColorWarning;
				break;
			case repoStateStrings.loadFailed:
				message = repoStateStrings.loadFailed;
				color = stylingConstants.colors.notificationColorError;
				break;
			case repoStateStrings.saveFailed:
				message = repoStateStrings.saveFailed;
				color = stylingConstants.colors.notificationColorError;
				break;
			default:
				message = repoStateStrings.undefined;
				color = stylingConstants.colors.notificationColorInformation;
		}
	});

	return { message, color };
};

export const getRepoState = () => {
	let repoState = undefined;
	uiState.subscribe((currentValue) => {
		repoState = currentValue.saveToRepoStatus;
	});
	return repoState;
};

export const setRepoState = (saveState) => {
	uiState.update((currentValue) => {
		currentValue.saveToRepoStatus = saveState;
		return currentValue;
	});
};

export const showChooseTreeModal = () => {
	uiState.update((currentValue) => {
		currentValue.showChooseTreeModal = true;
		return currentValue;
	});
};

export const hideChooseTreeModal = () => {
	uiState.update((currentValue) => {
		currentValue.showChooseTreeModal = false;
		return currentValue;
	});
};

export const showPersonDetailView = () => {
	uiState.update((currentValue) => {
		currentValue.showPersonDetailView = true;
		return currentValue;
	});
};

export const hidePersonDetailView = () => {
	uiState.update((currentValue) => {
		currentValue.showPersonDetailView = false;
		return currentValue;
	});
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

export const scrollHorizontal = (event) => {
	if (event.currentTarget.scrollWidth <= event.currentTarget.clientWidth) {
		return;
	}
	const delta = event.deltaX || event.deltaY;
	event.currentTarget.scrollBy(delta, 0);
	event.preventDefault();
};
