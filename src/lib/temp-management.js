import { get } from 'svelte/store';

import {
	bioEditAltName,
	bioEditAltNames,
	nodeEditCompatibleGroups,
	nodeEditGroupId,
	nodeEditId,
	nodeEditName,
	nodeEditRelationshipId,
	timelineEditEvent
} from './states/temp-state';
import imageCache from './stores/image-cache';
import uiState from './stores/ui-state';

import { getPersonById, getPersonRelationshipIds } from './person-management';
import { getActivePerson } from './ui-management';
import { areObjectsEqual, addOrReplaceObjectInArray, deleteObjectInArray } from '$lib/utils';

import { repoStateStrings } from '$lib/components/strings';

// manage the image cache
// image identifier could be a path or a GitHub url
export const getImageFromCache = (imageIdentifier) => {
	let imgSrc;
	if (imageIdentifier) {
		imageCache.subscribe((currentValue) => {
			imgSrc = currentValue[imageIdentifier];
		});
	}
	return imgSrc;
};

export const addImageToCache = (imageIdentifier, imgSrc) => {
	imageCache.update((currentValue) => {
		currentValue[imageIdentifier] = imgSrc;
		return currentValue;
	});
};

export const removeImageFromCache = (imageIdentifier) => {
	imageCache.update((currentValue) => {
		delete currentValue[imageIdentifier];
		return currentValue;
	});
};

// manage the unsaved changes state
export const setCachedPerson = (person) => {
	uiState.update((currentValue) => {
		currentValue.cachedPersonForUnsavedChanges = JSON.parse(JSON.stringify(person));
		return currentValue;
	});
};

export const unsetCachedPerson = () => {
	uiState.update((currentValue) => {
		currentValue.cachedPersonForUnsavedChanges = undefined;
		return currentValue;
	});
};

// compares this person in the ui state to the cached person set by an editing modal
export const checkPersonForUnsavedChanges = (personId) => {
	let unsavedChanges = false;

	// get the person to test from the ui state
	let personToTest = getPersonById(personId);
	// get the person to compare from the cached list of all people
	let personToCompare;
	uiState.subscribe((currentValue) => {
		personToCompare = currentValue.cachedPersonForUnsavedChanges;
	});

	if (!personToTest || !personToCompare) {
		console.warn(
			'Failed to check for unsaved changes because something was undefined. \nPerson to test:  ' +
				JSON.stringify(personToTest) +
				'\nPerson to compare: ' +
				personToCompare
		);
		return;
	}

	if (!areObjectsEqual(personToTest, personToCompare)) {
		unsavedChanges = true;
	}
	uiState.update((currentValue) => {
		if (unsavedChanges) {
			currentValue.unsavedChanges = true;
			currentValue.saveToRepoStatus = repoStateStrings.unsavedChanges;
		}
		return currentValue;
	});
};

export const checkActivePersonForUnsavedChanges = () => {
	//@ts-expect-error
	checkPersonForUnsavedChanges(getActivePerson().id);
};

// gets all people displayed in the node view
// (the active person and all their relationships)
export const getAllVisibleNodeViewPeople = () => {
	let activePersonRelationshipIds;
	uiState.subscribe((currentValue) => {
		// get all relationship IDs
		activePersonRelationshipIds = getPersonRelationshipIds(currentValue.activePerson);
		// add the active person as well
		activePersonRelationshipIds.push(currentValue.activePerson.id);
	});
	return activePersonRelationshipIds;
};

// person node actions modal
export const showPersonNodeActionsModal = (
	personId,
	name,
	relationshipId,
	groupId,
	compatibleGroups
) => {
	nodeEditId.set(personId);
	nodeEditName.set(name);
	nodeEditRelationshipId.set(relationshipId);
	nodeEditGroupId.set(groupId);
	nodeEditCompatibleGroups.set(compatibleGroups);
};

export const hidePersonNodeActionsModal = () => {
	nodeEditId.set(undefined);
	nodeEditName.set(undefined);
	nodeEditRelationshipId.set(undefined);
	nodeEditGroupId.set(undefined);
	nodeEditCompatibleGroups.set(undefined);
	bioEditAltName.set(undefined);
};

// alternate names
export const setTempStateAltNamesFromUIState = () => {
	let alternateNamesOriginalValue;
	uiState.subscribe((currentValue) => {
		alternateNamesOriginalValue = currentValue.activePerson.alternateNames;
	});

	bioEditAltNames.set(alternateNamesOriginalValue);
};

export const addOrEditAlternateNameInTempState = (alternateName) => {
	bioEditAltNames.update((currentValue) =>
		addOrReplaceObjectInArray(currentValue, 'name', alternateName.name, alternateName)
	);
};

export const removeAlternateNameFromTempState = (name /* name, not object */) => {
	bioEditAltNames.update((currentValue) => deleteObjectInArray(currentValue, 'name', name));
};

export const writeTempAlternateNamesToUIState = () => {
	const tempStateToWrite = get(bioEditAltNames);

	uiState.update((currentValue) => {
		currentValue.activePerson.alternateNames = tempStateToWrite;
		return currentValue;
	});
};

// timeline event associated people
export const addAssociatedPersonToTimelineEvent = (personId) => {
	timelineEditEvent.update((currentValue) => {
		return {
			...currentValue,
			eventContent: {
				...currentValue.eventContent,
				associatedPeopleIds: currentValue.eventContent.associatedPeopleIds.includes(personId)
					? currentValue.eventContent.associatedPeopleIds
					: [...currentValue.eventContent.associatedPeopleIds, personId]
			}
		};
	});
};

export const removeAssociatedPersonFromActiveTimelineEvent = (personId) => {
	timelineEditEvent.update((currentValue) => ({
		...currentValue,
		eventContent: {
			...currentValue.eventContent,
			associatedPeopleIds: currentValue.eventContent.associatedPeopleIds.filter(
				(associatedPeopleId) => associatedPeopleId !== personId
			)
		}
	}));
};
