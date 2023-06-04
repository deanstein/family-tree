import { writable } from 'svelte/store';

const tempState = {
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
	timelineEditEvent: undefined
};

export default writable(tempState);
