import { writable } from 'svelte/store';

const tempState = {
	buildMode: false,
	personIdsOffScreen: [],
	personIdsOffScreenFiltered: [],
	nodeActionsModalPersonId: undefined,
	nodeEditPersonId: undefined,
	nodeEditName: undefined,
	nodeEditRelationshipId: undefined,
	nodeEditGroupId: undefined,
	nodeEditCompatibleGroups: undefined,
	bioEditPersonId: undefined,
	bioEditAltName: undefined,
	bioEditAltNames: [],
	timelineEditEvent: undefined, // when defined, shows the edit timeline event modal
	timelineEditEventId: undefined // when defined, inputs of edit event modal are enabled
};

export default writable(tempState);
