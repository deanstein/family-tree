import relationshipMap from './relationship-map';
import { schemaVersion } from '../versions';

export const person = {
	version: schemaVersion,
	id: '0',
	name: 'Firstname Lastname',
	alternateNames: [],
	gender: undefined,
	birth: {
		date: undefined,
		place: undefined
	},
	hometown: undefined,
	deceased: false,
	death: {
		date: undefined,
		place: undefined,
		cause: undefined
	},
	relationships: (() => {
		let relationships = {};
		Object.keys(relationshipMap).forEach((element) => {
			relationships[element] = [];
		});
		return relationships;
	})()
};
