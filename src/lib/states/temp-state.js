import { derived, writable } from 'svelte/store';

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
// if set, the edit timeline event modal is displayed
export let timelineEditEventId = writable(undefined);
// if set, the timeline event modal inputs are enabled
export let timelineEditEvent = writable(undefined);

/*** TODO: MOVE TO UI STATE? ***/
// if set, the media gallery displays this media id
export let mediaGalleryId = writable(undefined);
// if set, the media gallery displays this media content
export let mediaGalleryContent = writable(undefined);
// if set, the media gallery displays these media items in the thumbnail group
export let mediaGalleryContentArray = writable(undefined);

/*** IMAGE EDITING ***/
// if set, the image editing modal is displayed
export let imageEditId = writable(undefined);
// if set, the image editing modal inputs are enabled
export let imageEditContent = writable(undefined);
// if set, media was just uploaded and this is the url to it
export let uploadedMediaUrl = writable(undefined);

// create a combined store to display in footer dev tools
const tempStateMap = {
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
	timelineEditEventId,
	timelineEditEvent,
	mediaGalleryId,
	mediaGalleryContent,
	mediaGalleryContentArray,
	imageEditId,
	imageEditContent
};
const tempStateEntries = Object.entries(tempStateMap);
// derived store containing all ui state values
export let allTempStateValues = derived(
	tempStateEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(tempStateEntries.map(([key], index) => [key, $stores[index]]))
);
