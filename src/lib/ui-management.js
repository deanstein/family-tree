import { get } from 'svelte/store';

import { relationship } from './schemas/relationship';
import timelineEvent from './schemas/timeline-event';
import timelineEventTypes from './schemas/timeline-event-types';
import timelineEventReference from './schemas/timeline-event-reference';
import timelineRowItem from './schemas/timeline-row-item';

import { activePerson, persistenceStatus } from './states/family-tree-state';
import { personNodePositions, timelineCanvasScrollState } from './states/ui-state';

import {
	getPersonById,
	getGroupIdFromRelationshipId,
	getTimelineEventById
} from '$lib/person-management';
import { instantiateObject, largest } from './utils';

import { persistenceStrings, timelineEventStrings } from '$lib/components/strings';
import stylingConstants from '$lib/components/styling-constants';

export const addOrUpdatePersonInActivePersonGroup = (sPersonId, sRelationshipId) => {
	activePerson.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = instantiateObject(relationship);
		personReferenceObject.id = sPersonId;
		personReferenceObject.relationshipId = sRelationshipId;

		const foundPersonReferenceObject = currentValue.relationships[sGroupId].find((personObject) => {
			if (personObject.id === sPersonId) return personReferenceObject;
		});
		const nGroupIndex = currentValue.relationships[sGroupId].indexOf(foundPersonReferenceObject);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			currentValue.relationships[sGroupId].push(personReferenceObject);
			// but if it exists, update with the new relationship id
		} else {
			console.log('blocked from adding');
			currentValue.relationships[sGroupId][nGroupIndex].relationshipId = sRelationshipId;
		}

		return currentValue;
	});
};

export const removePersonFromActivePersonGroup = (sPersonId, sRelationshipId) => {
	activePerson.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = instantiateObject(relationship);
		personReferenceObject.id = sPersonId;
		personReferenceObject.relationshipId = sRelationshipId;

		const foundPersonReferenceObject = currentValue.relationships[sGroupId].find((personObject) => {
			if (personObject.id === sPersonId) return personReferenceObject;
		});

		const nSpliceIndex = currentValue.relationships[sGroupId].indexOf(foundPersonReferenceObject);

		if (nSpliceIndex > -1) {
			currentValue.relationships[sGroupId].splice(nSpliceIndex, 1);
		}

		return currentValue;
	});
};

export const getNotificationConfigFromRepoState = () => {
	let message;
	let color;

	switch (get(persistenceStatus)) {
		case persistenceStrings.loading:
			message = persistenceStrings.loading;
			color = stylingConstants.colors.notificationColorInProgress;
			break;
		case persistenceStrings.loadSuccessful:
			message = persistenceStrings.loadSuccessful;
			color = stylingConstants.colors.notificationColorSuccess;
			break;
		case persistenceStrings.saved:
			message = persistenceStrings.saved;
			color = stylingConstants.colors.notificationColorInformation;
			break;
		case persistenceStrings.saving:
			message = persistenceStrings.saving;
			color = stylingConstants.colors.notificationColorInProgress;
			break;
		case persistenceStrings.saveSuccessful:
			message = persistenceStrings.saveSuccessful;
			color = stylingConstants.colors.notificationColorSuccess;
			break;
		case persistenceStrings.unsavedChanges:
			message = persistenceStrings.unsavedChanges;
			color = stylingConstants.colors.notificationColorWarning;
			break;
		case persistenceStrings.loadFailed:
			message = persistenceStrings.loadFailed;
			color = stylingConstants.colors.notificationColorError;
			break;
		case persistenceStrings.saveFailed:
			message = persistenceStrings.saveFailed;
			color = stylingConstants.colors.notificationColorError;
			break;
		default:
			message = persistenceStrings.undefined;
			color = stylingConstants.colors.notificationColorInformation;
	}

	return { message, color };
};

export const setTimelineCanvasScrollState = (scrollingCanvasRef) => {
	if (!scrollingCanvasRef) {
		return;
	}
	// the cases to determine whether to show margin at the top and bottom of the timeline spine
	const scrolledToTop = scrollingCanvasRef.scrollTop === 0;
	const scrolledToBottom =
		scrollingCanvasRef.offsetHeight + scrollingCanvasRef.scrollTop >=
		scrollingCanvasRef.scrollHeight;
	const noScrollAvailable = scrollingCanvasRef.clientHeight === scrollingCanvasRef.scrollHeight;
	let updatedTimelineCanvasScroll = {
		// scrolled to top?
		top: scrolledToTop,
		// scrolled to bottom?
		bottom: scrolledToBottom || noScrollAvailable
	};
	timelineCanvasScrollState.set(updatedTimelineCanvasScroll);
};

