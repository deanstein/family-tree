import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const familyTreeData = {};
const defaultPerson = {
  id: 0,
	name: 'John Doe',
	birthdate: 'unspecified',
	parents: [],
	siblings: [],
	activeSpouses: [],
	exSpouses: []
};
const activePerson = {};
const people = [
	{
    id: 2,
		name: 'Kendall Roy',
		birthdate: '3/15/1975',
		parents: ['Logan Roy', 'Carolne Collingwood'],
		siblings: [4, 3, 5],
		activeSpouses: ['Naomi Pierce'],
		exSpouses: ['Rava Roy']
	},
	{
    id: 3,
		name: 'Roman Roy',
		birthdate: '3/15/1975',
		parents: ['Logan Roy', 'Carolne Collingwood'],
		siblings: ['Connor Roy', 'Kendall Roy', 'Siobhan Roy'],
		activeSpouses: [],
		exSpouses: ['Tabitha LNU']
	},
	{
    id: 4,
		name: 'Connor Roy',
		birthdate: '8/10/1968',
		parents: ['Logan Roy', 'FNU LNU'],
		siblings: [2, 3, 5],
		activeSpouses: ['Willa LNU'],
		exSpouses: []
	},
  {
    id: 5,
		name: 'Siobhan Roy',
		birthdate: '8/10/1968',
		parents: ['Logan Roy', 'FNU LNU'],
		siblings: ['Kendall Roy', 'Roman Roy', 'Connor Roy'],
		activeSpouses: ['Willa LNU'],
		exSpouses: []
	}
];


familyTreeData['defaultPerson'] = defaultPerson;
familyTreeData['activePerson'] = activePerson;
familyTreeData['people'] = people;

export default writable(familyTreeData);
