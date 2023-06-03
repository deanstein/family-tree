import relationshipMap from './relationship-map';
import { schemaVersion } from '../versions';

export const defaultName = 'Firstname Lastname';
export const person = {
	version: schemaVersion,
	id: '0',
	name: defaultName,
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
		time: '',
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
