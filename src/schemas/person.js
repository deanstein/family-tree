import relationshipMap from './relationship-map';
import { schemaVersion } from '../versions';

export const person = {
	version: schemaVersion,
	id: '0',
	name: 'Firstname Lastname',
	gender: 'undefined',
	birthdate: 'unspecified',
	deathdate: 'unspecified',
	relationships: (() => {
		let relationships = {};
		Object.keys(relationshipMap).forEach((element) => {
			relationships[element] = [];
		});
		return relationships;
	})()
};
