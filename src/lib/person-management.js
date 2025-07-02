import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

import { person } from '$lib/schemas/person';
import relationshipMap from '$lib/schemas/relationship-map';
import timelineEventImage from '$lib/schemas/timeline-event-image';
import timelineEventTypes from '$lib/schemas/timeline-event-types';
import timelineEvent from '$lib/schemas/timeline-event';
import { schemaVersion } from '$lib/versions';

import { activeFamilyTreeData, activePerson, hasUnsavedChanges } from './states/family-tree-state';
import { imageEditContent, timelineEditEvent, uploadedMediaUrl } from './states/temp-state';
import { showTimelineEventImageDetailModal } from './states/ui-state';

import { deleteFileFromRepoByUrl } from './persistence-management';
import { getPersonById, getPersonIndexById } from './tree-management';
import {
	addOrUpdatePersonInActivePersonGroup,
	removePersonFromActivePersonGroup
} from '$lib/ui-management';
import {
	deepMatchObjects,
	deleteObjectInArray,
	getObjectByKeyValueInArray,
	instantiateObject,
	isUrlValid,
	addOrReplaceObjectInArray
} from '$lib/utils';

export const createNewPerson = () => {
	const newPerson = JSON.parse(JSON.stringify(person)); // required to make a deep copy
	newPerson.id = uuidv4();
	return newPerson;
};

export const upgradePersonData = (personDataToMatch, personDataToModify) => {
	if (personDataToModify?.version == undefined) {
		personDataToModify['version'] = '0.0.0';
	}

	let upgraded = false;
	let originalVersion = personDataToModify?.version;

	if (personDataToModify?.version !== personDataToMatch?.version) {
		personDataToModify = deepMatchObjects(personDataToMatch, personDataToModify);
		upgraded = true;
	}

	if (upgraded) {
		personDataToModify['version'] = personDataToMatch.version;
		console.log(
			'Person upgraded: ' +
				personDataToModify.name +
				' (v' +
				originalVersion +
				') ' +
				'->' +
				' (v' +
				personDataToMatch.version +
				')'
		);
	}

	return personDataToModify;
};

// upgrades a person directly in activeFamilyTreeData via id
export const upgradePersonById = (personId) => {
	const newPerson = createNewPerson();

	// find the person by its id
	const foundPersonIndex = getPersonIndexById(personId);
	const foundPerson = getPersonById(personId);
	let upgradedPerson;

	// if there's a person, upgrade it if necessary
	if (foundPerson) {
		upgradedPerson = upgradePersonData(newPerson, foundPerson);
	}

	// set the person in familyTreeData
	activeFamilyTreeData.update((currentValue) => {
		currentValue.allPeople[foundPersonIndex] = upgradedPerson;
		return currentValue;
	});
};

