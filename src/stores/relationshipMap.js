import { writable } from 'svelte/store';

import familyTreeData from './familyTreeData';

export const dataVersion = '0.5.0';

export const defaultPerson = {
	version: dataVersion,
	id: '0',
	name: 'Firstname Lastname',
	birthdate: 'unspecified',
	gender: undefined,
	relationships: () => {
		let relationships = {};
		Object.keys(relationshipMap).forEach((element) => {
			relationships[element] = [];
		});
		return relationships;
	}
};

const relationshipMap = {
	grandparentsMaternal: {
		id: 'grandparentsMaternal',
		label: 'Maternal Grandparents',
		grandmotherMaternal: {
			id: `grandmotherMaternal`,
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'maternal grandmother'
		},
		grandfatherMaternal: {
			id: 'grandfatherMaternal',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'maternal grandfather'
		},
		grandparentMaternal: {
			id: 'grandparentMaternal',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: ''
		}
	},
	grandparentsPaternal: {
		id: 'grandparentsPaternal',
		label: 'Paternal Grandparents',
		grandmotherPaternal: {
			id: 'grandmotherPaternal',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'paternal grandmother'
		},
		grandfatherPaternal: {
			id: 'grandfatherPaternal',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'paternal grandfather'
		},
		grandparentPaternal: {
			id: 'grandparentPaternal',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: ''
		}
	},
	parents: {
		id: 'parents',
		label: 'Parents',
		mother: {
			id: 'mother',
			get inverseId() {
				return getParentInverseId();
			},
			label: 'mother'
		},
		father: {
			id: 'father',
			get inverseId() {
				return getParentInverseId();
			},
			label: 'father'
		},
		parent: {
			id: 'parent',
			get inverseId() {
				return getParentInverseId();
			},
			label: ''
		}
	},
	parentsInLaw: {
		id: 'parentsInLaw',
		label: 'Parents in Law',
		motherinlaw: {
			id: 'motherInLaw',
			get inverseId() {
				return getParentInLawInverseId();
			},
			label: 'mother-in-law'
		},
		fatherinlaw: {
			id: 'fatherInLaw',
			get inverseId() {
				return getParentInLawInverseId();
			},
			label: 'father-in-law'
		},
		parentinlaw: {
			id: 'parentInLaw',
			get inverseId() {
				return getParentInLawInverseId();
			},
			label: ''
		}
	},
	stepparentsMaternal: {
		id: 'stepparentsMaternal',
		label: 'Maternal Step Parents',
		stepmotherMaternal: {
			id: 'stepmotherMaternal',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepmother'
		},
		stepfatherMaternal: {
			id: 'stepfatherMaternal',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepfather'
		},
		stepparentMaternal: {
			id: 'stepparentMaternal',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: ''
		}
	},
	stepparentsPaternal: {
		id: 'stepparentsPaternal',
		label: 'Paternal Step Parents',
		stepmotherPaternal: {
			id: 'stepmotherPaternal',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepmother'
		},
		stepfatherPaternal: {
			id: 'stepfatherPaternal',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepfather'
		},
		stepparentPaternal: {
			id: 'stepparentPaternal',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: ''
		}
	},
	siblings: {
		id: 'siblings',
		label: 'Siblings',
		sister: {
			id: 'sister',
			get inverseId() {
				return getSiblingInverseId();
			},
			label: 'sister'
		},
		brother: {
			id: 'brother',
			get inverseId() {
				return getSiblingInverseId();
			},
			label: 'brother'
		},
		sibling: {
			id: 'sibling',
			get inverseId() {
				return getSiblingInverseId();
			},
			label: ''
		}
	},
	halfSiblingsMaternal: {
		id: 'halfSiblingsMaternal',
		label: 'Maternal Half Siblings',
		halfsisterMaternal: {
			id: 'halfSisterMaternal',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sister'
		},
		halfbrotherMaternal: {
			id: 'halfBrotherMaternal',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half brother'
		},
		halfSiblingMaternal: {
			id: 'halfSiblingMaternal',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sibling'
		}
	},
	halfSiblingsPaternal: {
		id: 'halfSiblingsPaternal',
		label: 'Paternal Half Siblings',
		halfSisterPaternal: {
			id: 'halfSisterPaternal',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sister'
		},
		halfBrotherPaternal: {
			id: 'halfBrotherPaternal',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half brother'
		},
		halfsiblingPaternal: {
			id: 'halfSiblingPaternal',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sibling'
		}
	},
	stepsiblings: {
		id: 'stepSiblings',
		label: 'Step Siblings',
		stepsister: {
			id: 'stepsister',
			get inverseId() {
				return getStepSiblingInverseId();
			},
			label: 'stepsister'
		},
		stepbrother: {
			id: 'stepbrother',
			get inverseId() {
				return getStepSiblingInverseId();
			},
			label: 'stepbrother'
		},
		stepsibling: {
			id: 'stepsibling',
			get inverseId() {
				return getStepSiblingInverseId();
			},
			label: 'stepsibling'
		}
	},
	siblingsInLaw: {
		label: 'Siblings-in-Law',
		sisterInLaw: {
			id: 'sisterInLaw',
			get inverseId() {
				return getSiblingInLawInverseId();
			},
			label: 'sister-in-law'
		},
		brotherInLaw: {
			id: 'brotherInLaw',
			get inverseId() {
				return getSiblingInLawInverseId();
			},
			label: 'brother-in-law'
		},
		siblingInLaw: {
			id: 'siblingInLaw',
			get inverseId() {
				return getSiblingInLawInverseId();
			},
			label: 'sibling-in-law'
		}
	},
	spouses: {
		id: 'spouses',
		label: 'Spouse',
		wife: {
			id: 'wife',
			get inverseId() {
				return getSpouseInverseId();
			},
			label: 'wife'
		},
		husband: {
			id: 'husband',
			get inverseId() {
				return getSpouseInverseId();
			},
			label: 'husband'
		},
		partner: {
			id: 'partner',
			inverseId: 'partner',
			label: 'partner'
		}
	},
	exSpouses: {
		id: 'exSpouses',
		label: 'Ex-Spouses',
		exWife: {
			id: 'exWife',
			get inverseId() {
				return getExSpouseInverseId();
			},
			label: 'ex-wife'
		},
		exHusband: {
			id: 'exHusband',
			get inverseId() {
				return getExSpouseInverseId();
			},
			label: 'ex-husband'
		},
		exPartner: {
			id: 'exPartner',
			inverseId: 'exPartner',
			label: 'ex-partner'
		}
	},
	children: {
		id: 'children',
		label: 'Children',
		daughter: {
			id: 'daughter',
			get inverseId() {
				return getChildrenInverseId();
			},
			label: 'daughter'
		},
		son: {
			id: 'son',
			get inverseId() {
				return getChildrenInverseId();
			},
			label: 'son'
		},
		child: {
			id: 'child',
			get inverseId() {
				return getChildrenInverseId();
			},
			label: ''
		}
	},
	stepchildren: {
		id: 'stepChildren',
		label: 'Step Children',
		stepdaughter: {
			id: 'stepdaughter',
			get inverse() {
				return getStepChildrenInverseId();
			},
			label: 'stepdaughter'
		},
		stepson: {
			id: 'stepson',
			get inverseId() {
				return getStepChildrenInverseId();
			},
			label: 'stepson'
		},
		stepchild: {
			id: 'stepchild',
			get inverseId() {
				return getStepChildrenInverseId();
			},
			label: 'stepchild'
		}
	},
	childrenInLaw: {
		id: 'childrenInLaw',
		label: 'Children in Law',
		daughterInLaw: {
			id: 'daughterInLaw',
			get inverseId() {
				return getChildInLawInverseId();
			},
			label: 'daughter-in-law'
		},
		sonInLaw: {
			id: 'sonInLaw',
			label: 'son-in-law',
			get inverseId() {
				return getChildInLawInverseId();
			}
		},
		childInLaw: {
			id: 'childInLaw',
			get inverseId() {
				return getChildInLawInverseId();
			},
			label: ''
		}
	},
	grandchildren: {
		id: 'grandchildren',
		granddaughter: {
			id: 'granddaughter',
			get inverseId() {
				return getGrandchildrenInverseId();
			},
			label: 'granddaughter'
		},
		grandson: {
			id: 'grandson',
			get inverseId() {
				return getGrandchildrenInverseId();
			},
			label: 'grandson'
		},
		grandchild: {
			id: 'grandchild',
			get inverseId() {
				return getGrandchildrenInverseId();
			},
			label: 'grandchild'
		}
	}
};

