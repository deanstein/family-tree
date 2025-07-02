import { derived, writable } from 'svelte/store';

/*** ADMINISTRATION ***/
export let isAdminMode = writable(false); // can upload photos

/*** AUTH FORM ***/
export let authFormFirstName = writable(undefined);
export let authFormLastName = writable(undefined);
export let authFormBirthdate = writable(undefined);

/*** TREE EDITING ***/
// if true, node add/action buttons and relationship placeholders
// will display for tree editing
export let isTreeEditActive = writable(false);

/*** NODE EDITING ***/
// only one PersonNode edit instance can be active at a time
export let isNodeEditActive = writable(false);
// individual fields for PersonNode editing
export let nodeEditId = writable(undefined);
export let nodeEditName = writable(undefined);
export let nodeEditRelationshipId = writable(undefined);
export let nodeEditGroupId = writable(undefined);
export let nodeEditCompatibleGroups = writable(undefined);

/*** BIO EDITING ***/
// if set, bio edit mode becomes active
// and the inputs will be enabled
export let bioEditId = writable(undefined);
// if set, the alternate name modal will display
export let bioEditAltName = writable(undefined);
// the various alternate names associated with the active person
export let bioEditAltNames = writable([]);

/*** TIMELINE EVENT EDITING ***/
export let timelineEditEvent = writable(undefined);
// if true, all event input fields will be editable
export let isTimelineEventInEditMode = writable(false);

/*** IMAGE EDITING ***/
export let imageEditContent = writable(undefined);
export let isNewImage = writable(false);
// if set, media was just uploaded and this is the url to it
export let uploadedMediaUrl = writable(undefined);

// create a combined store to display in footer dev tools
const tempStateMap = {
	isAdminMode,
	authFormFirstName,
	authFormLastName,
	authFormBirthdate,
	isTreeEditActive,
	isNodeEditActive,
	nodeEditId,
	nodeEditName,
	nodeEditRelationshipId,
	nodeEditGroupId,
	nodeEditCompatibleGroups,
	bioEditId,
	bioEditAltName,
	bioEditAltNames,
	timelineEditEvent,
	imageEditContent
};
const tempStateEntries = Object.entries(tempStateMap);
// derived store containing all ui state values
export let allTempStateValues = derived(
	tempStateEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(tempStateEntries.map(([key], index) => [key, $stores[index]]))
);