// ensures a timeline event has the necessary fields
export const upgradeTimelineEvent = (eventToUpgrade) => {
	const originalVersion = eventToUpgrade.eventVersion;
	let originalContentString; // handle legacy timeline events
	let upgraded = false;

	// legacy timeline events may not have a type defined
	// if so, set these to generic
	if (eventToUpgrade.eventType === '' || eventToUpgrade.eventType === undefined) {
		eventToUpgrade.eventType = timelineEventTypes.generic.type;
	}

	// legacy timeline event content may be a single string,
	// so capture that before upgrading so it can be used later as the description
	if (typeof eventToUpgrade.eventContent === 'string') {
		originalContentString = eventToUpgrade.eventContent;
	}

	// only upgrade if the schema version doesn't match
	if (!eventToUpgrade?.eventVersion || eventToUpgrade?.eventVersion !== schemaVersion) {
		eventToUpgrade.eventVersion = schemaVersion;

		switch (eventToUpgrade.eventType) {
			case 'birth':
				deepMatchObjects(timelineEventTypes.birth.content, eventToUpgrade.eventContent, true);
				return eventToUpgrade;
			case 'death':
				deepMatchObjects(timelineEventTypes.death.content, eventToUpgrade.eventContent, true);
				return eventToUpgrade;
			default:
				deepMatchObjects(timelineEvent, eventToUpgrade, true);
				// content used to only be a string,
				// so set that as the description now
				if (originalContentString) {
					eventToUpgrade.eventContent.description = originalContentString;
				}
		}

		// also upgrade nested pieces of the timeline event content
		// like images:
		if (timelineEvent?.eventContent?.images?.length > 0) {
			const imageObject = instantiateObject(timelineEventImage);
			for (let image in timelineEvent.eventContent.images) {
				deepMatchObjects(imageObject, image);
			}
		}
		// rename any existing arrays of associatedPeople to associatedPeopleIds
		if (eventToUpgrade?.eventContent?.associatedPeople) {
			// delete the old property (this was never populated)
			delete eventToUpgrade.eventContent.associatedPeople;
			// add new IDs prop
			eventToUpgrade.eventContent.associatedPeopleIds = [];
		}

		upgraded = true;
	}

	if (upgraded) {
		console.log('Timeline event upgraded (' + originalVersion + ') -> (' + schemaVersion + ').');
	}

	return eventToUpgrade;
};

// gets IDs of all related people to this person
export const getPersonRelationshipIds = (person) => {
	return Object.values(person.relationships)
		.flat() // Flatten the arrays
		.map((rel) => rel.id); // Extract the IDs
};

export const getPersonBirthYear = (person) => {
	let birthYear;

	const birthdate = person.birth.date;
	birthYear = new Date(birthdate).getFullYear();

	return birthYear;
};

export const getPersonAge = (person) => {
	let age;

	const birthYear = new Date(person.birth.date).getFullYear();
	const deathOrCurrentYear = person.death.date
		? new Date(person.death.date).getFullYear()
		: new Date().getFullYear();

	if (birthYear && deathOrCurrentYear) {
		age = deathOrCurrentYear - birthYear;
	}

	return age;
};

export const setPersonName = (sPersonId, sName) => {
	activeFamilyTreeData.update((currentValue) => {
		let personIndex = getPersonIndexById(sPersonId);
		// @ts-ignore
		currentValue.allPeople[personIndex].name = sName;
		return currentValue;
	});
};

export const setBioPhotoUrlFromTempState = () => {
	const tempStateUrl = get(uploadedMediaUrl);

	// if the url is valid, set it as the bio photo url for the active person
	if (isUrlValid(tempStateUrl)) {
		activePerson.update((currentValue) => ({
			...currentValue,
			bioPhotoUrl: tempStateUrl
		}));
	}

	// clear the temp state
	uploadedMediaUrl.set(undefined);
};

export const setPersonRelationship = (sPersonId, sExistingRelationshipId, sNewRelationshipId) => {
	removePersonFromActivePersonGroup(sPersonId, sExistingRelationshipId);
	addOrUpdatePersonInActivePersonGroup(sPersonId, sNewRelationshipId);
};

export const addOrUpdateActivePersonInNewPersonGroup = (personId, groupId) => {
	activeFamilyTreeData.update((currentValue) => {
		const activePersonId = get(activePerson).id;
		const sInverseRelationshipId = getInverseRelationshipId(groupId);
		const sInverseGroupId = getInverseGroupId(groupId);
		const nPersonIndex = getPersonIndexById(personId);
		// @ts-ignore
		const person = currentValue.allPeople[nPersonIndex];

		const activePersonRelationship = {
			id: activePersonId,
			relationshipId: sInverseRelationshipId
		};

		const matchingRelationship = getObjectByKeyValueInArray(
			person.relationships[sInverseGroupId],
			'id',
			activePersonId
		);
		const nGroupIndex =
			get(activePerson).relationships[sInverseGroupId].indexOf(matchingRelationship);

		// only add if it doesn't exist yet
		if (!matchingRelationship) {
			person.relationships[sInverseGroupId].push(activePersonRelationship);
			// but if it exists, update with the new relationship id
		} else {
			if (nGroupIndex !== -1) {
				person.relationships[sInverseGroupId][nGroupIndex].relationshipId = sInverseRelationshipId;
			}
		}

		return currentValue;
	});
};

