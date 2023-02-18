import { writable } from 'svelte/store';

const familyTreeData = {};

const activePerson = {};
const people = [
	{
		id: 2,
		name: 'Kendall Roy',
		birthdate: '3/15/1975',
		relationships: {
			grandparentsMaternal: [],
			grandparentsPaternal: [],
			parents: [],
			parentsInLaw: [],
			stepparentsMaternal: [],
			stepparentsPaternal: [],
			siblings: [{id: 4, relationshipId: 'sibling'}, {id: 3, relationshipId: 'sibling'}, {id: 5, relationshipId: 'sibling'}],
			halfSiblingsMaternal: [],
			halfSiblingsPaternal: [],
			stepsiblings: [],
			siblingsInLaw: [],
			spouses: [],
			children: [],
			stepchildren: [],
			childrenInLaw: [],
			grandchildren: []
		}
	},
	{
		id: 3,
		name: 'Roman Roy',
		birthdate: '3/15/1975',
		relationships: {
			grandparentsMaternal: [],
			grandparentsPaternal: [],
			parents: [],
			parentsInLaw: [],
			stepparentsMaternal: [],
			stepparentsPaternal: [],
			siblings: [{id: 4, relationshipId: 'sibling'}, {id: 2, relationshipId: 'sibling'}, {id: 5, relationshipId: 'sibling'}],
			halfSiblingsMaternal: [],
			halfSiblingsPaternal: [],
			stepsiblings: [],
			siblingsInLaw: [],
			spouses: [],
			children: [],
			stepchildren: [],
			childrenInLaw: [],
			grandchildren: []
		}
	},
	{
		id: 4,
		name: 'Connor Roy',
		birthdate: '8/10/1968',
		relationships: {
			grandparentsMaternal: [],
			grandparentsPaternal: [],
			parents: [],
			parentsInLaw: [],
			stepparentsMaternal: [],
			stepparentsPaternal: [],
			siblings: [{id: 2, relationshipId: 'sibling'}, {id: 3, relationshipId: 'sibling'}, {id: 5, relationshipId: 'sibling'}],
			halfSiblingsMaternal: [],
			halfSiblingsPaternal: [],
			stepsiblings: [],
			siblingsInLaw: [],
			spouses: [],
			children: [],
			stepchildren: [],
			childrenInLaw: [],
			grandchildren: []
		}
	},
	{
		id: 5,
		name: 'Siobhan Roy',
		birthdate: '8/10/1968',
		relationships: {
			grandparentsMaternal: [],
			grandparentsPaternal: [],
			parents: [],
			parentsInLaw: [],
			stepparentsMaternal: [],
			stepparentsPaternal: [],
			siblings: [{id: 2, relationshipId: 'sibling'}, {id: 3, relationshipId: 'sibling'}, {id: 4, relationshipId: 'sibling'}],
			halfSiblingsMaternal: [],
			halfSiblingsPaternal: [],
			stepsiblings: [],
			siblingsInLaw: [],
			spouses: [],
			children: [],
			stepchildren: [],
			childrenInLaw: [],
			grandchildren: []
		}
	}
];

familyTreeData['activePerson'] = activePerson;
familyTreeData['people'] = people;

export default writable(familyTreeData);
