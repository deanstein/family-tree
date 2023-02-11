import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

import { buildEmptyRelationships } from '../logic/personManagement';
import relationshipMap from './relationshipMap';

const dataVersion = '0.5.0';
const familyTreeData = {};

const activePerson = {};

let relationships = buildEmptyRelationships();
const defaultPerson = {
	version: dataVersion,
	id: 0,
	name: 'Firstname Lastname',
	birthdate: 'unspecified',
	gender: undefined,
	relationships: relationships
};

const people = [
	{
		id: 2,
		name: 'Kendall Roy',
		birthdate: '3/15/1975',
		parents: [],
		siblings: [4, 3, 5],
		spouses: [],
		children: []
	},
	{
		id: 3,
		name: 'Roman Roy',
		birthdate: '3/15/1975',
		parents: [],
		siblings: [4, 2, 5],
		activeSpouses: [],
		exSpouses: [],
		children: []
	},
	{
		id: 4,
		name: 'Connor Roy',
		birthdate: '8/10/1968',
		parents: [],
		siblings: [2, 3, 5],
		activeSpouses: [],
		exSpouses: [],
		children: []
	},
	{
		id: 5,
		name: 'Siobhan Roy',
		birthdate: '8/10/1968',
		parents: [],
		siblings: [2, 3, 4],
		activeSpouses: [],
		exSpouses: [],
		children: []
	}
];

familyTreeData['defaultPerson'] = defaultPerson;
familyTreeData['activePerson'] = activePerson;
familyTreeData['people'] = people;

export default writable(familyTreeData);