export const getInverseGroupId = (groupId) => {
	let inverseGroupId;

	switch (groupId) {
		case relationshipMap.grandparentsMaternal.id:
		case relationshipMap.grandparentsPaternal.id:
			inverseGroupId = relationshipMap.grandchildren.id;
			break;
		case relationshipMap.greatAunclesMaternal.id:
		case relationshipMap.greatAunclesPaternal.id:
			inverseGroupId = relationshipMap.grandniblings.id;
			break;
		case relationshipMap.parents.id:
			inverseGroupId = relationshipMap.children.id;
			break;
		case relationshipMap.parentsInLaw.id:
			inverseGroupId = relationshipMap.childrenInLaw.id;
			break;
		case relationshipMap.stepparentsMaternal.id:
		case relationshipMap.stepparentsPaternal.id:
			inverseGroupId = relationshipMap.stepchildren.id;
			break;
		case relationshipMap.aunclesMaternal.id:
		case relationshipMap.aunclesPaternal.id:
			inverseGroupId = relationshipMap.niblings.id;
			break;
		case relationshipMap.secondCousinsAbove.id:
			inverseGroupId = relationshipMap.secondCousinsBelow.id;
			break;
		case relationshipMap.cousins.id:
			inverseGroupId = relationshipMap.cousin.id;
			break;
		case relationshipMap.siblings.id:
			inverseGroupId = relationshipMap.siblings.id;
			break;
		case relationshipMap.halfSiblingsMaternal.id:
			inverseGroupId = relationshipMap.halfSiblingsMaternal.id;
			break;
		case relationshipMap.halfSiblingsPaternal.id:
			inverseGroupId = relationshipMap.halfSiblingsPaternal.id;
			break;
		case relationshipMap.stepsiblings.id:
			inverseGroupId = relationshipMap.stepsiblings.id;
			break;
		case relationshipMap.siblingsInLaw.id:
			inverseGroupId = relationshipMap.siblingsInLaw.id;
			break;
		case relationshipMap.spouses.id:
			inverseGroupId = relationshipMap.spouses.id;
			break;
		case relationshipMap.spouseSiblingsInLaw.id:
			inverseGroupId = relationshipMap.siblingsInLaw.id;
			break;
		case relationshipMap.exSpouses.id:
			inverseGroupId = relationshipMap.exSpouses.id;
			break;
		case relationshipMap.children.id:
			inverseGroupId = relationshipMap.parents.id;
			break;
		case relationshipMap.childrenInLaw.id:
			inverseGroupId = relationshipMap.parentsInLaw.id;
			break;
		case relationshipMap.niblings.id:
			inverseGroupId = relationshipMap.aunclesMaternal.id;
			break;
		case relationshipMap.stepchildren.id:
			inverseGroupId = relationshipMap.stepparentsMaternal.id;
			break;
		case relationshipMap.grandchildren.id:
			inverseGroupId = relationshipMap.grandparentsMaternal.id;
			break;
		case relationshipMap.grandniblings.id:
			inverseGroupId = relationshipMap.greatAunclesMaternal.id;
			break;
		case relationshipMap.secondCousinsBelow.id:
			inverseGroupId = relationshipMap.secondCousinsAbove.id;
			break;
		default:
			return undefined;
	}

	if (!inverseGroupId) {
		console.warn('Failed to find an inverse group id for group: ' + groupId);
	}

	return inverseGroupId;
};

