import { writable } from 'svelte/store';

const tempState = {
	// if true, the add node buttons and relationship placeholders display for tree editing
	buildMode: false,

	// all the known people who aren't currently on screen
	// this is used for showing a list of available people
	personIdsOffScreen: [],
	// same list as above, but filtered by text input value
	personIdsOffScreenFiltered: [],

	// if set, the node actions modal will display
	nodeActionsModalPersonId: undefined,
	// individual fields for node actions modal
	nodeEditName: undefined,
	nodeEditRelationshipId: undefined,
	nodeEditGroupId: undefined,
	nodeEditCompatibleGroups: undefined,

	// if set, the bio edit mode becomes active
	// and the inputs will be enabled
	bioEditPersonId: undefined,
	// if set, the alternate name modal will display
	bioEditAltName: undefined,
	// the various alternate names associated with the active person
	bioEditAltNames: [],

	// if set, the edit timeline event modal is displayed
	timelineEditEventId: undefined,
	// if set, the timeline event modal inputs are enabled
	timelineEditEvent: undefined,

	// if set, the media gallery displays this media id
	mediaGalleryActiveId: undefined,
	// if set, the media gallery displays this media content
	mediaGalleryActiveContent: undefined,
	// if set, the media gallery displays these media items in the thumbnail group
	mediaGalleryContentArray: undefined,

	// if set, the image editing modal is displayed
	imageEditId: undefined,
	// if set, the image editing modal inputs are enabled
	imageEditContent: undefined,

	// if set, media was just uploaded and this is the url to it
	uploadedMediaUrl: undefined
};

export default writable(tempState);
