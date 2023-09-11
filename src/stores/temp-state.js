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

	// these are from the former node edit workflow, are they still used?
	nodeEditPersonId: undefined,
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
	timelineEditEvent: undefined
};

export default writable(tempState);
