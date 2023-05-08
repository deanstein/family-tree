import relationshipMap from './relationship-map';
import { schemaVersion } from '../versions';

export const person = {
	version: schemaVersion,
	id: '0',
	name: 'Firstname Lastname',
	alternateNames: [],
	gender: 'Unspecified',
	birth: {
		date: '',
		place: '',
		time: ''
	},
	hometown: '',
	deceased: false,
	death: {
		date: '',
		place: '',
		cause: ''
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