export default writable(relationshipMap);

const getGrandparentInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.grandchildren.grandson.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.grandchildren.granddaughter.id;
		} else {
			return relationshipMap.grandchildren.grandchild.id;
		}
	});
};

const getParentInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.children.son.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.children.daughter.id;
		} else {
			return relationshipMap.children.child.id;
		}
	});
};

const getParentInLawInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.children.soninlaw.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.children.daughterinlaw.id;
		} else {
			return relationshipMap.children.childinlaw.id;
		}
	});
};

const getStepParentInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.children.stepson.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.children.stepdaughter.id;
		} else {
			return relationshipMap.children.stepchild.id;
		}
	});
};

const getSiblingInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.siblings.brother.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.siblings.sister.id;
		} else {
			return relationshipMap.siblings.sibling.id;
		}
	});
};

const getHalfSiblingInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.siblings.halfbrother.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.siblings.halfsister.id;
		} else {
			return relationshipMap.siblings.halfsibling.id;
		}
	});
};

const getStepSiblingInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.siblings.stepbrother.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.siblings.stepsister.id;
		} else {
			return relationshipMap.siblings.stepsibling.id;
		}
	});
};

const getSiblingInLawInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.siblings.brotherinlaw.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.siblings.sisterinlaw.id;
		} else {
			return relationshipMap.siblings.siblinginlaw.id;
		}
	});
};

const getSpouseInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.spouses.husband.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.spouses.wife.id;
		} else {
			return relationshipMap.spouses.partner.id;
		}
	});
};

const getExSpouseInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.spouses.exhusband.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.spouses.exwife.id;
		} else {
			return relationshipMap.spouses.expartner.id;
		}
	});
};

const getChildrenInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.parents.father.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.parents.mother.id;
		} else {
			return relationshipMap.parents.parent.id;
		}
	});
};

const getChildInLawInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.parents.fatherinlaw.id;
		} else if (currentValue.defaultPersonactivePerson.gender === 'female') {
			return relationshipMap.parents.motherinlaw.id;
		} else {
			return relationshipMap.parents.parentinlaw.id;
		}
	});
};

const getStepChildrenInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return relationshipMap.parents.stepfather.id;
		} else if (currentValue.activePerson.gender === 'female') {
			return relationshipMap.parents.stepmother.id;
		} else {
			return relationshipMap.parents.stepparent.id;
		}
	});
};

const getGrandchildrenInverseId = () => {
	familyTreeData.subscribe((currentValue) => {
		if (currentValue.activePerson.gender === 'male') {
			return undefined;
		} else if (currentValue.activePerson.gender === 'female') {
			return undefined;
		} else {
			return undefined;
		}
	});
};
