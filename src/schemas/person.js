import relationshipMap from './relationship-map';
import { schemaVersion } from '../versions';

export const person = {
	version: schemaVersion,
	id: '0',
	name: 'Firstname Lastname',
	alternateNames: [],
	gender: null,
	birth: {
		date: null,
		place: null
	},
	hometown: null,
	deceased: false,
	death: {
		date: null,
		place: null,
		cause: null
	},
	relationships: (() => {
		let relationships = {};
		Object.keys(relationshipMap).forEach((element) => {
			relationships[element] = [];
		});
		return relationships;
	})()
};

export const gender = {
	unspecified: {
		id: undefined,
		label: 'Unspecified'
	},
	female: {
		id: 'female',
		label: 'Female'
	},
	male: {
		id: 'male',
		label: 'Male'
	}
};