export const getTimelineProportionByDate = (person, eventDate) => {
	// this covers the case where the birthday is unknown, so force the div to the top (0 proportion)
	if (eventDate === '') {
		return 0;
	}

	const startDate = new Date(person.birth.date);
	// end date is the death date if deceased or today
	const endDate = person.death.date ? new Date(person.death.date) : new Date();

	// lifespan and event duration in milliseconds
	const lifespanMs = Math.abs(endDate.getTime() - startDate.getTime()) - 1;
	const eventDurationMs = Math.abs(new Date(eventDate).getTime() - startDate.getTime());

	// proportion is event duration divided by lifespan, in milliseconds
	let proportion = eventDurationMs / lifespanMs;

	return proportion;
};

export const getClosestTimelineRowByDate = (person, eventDate, totalRows) => {
	const closestRow = Math.ceil(getTimelineProportionByDate(person, eventDate) * totalRows);
	return closestRow;
};

// converts raw timeline events from a person to timeline row items for UI
// row items include an index to properly sort based on chronology
export const generateTimelineRowItems = (person) => {
	let timelineEventRowItems = [];
	let timelineEventReferenceRowItems = [];
	let numberOfRows = largest(
		person.timelineEvents.length + person.timelineEventReferences.length,
		stylingConstants.quantities.initialTimelineRowCount
	);
	// generate the regular events
	for (let i = 0; i < person.timelineEvents.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(timelineRowItem);
		// get the index this item belongs to
		const rowIndex = getClosestTimelineRowByDate(
			person,
			person.timelineEvents[i].eventDate,
			numberOfRows
		);
		thisRowItem.index = rowIndex;
		thisRowItem.event = person.timelineEvents[i];
		if (!isNaN(rowIndex)) {
			timelineEventRowItems.push(thisRowItem);
		}
	}
	// generate the event references
	for (let i = 0; i < person.timelineEventReferences.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(timelineRowItem);
		// get the index this item belongs to
		const eventFromReference = getTimelineEventById(
			person.timelineEventReferences[i].personId,
			person.timelineEventReferences[i].eventId
		);
		const rowIndex = getClosestTimelineRowByDate(
			person,
			eventFromReference.eventDate,
			numberOfRows
		);
		thisRowItem.index = rowIndex;
		thisRowItem.event = eventFromReference;
		thisRowItem.eventReference = person.timelineEventReferences[i];
		if (!isNaN(rowIndex)) {
			timelineEventReferenceRowItems.push(thisRowItem);
		}
	}
	// also generate special reference events:
	// births of kids
	const childrenRelationships = person.relationships.children;
	for (let i = 0; i < childrenRelationships.length; i++) {
		// get the child
		const childPerson = getPersonById(childrenRelationships[i].id);
		const childBirthdate = childPerson?.birth?.date;
		// this person's birthdate and the child's birthdate must be known
		if (person.birth.date && childBirthdate) {
			// create the birth event
			let birthEvent = instantiateObject(timelineEvent);
			birthEvent.eventType = timelineEventTypes.child.type;
			birthEvent.eventDate = childBirthdate;
			birthEvent.eventContent.description = childPerson.name + ' born';
			// create the event reference
			let eventReference = instantiateObject(timelineEventReference);
			eventReference.personId = childrenRelationships[i].id;
			// create the row item
			let thisRowItem = instantiateObject(timelineRowItem);
			const rowIndex = getClosestTimelineRowByDate(person, childBirthdate, numberOfRows);
			thisRowItem.index = rowIndex;
			thisRowItem.event = birthEvent;
			thisRowItem.eventReference = eventReference;
			if (!isNaN(rowIndex)) {
				timelineEventReferenceRowItems.push(thisRowItem);
			}
		}
	}
	// deaths of parents
	const parentRelationships = person.relationships.parents;
	for (let i = 0; i < parentRelationships.length; i++) {
		// get the parent
		const parentPerson = getPersonById(parentRelationships[i].id);
		const parentDeathDate = parentPerson?.death?.date;
		// this person's birthdate and the child's birthdate must be known
		if (person.birth.date && parentDeathDate) {
			// create the birth event
			let deathEvent = instantiateObject(timelineEvent);
			deathEvent.eventType = timelineEventTypes.death.type;
			deathEvent.eventDate = parentDeathDate;
			deathEvent.eventContent.description = parentPerson.name + ' died';
			// create the event reference
			let eventReference = instantiateObject(timelineEventReference);
			eventReference.personId = parentRelationships[i].id;
			// create the row item
			let thisRowItem = instantiateObject(timelineRowItem);
			const rowIndex = getClosestTimelineRowByDate(person, parentDeathDate, numberOfRows);
			thisRowItem.index = rowIndex;
			thisRowItem.event = deathEvent;
			thisRowItem.eventReference = eventReference;
			if (!isNaN(rowIndex)) {
				timelineEventReferenceRowItems.push(thisRowItem);
			}
		}
	}

	return [...timelineEventRowItems, ...timelineEventReferenceRowItems];
};

