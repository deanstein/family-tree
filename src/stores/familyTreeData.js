import { writable } from 'svelte/store';

const familyTreeData = {};
const defaultPerson = {
  name: 'John Doe',
  bithdate: 'unspecified',
  parents: [],
  siblings: [],
  activeSpouses: [],
  exSpouses: []
}
const activePerson = {};
const people = [
	{
		name: 'Kendall Roy',
		bithdate: '3/15/1975',
		parents: ['Logan Roy', 'Carolne Collingwood'],
		siblings: ['Connor Roy', 'Roman Roy', 'Siobhan Roy'],
    activeSpouses: ['Naomi Pierce'],
    exSpouses: ['Rava Roy']
	},
	{
		name: 'Roman Roy',
		bithdate: '3/15/1975',
		parents: ['Logan Roy', 'Carolne Collingwood'],
		siblings: ['Connor Roy', 'Kendall Roy', 'Siobhan Roy'],
    activeSpouses: [],
    exSpouses: ['Tabitha LNU']
	},
  {
    name: 'Connor Roy',
		bithdate: '8/10/1968',
		parents: ['Logan Roy', 'FNU LNU'],
		siblings: ['Kendall Roy', 'Roman Roy', 'Siobhan Roy'],
    activeSpouses: ['Willa LNU'],
    exSpouses: []
	},
];

familyTreeData['defaultPerson'] = defaultPerson;
familyTreeData['activePerson'] = activePerson;
familyTreeData['people'] = people;

export default writable(familyTreeData);
