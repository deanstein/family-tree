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
import { activePerson } from './states/family-tree-state';
import { showNodeActionsModal } from './states/ui-state';
import imageCache from './stores/image-cache';

import { getPersonRelationshipIds } from './person-management';
import { addOrReplaceObjectInArray, deleteObjectInArray } from '$lib/utils';

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

// gets all people displayed in the node view
// (the active person and all their relationships)
export const getAllVisibleNodeViewPeople = () => {
	let activePersonRelationshipIds = getPersonRelationshipIds(get(activePerson));
	activePersonRelationshipIds.push(get(activePerson).id);
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
	showNodeActionsModal.set(true);
	nodeEditId.set(personId);
	nodeEditName.set(name);
	nodeEditRelationshipId.set(relationshipId);
	nodeEditGroupId.set(groupId);
	nodeEditCompatibleGroups.set(compatibleGroups);
};

export const hidePersonNodeActionsModal = () => {
	showNodeActionsModal.set(false);
	nodeEditId.set(undefined);
	nodeEditName.set(undefined);
	nodeEditRelationshipId.set(undefined);
	nodeEditGroupId.set(undefined);
	nodeEditCompatibleGroups.set(undefined);
	bioEditAltName.set(undefined);
};

// alternate names
export const setTempStateAltNamesFromUIState = () => {
	const alternateNamesOriginalValue = get(activePerson).alternateNames;
	bioEditAltNames.set(alternateNamesOriginalValue);
};

export const addOrEditAlternateNameInTempState = (alternateName) => {
	bioEditAltNames.update((currentValue) => {
		return addOrReplaceObjectInArray(currentValue, 'name', alternateName.name, alternateName);
	});
};

export const removeAlternateNameFromTempState = (name /* name, not object */) => {
	bioEditAltNames.update((currentValue) => deleteObjectInArray(currentValue, 'name', name));
};

export const writeTempAlternateNamesToFamilyTree = () => {
	const tempStateToWrite = get(bioEditAltNames);
	activePerson.update((currentValue) => {
		currentValue.alternateNames = tempStateToWrite;
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
