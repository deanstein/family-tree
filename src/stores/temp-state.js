import { writable } from 'svelte/store';

const tempState = {
	nodeEditPersonId: undefined,
	nodeSettingsFlyoutPersonId: undefined,
	bioEditPersonId: undefined,
	editAltName: undefined,
	altNames: [],
	timelineEditEventId: undefined,

	personNameTemporaryValue: undefined,
	relationshipIdTemporaryValue: undefined
};

export default writable(tempState);
