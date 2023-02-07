import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const dataVersion = '0.0.1';
const familyTreeData = {};

const defaultPerson = {
	version: dataVersion,
	id: 0,
	name: 'Firstname Lastname',
	birthdate: 'unspecified',
	greatgrandparents: [],
	grandparents: [],
	parents: [],
	siblings: [],
	spouses: [],
	children: [],
	grandchildren: [],
	greatgrandchildren: []
};

const activePerson = {};

const relationshipTypes = {
	grandparents: {
		grandmothermaternal: 'maternal grandmother',
		grandmotherpaternal: 'paternal grandmother',
		grandfathermaternal: 'maternal grandfather',
		grandfatherpaternal: 'paternal grandfather'
	},
	parents: {
		mother: 'mother',
		father: 'father',
		motherinlaw: 'mother-in-law',
		fatherinlaw: 'father-in-law',
		stepmother: 'stepmother',
		stepfather: 'stepfather'
	},
	siblings: {
		sister: 'sister',
		brother: 'brother',
		halfsister: 'half sister',
		halfbrother: 'half brother',
		stepsister: 'stepsister',
		stepbrother: 'stepbrother',
		sisterinlaw: 'sister-in-law',
		brotherinlaw: 'brother-in-law'
	},
	spouses: {
		wife: 'wife',
		husband: 'husband',
		exwife: 'ex-wife',
		exhusband: 'ex-husband',
		girlfriend: 'girlfriend',
		boyfriend: 'boyfriend',
		partner: 'partner'
	},
	children: {
		daughter: 'daughter',
		son: 'son',
		daughterinlaw: 'daughter-in-law',
		soninlaw: 'son-in-law',
		stepdaughter: 'stepdaughter',
		stepson: 'stepson'
	},
	grandchildren: {
		granddaughter: 'granddaughter',
		grandson: 'grandson'
	}
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
familyTreeData['relationshipTypes'] = relationshipTypes;
familyTreeData['people'] = people;

export default writable(familyTreeData);
