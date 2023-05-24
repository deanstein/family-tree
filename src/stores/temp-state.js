import { writable } from 'svelte/store';

const tempState = {
	nodeActionsModalPersonId: undefined,
	nodeEditPersonId: undefined,
	nodeEditName: undefined,
	nodeEditRelationshipId: undefined,
	nodeEditGroupId: undefined,
	nodeEditCompatibleGroups: undefined,
	bioEditPersonId: undefined,
	bioEditAltName: undefined,
	bioEditAltNames: [],
	timelineEditEventId: undefined,

	personNameTemporaryValue: undefined,
	relationshipIdTemporaryValue: undefined
};

export default writable(tempState);