// sorts timeline event row items by date
// and ensurs any conflicting row indices are resolved
export const updateTimelineRowItems = (rowItems) => {
	const sortedRowItems = rowItems.sort(
		(a, b) => new Date(a.event.eventDate).getTime() - new Date(b.event.eventDate).getTime()
	);
	let indices = sortedRowItems.map((rowItem) => rowItem.index);
	let duplicates = indices.filter((item, index) => indices.indexOf(item) != index);
	while (duplicates.length > 0) {
		let conflictingRowItems = sortedRowItems.filter((obj) => obj.index === duplicates[0]);
		for (let i = 1; i < conflictingRowItems.length; i++) {
			conflictingRowItems[i].index++;
		}
		indices = sortedRowItems.map((rowItem) => rowItem.index);
		duplicates = indices.filter((item, index) => indices.indexOf(item) != index);
	}
	return sortedRowItems;
};

export const getModalTitleByEventType = (eventType) => {
	switch (eventType) {
		case timelineEventTypes.birth.type:
			return timelineEventStrings.birthEventModalTitle;
		case timelineEventTypes.death.type:
			return timelineEventStrings.deathEventModalTitle;
		default:
			return timelineEventStrings.textEventModalTitle;
	}
};

export const addOrUpdatePersonNodePosition = (personId, nodePosition) => {
	if (personId && nodePosition) {
		personNodePositions.update((currentValue) => [
			...currentValue.filter((pos) => pos.personId !== personId),
			{ personId, ...nodePosition }
		]);
	}
};

export const removePersonNodePosition = (personId) => {
	if (personId) {
		personNodePositions.update((currentValue) =>
			currentValue.filter((pos) => pos.personId !== personId)
		);
	}
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

export const clearCanvas = (canvasRef) => {
	if (!canvasRef) {
		return;
	}
	canvasRef.getContext('2d').clearRect(0, 0, canvasRef.width, canvasRef.height);
};

export const resetCanvasSize = (canvasRef) => {
	if (!canvasRef) {
		return;
	}
	set2DContextScale(canvasRef);
	canvasRef.width = window.innerWidth;
	canvasRef.height = window.innerHeight;
};

// adjust the 2D context of a canvas to take into consideration the device pixel ratio
export const set2DContextScale = (canvasRef) => {
	const context2d = canvasRef.getContext('2d');
	const pixelRatio = window.devicePixelRatio || 1;
	canvasRef.width = window.innerWidth * pixelRatio;
	canvasRef.height = window.innerHeight * pixelRatio;
	context2d.scale(pixelRatio, pixelRatio);
};

export const getDivCentroid = (element) => {
	if (!element) {
		return undefined;
	}
	const rect = element.getBoundingClientRect();
	const position = {
		x: rect.left + window.scrollX + rect.width / 2,
		y: rect.top + window.scrollY + rect.height / 2
	};

	return position;
};

export const getScreenCentroid = () => {
	return {
		x: document.documentElement.clientWidth / 2,
		y: window.innerHeight / 2
	};
};

export const adjustRgbaColorTransparency = (rgbaColor, transparency) => {
	let startIndex = rgbaColor.lastIndexOf(',') + 1;
	let endIndex = rgbaColor.lastIndexOf(')');
	let newString = rgbaColor.slice(0, startIndex) + ' ' + transparency + rgbaColor.slice(endIndex);
	return newString;
};