export const getInverseRelationshipId = (groupId) => {
	let inverseId = undefined;
	const activePersonGender = get(activePerson).gender;

	switch (groupId) {
		case relationshipMap.grandparentsMaternal.id:
		case relationshipMap.grandparentsPaternal.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.grandchildren.grandson.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.grandchildren.granddaughter.id;
			} else {
				inverseId = relationshipMap.grandchildren.grandchild.id;
			}
			break;
		case relationshipMap.greatAunclesMaternal.id:
		case relationshipMap.greatAunclesPaternal.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.grandniblings.grandnephew.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.grandniblings.grandniece.id;
			} else {
				inverseId = relationshipMap.grandniblings.grandnibling.id;
			}
			break;
		case relationshipMap.parents.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.children.son.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.children.daughter.id;
			} else {
				inverseId = relationshipMap.children.child.id;
			}
			break;
		case relationshipMap.parentsInLaw.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.childrenInLaw.sonInLaw.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.childrenInLaw.daughterInLaw.id;
			} else {
				inverseId = relationshipMap.childrenInLaw.childInLaw.id;
			}
			break;
		case relationshipMap.stepparentsMaternal.id:
		case relationshipMap.stepparentsPaternal.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.stepchildren.stepson.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.stepchildren.stepdaughter.id;
			} else {
				inverseId = relationshipMap.stepchildren.stepchild.id;
			}
			break;
		case relationshipMap.aunclesMaternal.id:
		case relationshipMap.aunclesPaternal.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.niblings.nephew.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.niblings.niece.id;
			} else {
				inverseId = relationshipMap.niblings.nibling.id;
			}
			break;
		case relationshipMap.secondCousinsAbove.id:
			inverseId = relationshipMap.secondCousinsBelow.secondCousinBelow.id;
			break;
		case relationshipMap.cousins.id:
			inverseId = relationshipMap.cousins.cousin.id;
			break;
		case relationshipMap.siblings.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.siblings.brother.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.siblings.sister.id;
			} else {
				inverseId = relationshipMap.siblings.sibling.id;
			}
			break;
		case relationshipMap.halfSiblingsMaternal.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.halfSiblingsMaternal.halfBrotherMaternal.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.halfSiblingsMaternal.halfSisterMaternal.id;
			} else {
				inverseId = relationshipMap.halfSiblingsMaternal.halfSiblingMaternal.id;
			}
			break;
		case relationshipMap.halfSiblingsPaternal.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.halfSiblingsPaternal.halfBrotherPaternal.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.halfSiblingsPaternal.halfSisterPaternal.id;
			} else {
				inverseId = relationshipMap.halfSiblingsPaternal.halfSiblingPaternal.id;
			}
			break;
		case relationshipMap.stepsiblings.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.stepsiblings.stepbrother.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.stepsiblings.stepsister.id;
			} else {
				inverseId = relationshipMap.stepsiblings.stepsibling.id;
			}
			break;
		case relationshipMap.siblingsInLaw.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.siblingsInLaw.brotherInLaw.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.siblingsInLaw.sisterInLaw.id;
			} else {
				inverseId = relationshipMap.siblingsInLaw.siblingInLaw.id;
			}
			break;
		case relationshipMap.spouses.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.spouses.husband.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.spouses.wife.id;
			} else {
				inverseId = relationshipMap.spouses.partner.id;
			}
			break;
		case relationshipMap.spouseSiblingsInLaw.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.spouseSiblingsInLaw.spouseBrotherInLaw.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.spouseSiblingsInLaw.spouseSisterInLaw.id;
			} else {
				inverseId = relationshipMap.spouseSiblingsInLaw.spouseSiblingInLaw.id;
			}
			break;
		case relationshipMap.exSpouses.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.exSpouses.exHusband.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.exSpouses.exWife.id;
			} else {
				inverseId = relationshipMap.exSpouses.exPartner.id;
			}
			break;
		case relationshipMap.children.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.parents.father.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.parents.mother.id;
			} else {
				inverseId = relationshipMap.parents.parent.id;
			}
			break;
		case relationshipMap.stepchildren.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.stepparentsPaternal.stepfatherPaternal.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.stepparentsPaternal.stepmotherPaternal.id;
			} else {
				inverseId = relationshipMap.stepparentsPaternal.stepparentPaternal.id;
			}
			break;
		case relationshipMap.childrenInLaw.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.parentsInLaw.fatherInLaw.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.parentsInLaw.motherInLaw.id;
			} else {
				inverseId = relationshipMap.parentsInLaw.parentInLaw.id;
			}
			break;
		case relationshipMap.niblings.id:
			if (activePersonGender === 'male') {
				inverseId = relationshipMap.aunclesMaternal.uncleMaternal.id;
			} else if (activePersonGender === 'female') {
				inverseId = relationshipMap.aunclesMaternal.auntMaternal.id;
			} else {
				inverseId = relationshipMap.aunclesMaternal.auntMaternal.id;
			}
			break;
		case relationshipMap.grandchildren.id:
			inverseId = relationshipMap.grandparentsMaternal.grandparentMaternal.id;
			break;
		case relationshipMap.grandniblings.id:
			inverseId = relationshipMap.greatAunclesMaternal.greatAuncleMaternal.id;
			break;
		case relationshipMap.secondCousinsBelow.id:
			inverseId = relationshipMap.secondCousinsBelow.secondCousinBelow;
			break;
		default:
			return undefined;
	}

	if (!inverseId) {
		console.warn('Failed to find an inverse relationship id for group: ' + groupId);
	}

	return inverseId;
};

