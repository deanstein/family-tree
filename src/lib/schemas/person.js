import relationshipMap from './relationship-map';
import { schemaVersion } from '$lib/versions';

// initial name in a new tree
export const starterPersonName = 'John Doe';
// name used for new person nodes
export const newPersonName = 'Firstname Lastname';

export const person = {
	version: schemaVersion,
	id: '0',
	name: newPersonName,
	alternateNames: [],
	gender: 'Unspecified',
	birth: {
		date: undefined,
		apprxDate: false,
		place: '',
		time: ''
	},
	hometown: '',
	deceased: false,
	death: {
		date: undefined,
		apprxDate: false,
		place: '',
		time: '',
		cause: ''
	},
	relationships: (() => {
		let relationships = {};
		Object.keys(relationshipMap).forEach((element) => {
			relationships[element] = [];
		});
		return relationships;
	})(),
	timelineEvents: [],
	timelineEventReferences: [],
	bioPhotoUrl: ''
};
