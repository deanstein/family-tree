import familyTreeData from '../stores/family-tree-data';
import uiState from '../stores/ui-state';
import stylingConstants from '../ui/styling-constants';
import { repoStateStrings } from '../ui/strings';

import { getFamilyTreeDataFromRepo } from './persistence-management';
import {
	getPersonById,
	getGroupIdFromRelationshipId,
	setActivePerson,
	getPersonAge,
	getPersonBirthYear
} from './person-management';
import { instantiateObject, setNestedObjectProperty } from './utils';
import { relationship } from '../schemas/relationship';

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

export const addOrUpdatePersonInActivePersonGroup = (sPersonId, sRelationshipId) => {
	uiState.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = instantiateObject(relationship);
		personReferenceObject.id = sPersonId;
		personReferenceObject.relationshipId = sRelationshipId;

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

		const personReferenceObject = instantiateObject(relationship);
		personReferenceObject.id = sPersonId;
		personReferenceObject.relationshipId = sRelationshipId;

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

export const getTimelineProportionByDate = (person, eventDate) => {
	const startDate = new Date(person.birth.date);
	// end date is the death date if deceased or today
	const endDate = person.death.date !== '' ? new Date(person.death.date) : new Date();

	// lifespan and event duration in milliseconds
	const lifespanMs = Math.abs(endDate.getTime() - startDate.getTime()) - 1;
	const eventDurationMs = Math.abs(new Date(eventDate).getTime() - startDate.getTime());

	// proportion is event duration divided by lifespan, in milliseconds
	const proportion = eventDurationMs / lifespanMs;

	return proportion;
};

export const addOrUpdateNodePosition = (personId, nodePosition) => {
	uiState.update((currentValue) => {
		// Check if the personId already exists in the array
		const existingIndex = currentValue.nodePositions.findIndex((pos) => pos.personId === personId);
	
		if (existingIndex !== -1) {
		  // If personId exists delete it
		  currentValue.nodePositions.splice(existingIndex, 1)
		}

		// If personId does not exist, add a new entry
		currentValue.nodePositions.push({ personId, ...nodePosition });
		//console.log(currentValue.nodePositions)

		return currentValue;
	  });
}
  
export const removeNodePosition = (personId) => {
	uiState.update((currentValue) => {
		// Check if the personId already exists in the array
		const existingIndex = currentValue.nodePositions.findIndex((pos) => pos.personId === personId);
	
		if (existingIndex !== -1) {
		  // If personId exists delete it
		  currentValue.nodePositions.splice(existingIndex, 1)
		}

		return currentValue;
	})
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