export const getGroupIdFromRelationshipId = (relationshipId) => {
	let groupId;

	for (let key in relationshipMap) {
		if (typeof relationshipMap[key] === 'object') {
			for (let nestedKey in relationshipMap[key]) {
				if (relationshipMap[key][nestedKey].id === relationshipId) {
					groupId = relationshipMap[key].id;
					break;
				}
			}
		}
	}

	return groupId;
};

export const getRelationshipNameById = (relationshipId, compatibleGroups) => {
	const groupId = getGroupIdFromRelationshipId(relationshipId);
	if (relationshipId && compatibleGroups.hasOwnProperty(groupId)) {
		return compatibleGroups[groupId][relationshipId]?.label;
	}
	return undefined;
};

export function getDefaultRelationshipType(relationshipGroup) {
	for (const key in relationshipGroup) {
		if (typeof relationshipGroup[key] === 'object') {
			return relationshipGroup[key];
		}
	}
	return null;
}

// timeline event management
export const getTimelineEventById = (personId, eventId) => {
	// get the person by id
	let person;
	// if it's the active person, use that instead of searching
	const activePersonId = get(activePerson).id;
	if (personId === activePersonId) {
		person = get(activePerson);
	} else {
		person = getPersonById(personId);
	}

	let timelineEvent;
	if (person && eventId) {
		timelineEvent = getObjectByKeyValueInArray(person.timelineEvents, 'eventId', eventId);
	}

	return timelineEvent;
};

export const addOrReplaceTimelineEvent = (event) => {
	if (!event) return;

	activePerson.update((currentValue) => ({
		...currentValue,
		timelineEvents: getObjectByKeyValueInArray(
			currentValue.timelineEvents,
			'eventId',
			event.eventId
		)
			? addOrReplaceObjectInArray(currentValue.timelineEvents, 'eventId', event.eventId, event)
			: [...currentValue.timelineEvents, event]
	}));
};

export const deleteTimelineEvent = (timelineEvent) => {
	if (!timelineEvent) {
		console.error('The supplied timeline event was undefined and cannot be deleted');
		return;
	}

	activePerson.update((currentValue) => {
		let updatedEvents = currentValue.timelineEvents;

		const eventExists = getObjectByKeyValueInArray(updatedEvents, 'eventId', timelineEvent.eventId);

		if (eventExists) {
			deleteAllTimelineEventImagesFromRepo(timelineEvent);
			updatedEvents = deleteObjectInArray(updatedEvents, 'eventId', timelineEvent.eventId);
		}

		console.log('Final updated events', updatedEvents);

		return { ...currentValue, timelineEvents: updatedEvents };
	});
};

