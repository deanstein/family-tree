import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const dataVersion = '0.1.0';
const familyTreeData = {};

const defaultPerson = {
	version: dataVersion,
	id: 0,
	name: 'Firstname Lastname',
	birthdate: 'unspecified',
	gender: undefined,
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

const relationshipMap = {
	grandparents: {
		grandmothermaternal: {
			label: 'maternal grandmother',
			get inverse() {	
				return getGrandparentInverse();
			} 
		},
		grandmotherpaternal: {
			label: 'paternal grandmother',
			get inverse() {
				return getGrandparentInverse();
			} 
		},
		grandfathermaternal: {
			label: 'maternal grandfather',
			get inverse() {
				return getGrandparentInverse();
			} 
		},
		grandfatherpaternal: {
			label: 'paternal grandfather',
			get inverse() {
				return getGrandparentInverse();
			} 
		},
		grandparent: {
			label: '',
			get inverse() {
				return getGrandparentInverse();
			} 
		},
	},
	parents: {
		mother: {
			label: 'mother',
			get inverse() {	
				return getParentInverse();
			} 
		},
		father: {
			label: 'father',
			get inverse() {	
				return getParentInverse();
			} 
		},
		parent: {
			label: '',
			get inverse() {	
				return getParentInverse();
			} 
		},
		motherinlaw: {
			label: 'mother-in-law',
			get inverse() {	
				return getParentInLawInverse();
			} 
		},
		fatherinlaw: {
			label: 'father-in-law',
			get inverse() {	
				return getParentInLawInverse();
			} 
		},
		parentinlaw: {
			label: '',
			get inverse() {	
				return getParentInLawInverse();
			} 
		},
		stepmother: {
			label: 'stepmother',
			get inverse() {	
				return getStepParentInverse();
			} 
		},
		stepfather: {
			label: 'stepfather',
			get inverse() {	
				return getStepParentInverse();
			} 
		},
		stepparent: {
			label: '',
			get inverse() {	
				return getStepParentInverse();
			} 
		},
	},
	siblings: {
		sister: {
			label: 'sister',
			get inverse() {	
				return getSiblingInverse();
			} 
		},
		brother: {
			label: 'brother',
			get inverse() {	
				return getSiblingInverse();
			} 
		},
		sibing: {
			label: '',
			get inverse() {	
				return getSiblingInverse();
			} 
		},
		halfsister: {
			label: 'half sister',
			get inverse() {	
				return getHalfSiblingInverse();
			} 
		},
		halfbrother: {
			label: 'half brother',
			get inverse() {	
				return getHalfSiblingInverse();
			} 
		},
		halfsibling: {
			label: 'half sibling',
			get inverse() {	
				return getHalfSiblingInverse();
			} 
		},
		stepsister: {
			label: 'stepsister',
			get inverse() {	
				return getStepSiblingInverse();
			} 
		},
		stepbrother: {
			label: 'stepbrother',
			get inverse() {	
				return getStepSiblingInverse();
			} 
		},
		stepsibling: {
			label: 'stepsibling',
			get inverse() {	
				return getStepSiblingInverse();
			} 
		},
		sisterinlaw: {
			label: 'sister-in-law',
			get inverse() {	
				return getSiblingInLawInverse();
			} 
		},
		brotherinlaw: {
			label: 'brother-in-law',
			get inverse() {	
				return getSiblingInLawInverse();
			} 
		},
		siblinginlaw: {
			label: 'sibling-in-law',
			get inverse() {	
				return getSiblingInLawInverse();
			} 
		},
	},
	spouses: {
		wife: {
			label: 'wife',
			get inverse() {	
				return getSpouseInverse();
			} 
		},
		husband: {
			label: 'husband',
			get inverse() {	
				return getSpouseInverse();
			} 
		},
		exwife: {
			label: 'ex-wife',
			get inverse() {	
				return getExSpouseInverse();
			} 
		},
		exhusband: {
			label: 'ex-husband',
			get inverse() {	
				return getExSpouseInverse();
			} 
		},
		partner: {
			label: 'partner',
			get inverse() {	
				return relationshipMap.spouses.partner;
			} 
		},
		expartner: {
			label: 'ex-partner',
			get inverse() {	
				return relationshipMap.spouses.expartner;
			} 
		},
	},
	children: {
		daughter: {
			label: 'daughter',
			get inverse() {	
				return getChildrenInverse();
			} 
		},
		son: {
			label: 'son',
			get inverse() {	
				return getChildrenInverse();
			} 
		},
		child: {
			label: '',
			get inverse() {	
				return getChildrenInverse();
			} 
		},
		daughterinlaw: {
			label: 'daughter-in-law',
			get inverse() {	
				return getChildInLawInverse();
			} 
		},
		soninlaw: {
			label: 'son-in-law',
			get inverse() {	
				return getChildInLawInverse();
			} 
		},
		childinlaw: {
			label: '',
			get inverse() {	
				return getChildInLawInverse();
			} 
		},
		stepdaughter: {
			label: 'stepdaughter',
			get inverse() {	
				return getStepChildrenInverse();
			} 
		},
		stepson: {
			label: 'stepson',
			get inverse() {	
				return getStepChildrenInverse();
			} 
		},
		stepchild: {
			label: 'stepchild',
			get inverse() {	
				return getStepChildrenInverse();
			} 
		},
	},
	grandchildren: {
		granddaughter: {
			label: 'granddaughter',
			get inverse() {	
				return getGrandchildrenInverse();
			} 
		},
		grandson: {
			label: 'grandson',
			get inverse() {	
				return getGrandchildrenInverse();
			} 
		},
		grandchild: {
			label: 'grandchild',
			get inverse() {	
				return getGrandchildrenInverse();
			} 
		},
	}
};


const getGrandparentInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.grandchildren.grandson;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.grandchildren.granddaughter;
	} else {
		return relationshipMap.grandchildren.grandchild;
	}
} 

const getParentInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.children.son;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.children.daughter;
	} else {
		return relationshipMap.children.child;
	}
} 

const getParentInLawInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.children.soninlaw;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.children.daughterinlaw;
	} else {
		return relationshipMap.children.childinlaw;
	}
}

const getStepParentInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.children.stepson;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.children.stepdaughter;
	} else {
		return relationshipMap.children.stepchild;
	}
}

const getSiblingInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.siblings.brother;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.siblings.sister;
	} else {
		return relationshipMap.siblings.sibling;
	}
}

const getHalfSiblingInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.siblings.halfbrother;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.siblings.halfsister;
	} else {
		return relationshipMap.siblings.halfsibling;
	}
}

const getStepSiblingInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.siblings.stepbrother;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.siblings.stepsister;
	} else {
		return relationshipMap.siblings.stepsibling;
	}
}


const getSiblingInLawInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.siblings.brotherinlaw;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.siblings.sisterinlaw;
	} else {
		return relationshipMap.siblings.siblinginlaw;
	}
}

const getSpouseInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.spouses.husband;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.spouses.wife;
	} else {
		return relationshipMap.spouses.partner;
	}
}

const getExSpouseInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.spouses.exhusband;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.spouses.exwife;
	} else {
		return relationshipMap.spouses.expartner;
	}
}

const getChildrenInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.parents.father;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.parents.mother;
	} else {
		return relationshipMap.parents.parent;
	}
}

const getChildInLawInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.parents.fatherinlaw;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.parents.motherinlaw;
	} else {
		return relationshipMap.parents.parentinlaw;
	}
}

const getStepChildrenInverse = () => {
	if (activePerson.gender === 'male'){
		return relationshipMap.parents.stepfather;
	}
	else if (activePerson.gender === 'female') {
		return relationshipMap.parents.stepmother;
	} else {
		return relationshipMap.parents.stepparent;
	}
}

const getGrandchildrenInverse = () => {
	if (activePerson.gender === 'male'){
		return undefined;
	}
	else if (activePerson.gender === 'female') {
		return undefined;
	} else {
		return undefined;
	}
}

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
familyTreeData['relationshipTypes'] = relationshipMap;
familyTreeData['people'] = people;

export default writable(familyTreeData);