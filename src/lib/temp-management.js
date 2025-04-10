import familyTreeData from './stores/family-tree-data';
import imageCache from './stores/image-cache';
import tempState from './stores/temp-state';
import uiState from './stores/ui-state';

import { filterPeopleIds, getPersonById, getPersonRelationshipIds } from './person-management';
import { getActivePerson } from './ui-management';
import {
	areObjectsEqual,
	addOrReplaceObjectInArray,
	deleteObjectInArray,
	getObjectByKeyValueInArray
} from '$lib/utils';

import { repoStateStrings } from '$lib/components/strings';

// manage build mode
export const startBuildMode = () => {
	tempState.update((currentValue) => {
		currentValue.buildMode = true;
		return currentValue;
	});
};

export const endBuildMode = () => {
	tempState.update((currentValue) => {
		currentValue.buildMode = false;
		return currentValue;
	});
};

export const toggleBuildMode = () => {
	let currentBuildModeValue;

	tempState.subscribe((currentValue) => {
		currentBuildModeValue = currentValue.buildMode;
	});

	tempState.update((currentValue) => {
		currentValue.buildMode = !currentBuildModeValue;
		return currentValue;
	});
};

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
	unsetNodeEditName();
	unsetNodeEditRelationshipId();
	unsetNodeEditGroupId();
	unsetNodeEditCompatibleGroups();
};

export const hidePersonNodeActionsModalAndDiscard = () => {};

export const hidePersonNodeActionsModalAndSave = () => {};

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

export const setNodeEditGroupId = (groupId) => {
	tempState.update((currentValue) => {
		currentValue.nodeEditGroupId = groupId;
		return currentValue;
	});
};

export const unsetNodeEditGroupId = () => {
	tempState.update((currentValue) => {
		currentValue.nodeEditGroupId = undefined;
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