export const deleteAllTimelineEventImagesFromRepo = async (timelineEvent) => {
	timelineEvent?.eventContent?.images.forEach(async (eventImage) => {
		console.log('deleting image: ', eventImage.url);
		await deleteFileFromRepoByUrl(eventImage.url);
	});
};

export const addOrReplaceTimelineEventImage = (timelineEventId, newImageContent) => {
	const activePersonId = get(activePerson).id;
	const existingTimelineEvent = getTimelineEventById(activePersonId, timelineEventId);
	// update either the existing event in this person, or the new event in the temp state
	const timelineEventToUpdate = existingTimelineEvent ?? get(timelineEditEvent);
	// update the timeline event with the new image
	const updatedTimelineEvent = {
		...timelineEventToUpdate,
		eventContent: {
			...timelineEventToUpdate?.eventContent,
			images: addOrReplaceObjectInArray(
				timelineEventToUpdate?.eventContent?.images,
				'id',
				newImageContent.id,
				newImageContent
			)
		}
	};
	// update the timeline event in the ui state
	addOrReplaceTimelineEvent(updatedTimelineEvent);
	// update the temp state event so the modal shows the updated content
	timelineEditEvent.set(updatedTimelineEvent);
	imageEditContent.set(newImageContent);
	// show the unsaved changes notification
	hasUnsavedChanges.set(true);
};

export const addTimelineEventReference = (targetPersonId, timelineEventReference) => {
	// get the target person by the id
	let targetPersonIndex = getPersonIndexById(targetPersonId);
	activeFamilyTreeData.update((currentValue) => {
		currentValue.allPeople[targetPersonIndex].timelineEventReferences.push(timelineEventReference);
		return currentValue;
	});
};

export const removeTimelineEventReference = (targetPersonId, referenceEventId) => {
	// get the target person by the id
	let targetPersonIndex = getPersonIndexById(targetPersonId);
	activeFamilyTreeData.update((currentValue) => {
		deleteObjectInArray(
			currentValue.allPeople[targetPersonIndex].timelineEventReferences,
			'eventId',
			referenceEventId
		);
		return currentValue;
	});
};

// timeline event media management
export const setTimelineEventImageUrlFromTempState = () => {
	// get these values from the temp state
	const timelineEventImageContentFromTempState = get(imageEditContent);
	const mediaUrlFromTempState = get(uploadedMediaUrl);

	// make a copy of the active event image
	const newImage = instantiateObject(timelineEventImageContentFromTempState);
	newImage.url = mediaUrlFromTempState;

	// if the url is valid, update the image in the active person
	if (isUrlValid(mediaUrlFromTempState)) {
		addOrReplaceTimelineEventImage(timelineEventImageContentFromTempState.eventId, newImage);
	}

	// clear the temp state
	uploadedMediaUrl.set(undefined);
};

// delete references to repo images in the active person
// typically used as "afterDelete" functions, after the actual image in the repo is deleted
export const deleteBioPhotoReference = () => {
	activePerson.update((currentValue) => ({ ...currentValue, bioPhotoUrl: '' }));
};

export const deleteTimelineEventImageReference = (timelineEventId, imageId) => {
	// make a copy of the timeline event to modify
	const newTimelineEvent = getTimelineEventById(get(activePerson).id, timelineEventId);
	// delete the image from the timeline event
	deleteObjectInArray(newTimelineEvent?.eventContent?.images, 'id', imageId);
	// update the temp state event so the modal shows the updated content
	timelineEditEvent.set(newTimelineEvent);
	// remove the id and content of the edited image in the temp state
	showTimelineEventImageDetailModal.set(false);
	imageEditContent.set(undefined);
	// show the unsaved changes notification
	hasUnsavedChanges.set(true);
};
