import { bioEditAltName, nodeEditCompatibleGroups, nodeEditGroupId, nodeEditId, nodeEditName, nodeEditRelationshipId } from './states/temp-state';
import imageCache from './stores/image-cache';
import tempState from './stores/temp-state';
import uiState from './stores/ui-state';

import { getPersonById, getPersonRelationshipIds } from './person-management';
import { getActivePerson } from './ui-management';
import {
	areObjectsEqual,
	addOrReplaceObjectInArray,
	deleteObjectInArray,
	getObjectByKeyValueInArray
} from '$lib/utils';

import { repoStateStrings } from '$lib/components/strings';

// general media
export const setMediaGalleryActiveId = (mediaId) => {
	tempState.update((currentValue) => {
		currentValue.mediaGalleryActiveId = mediaId;
		return currentValue;
	});
};
export const unsetMediaGalleryActiveId = () => {
	tempState.update((currentValue) => {
		currentValue.mediaGalleryActiveId = undefined;
		return currentValue;
	});
};
export const setMediaGalleryActiveContent = (mediaContent) => {
	tempState.update((currentValue) => {
		currentValue.mediaGalleryActiveContent = mediaContent;
		return currentValue;
	});
};
export const unsetMediaGalleryActiveContent = () => {
	tempState.update((currentValue) => {
		currentValue.mediaGalleryActiveContent = undefined;
		return currentValue;
	});
};
export const setMediaGalleryActiveContentArray = (mediaContentArray) => {
	tempState.update((currentValue) => {
		currentValue.mediaGalleryActiveContentArray = mediaContentArray;
		return currentValue;
	});
};
export const unsetMediaGalleryActiveContentArray = () => {
	tempState.update((currentValue) => {
		currentValue.mediaGalleryActiveContentArray = undefined;
		return currentValue;
	});
};

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

export const addOrEditAlternateNameInTempState = (alternateName) => {
	tempState.update((currentValue) => {
		if (getObjectByKeyValueInArray(currentValue.bioEditAltNames, 'name', alternateName.name)) {
			addOrReplaceObjectInArray(
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
		deleteObjectInArray(currentValue.bioEditAltNames, 'name', name);
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

// timeline event edit
export const getActiveTimelineEditEvent = () => {
	let timelineEvent;
	tempState.subscribe((currentValue) => {
		timelineEvent = currentValue.timelineEditEvent;
	});
	return timelineEvent;
};

export const setTimelineEditEventId = (timelineEditEventId) => {
	tempState.update((currentValue) => {
		currentValue.timelineEditEventId = timelineEditEventId;
		return currentValue;
	});
};

export const unsetTimelineEditEventId = () => {
	tempState.update((currentValue) => {
		currentValue.timelineEditEventId = undefined;
		return currentValue;
	});
};

export const setTimelineEditEvent = (timelineEvent) => {
	tempState.update((currentValue) => {
		currentValue.timelineEditEvent = timelineEvent;
		return currentValue;
	});
};

export const unsetTimelineEditEvent = () => {
	tempState.update((currentValue) => {
		currentValue.timelineEditEvent = undefined;
		return currentValue;
	});
};

// timeline event media
export const setImageEditId = (imageId) => {
	tempState.update((currentValue) => {
		currentValue.imageEditId = imageId;
		return currentValue;
	});
};
export const unsetImageEditId = () => {
	tempState.update((currentValue) => {
		currentValue.imageEditId = undefined;
		return currentValue;
	});
};

export const setImageEditContent = (imageEditContent) => {
	tempState.update((currentValue) => {
		currentValue.imageEditContent = imageEditContent;
		return currentValue;
	});
};
export const unsetImageEditContent = () => {
	tempState.update((currentValue) => {
		currentValue.imageEditContent = undefined;
		return currentValue;
	});
};

// timeline event associated people
export const addAssociatedPersonToTimelineEvent = (personId) => {
	tempState.update((currentValue) => {
		currentValue.timelineEditEvent.eventContent.associatedPeopleIds.push(personId);
		return currentValue;
	});
};

export const removeAssociatedPersonFromActiveTimelineEvent = (personId) => {
	tempState.update((currentValue) => {
		currentValue.timelineEditEvent.eventContent.associatedPeopleIds =
			currentValue.timelineEditEvent.eventContent.associatedPeopleIds.filter(
				(associatedPeopleId) => associatedPeopleId !== personId
			);
		return currentValue;
	});
};

// the just-uploaded media url for writing to the correct place in the active person later
export const setMediaUploadedUrl = (imageUrl) => {
	tempState.update((currentValue) => {
		currentValue.uploadedMediaUrl = imageUrl;
		return currentValue;
	});
};
export const unsetMediaUploadedUrl = () => {
	tempState.update((currentValue) => {
		currentValue.uploadedMediaUrl = undefined;
		return currentValue;
	});
};
