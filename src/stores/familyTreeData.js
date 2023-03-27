import { writable } from 'svelte/store';

const familyTreeData = {
	sLastKnownActivePersonId: undefined,
	aAllPeople: [
		{
			id: 2,
			name: 'Kendall Roy',
			birthdate: '3/15/1975',
			relationships: {
				grandparentsMaternal: [],
				grandparentsPaternal: [],
				greatAunclesMaternal: [],
				greatAunclesPaternal: [],
				parents: [],
				parentsInLaw: [],
				stepparentsMaternal: [],
				stepparentsPaternal: [],
				aunclesMaternal: [],
				aunclesPaternal: [],
				secondCousinsAbove: [],
				cousins: [],
				siblings: [
					{ id: 4, relationshipId: 'sibling' },
					{ id: 3, relationshipId: 'sibling' },
					{ id: 5, relationshipId: 'sibling' }
				],
				halfSiblingsMaternal: [],
				halfSiblingsPaternal: [],
				stepsiblings: [],
				siblingsInLaw: [],
				spouses: [],
				spouseStepsiblings: [],
				exSpouses: [],
				children: [],
				stepchildren: [],
				childrenInLaw: [],
				niblings: [],
				grandchildren: [],
				grandniblings: [],
				secondCousinsBelow: []
			}
		},
		{
			id: 3,
			name: 'Roman Roy',
			birthdate: '3/15/1975',
			relationships: {
				grandparentsMaternal: [],
				grandparentsPaternal: [],
				greatAunclesMaternal: [],
				greatAunclesPaternal: [],
				parents: [],
				parentsInLaw: [],
				stepparentsMaternal: [],
				stepparentsPaternal: [],
				aunclesMaternal: [],
				aunclesPaternal: [],
				secondCousinsAbove: [],
				cousins: [],
				siblings: [
					{ id: 4, relationshipId: 'sibling' },
					{ id: 2, relationshipId: 'sibling' },
					{ id: 5, relationshipId: 'sibling' }
				],
				halfSiblingsMaternal: [],
				halfSiblingsPaternal: [],
				stepsiblings: [],
				siblingsInLaw: [],
				spouses: [],
				exSpouses: [],
				spouseStepsiblings: [],
				children: [],
				stepchildren: [],
				childrenInLaw: [],
				niblings: [],
				grandchildren: [],
				grandniblings: [],
				secondCousinsBelow: []
			}
		},
		{
			id: 4,
			name: 'Connor Roy',
			birthdate: '8/10/1968',
			relationships: {
				grandparentsMaternal: [],
				grandparentsPaternal: [],
				greatAunclesMaternal: [],
				greatAunclesPaternal: [],
				parents: [],
				parentsInLaw: [],
				stepparentsMaternal: [],
				stepparentsPaternal: [],
				aunclesMaternal: [],
				aunclesPaternal: [],
				secondCousinsAbove: [],
				cousins: [],
				siblings: [
					{ id: 2, relationshipId: 'sibling' },
					{ id: 3, relationshipId: 'sibling' },
					{ id: 5, relationshipId: 'sibling' }
				],
				halfSiblingsMaternal: [],
				halfSiblingsPaternal: [],
				stepsiblings: [],
				siblingsInLaw: [],
				spouses: [],
				exSpouses: [],
				spouseStepsiblings: [],
				children: [],
				stepchildren: [],
				childrenInLaw: [],
				niblings: [],
				grandchildren: [],
				grandniblings: [],
				secondCousinsBelow: []
			}
		},
		{
			id: 5,
			name: 'Siobhan Roy',
			birthdate: '8/10/1968',
			relationships: {
				grandparentsMaternal: [],
				grandparentsPaternal: [],
				greatAunclesMaternal: [],
				greatAunclesPaternal: [],
				parents: [],
				parentsInLaw: [],
				stepparentsMaternal: [],
				stepparentsPaternal: [],
				aunclesMaternal: [],
				aunclesPaternal: [],
				secondCousinsAbove: [],
				cousins: [],
				siblings: [
					{ id: 2, relationshipId: 'sibling' },
					{ id: 3, relationshipId: 'sibling' },
					{ id: 4, relationshipId: 'sibling' }
				],
				halfSiblingsMaternal: [],
				halfSiblingsPaternal: [],
				stepsiblings: [],
				siblingsInLaw: [],
				spouses: [],
				exSpouses: [],
				spouseStepsiblings: [],
				children: [],
				stepchildren: [],
				childrenInLaw: [],
				niblings: [],
				grandchildren: [],
				grandniblings: [],
				secondCousinsBelow: []
			}
		}
	]
};

export default writable(familyTreeData);
