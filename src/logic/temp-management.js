import familyTreeData from '../stores/family-tree-data';
import imageCache from '../stores/image-cache';
import tempState from '../stores/temp-state';
import uiState from '../stores/ui-state';
import { repoStateStrings } from '../ui/strings';
import { getActivePerson, getPersonById } from './person-management';
import {
	areObjectsEqual,
	addOrReplaceObjectInArray,
	deleteObjectInArray,
	getObjectByKeyValueInArray
} from './utils';

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

// manage the image cache
export const getImageFromCache = (filePath) => {
	let imgSrc;
	if (filePath) {
		imageCache.subscribe((currentValue) => {
			imgSrc = currentValue[filePath];
		});
	}
	return imgSrc;
};

export const addImageToCache = (filePath, imgSrc) => {
	imageCache.update((currentValue) => {
		currentValue[filePath] = imgSrc;
		return currentValue;
	});
};

export const removeImageFromCache = (filePath) => {
	imageCache.update((currentValue) => {
		delete currentValue[filePath];
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

// manage on/off screen people IDs
export const initializeOffScreenPeopleIdsArray = () => {
	let allPeople = undefined;
	familyTreeData.subscribe((currentValue) => {
		allPeople = currentValue.allPeople.map((person) => person.id);
	});

	tempState.update((currentValue) => {
		currentValue.personIdsOffScreen = allPeople;
		return currentValue;
	});
};

export const updateOffScreenPeopleIdsArray = () => {
	let activePerson;
	uiState.subscribe((currentValue) => {
		activePerson = currentValue.activePerson;
	});

	tempState.update((currentValue) => {
		const activePersonIndex = currentValue.personIdsOffScreen.indexOf(activePerson.id);
		// remove the active person from the list of candidates to show
		if (activePersonIndex > -1) {
			currentValue.personIdsOffScreen.splice(activePersonIndex, 1);
		}

		// get all the active person's relationships
		const relationships = activePerson.relationships;
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

export const updateFilteredOffScreenPeopleIdsArray = (filter) => {
	const filterUppercase = filter.toUpperCase();
	let activePersonName;
	uiState.subscribe((currentValue) => {
		activePersonName = currentValue.activePerson.name.toUpperCase();
	});

	tempState.update((currentValue) => {
		currentValue.personIdsOffScreenFiltered = [];

		// for each id, get name and see if the filter is contained in the name
		currentValue.personIdsOffScreen.forEach((sPersonId) => {
			const sPersonName = getPersonById(sPersonId).name.toUpperCase();
			if (sPersonName.indexOf(filterUppercase) > -1 && sPersonName !== activePersonName) {
				currentValue.personIdsOffScreenFiltered.push(sPersonId);
			} else {
				const nPersonIdIndex = currentValue.personIdsOffScreenFiltered.indexOf(sPersonId);
				if (nPersonIdIndex !== -1) {
					currentValue.personIdsOffScreenFiltered.splice(nPersonIdIndex, 1);
				}
			}
		});

		// if nothing in the text box, show all available people
		if (filterUppercase === '') {
			currentValue.personIdsOffScreenFiltered = currentValue.personIdsOffScreen;
		}

		return currentValue;
	});
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
