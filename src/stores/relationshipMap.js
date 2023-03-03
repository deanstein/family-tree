export const sDataVersion = '0.6.2';

const relationshipMap = {
	sDataVersion: sDataVersion,
	grandparentsMaternal: {
		id: 'grandparentsMaternal',
		label: 'Maternal Grandparents',
		grandparentMaternal: {
			id: 'grandparentMaternal',
			label: 'maternal grandparent'
		},
		grandmotherMaternal: {
			id: `grandmotherMaternal`,
			label: 'maternal grandmother'
		},
		grandfatherMaternal: {
			id: 'grandfatherMaternal',
			label: 'maternal grandfather'
		}
	},
	grandparentsPaternal: {
		id: 'grandparentsPaternal',
		label: 'Paternal Grandparents',
		grandparentPaternal: {
			id: 'grandparentPaternal',
			label: 'paternal grandparent'
		},
		grandmotherPaternal: {
			id: 'grandmotherPaternal',
			label: 'paternal grandmother'
		},
		grandfatherPaternal: {
			id: 'grandfatherPaternal',
			label: 'paternal grandfather'
		}
	},
	parents: {
		id: 'parents',
		label: 'Parents',
		parent: {
			id: 'parent',
			label: 'parent'
		},
		mother: {
			id: 'mother',
			label: 'mother'
		},
		father: {
			id: 'father',
			label: 'father'
		}
	},
	parentsInLaw: {
		id: 'parentsInLaw',
		label: 'Parents in Law',
		parentinlaw: {
			id: 'parentInLaw',
			label: 'parent in law'
		},
		motherinlaw: {
			id: 'motherInLaw',
			label: 'mother-in-law'
		},
		fatherinlaw: {
			id: 'fatherInLaw',
			label: 'father-in-law'
		}
	},
	stepparentsMaternal: {
		id: 'stepparentsMaternal',
		label: 'Maternal Step Parents',
		stepmotherMaternal: {
			id: 'stepmotherMaternal',
			label: 'stepmother'
		},
		stepfatherMaternal: {
			id: 'stepfatherMaternal',
			label: 'stepfather'
		},
		stepparentMaternal: {
			id: 'stepparentMaternal',
			label: 'maternal step-parent'
		}
	},
	stepparentsPaternal: {
		id: 'stepparentsPaternal',
		label: 'Paternal Step Parents',
		stepparentPaternal: {
			id: 'stepparentPaternal',
			label: 'paternal step-parent'
		},
		stepmotherPaternal: {
			id: 'stepmotherPaternal',
			label: 'stepmother'
		},
		stepfatherPaternal: {
			id: 'stepfatherPaternal',
			label: 'stepfather'
		}
	},
	siblings: {
		id: 'siblings',
		label: 'Siblings',
		sibling: {
			id: 'sibling',
			label: 'sibling'
		},
		sister: {
			id: 'sister',
			label: 'sister'
		},
		brother: {
			id: 'brother',
			label: 'brother'
		}
	},
	halfSiblingsMaternal: {
		id: 'halfSiblingsMaternal',
		label: 'Maternal Half Siblings',
		halfSiblingMaternal: {
			id: 'halfSiblingMaternal',
			label: 'half sibling'
		},
		halfsisterMaternal: {
			id: 'halfSisterMaternal',
			label: 'half sister'
		},
		halfbrotherMaternal: {
			id: 'halfBrotherMaternal',
			label: 'half brother'
		}
	},
	halfSiblingsPaternal: {
		id: 'halfSiblingsPaternal',
		label: 'Paternal Half Siblings',
		halfsiblingPaternal: {
			id: 'halfSiblingPaternal',
			label: 'half sibling'
		},
		halfSisterPaternal: {
			id: 'halfSisterPaternal',
			label: 'half sister'
		},
		halfBrotherPaternal: {
			id: 'halfBrotherPaternal',
			label: 'half brother'
		}
	},
	stepsiblings: {
		id: 'stepSiblings',
		label: 'Step Siblings',
		stepsibling: {
			id: 'stepsibling',
			label: 'stepsibling'
		},
		stepsister: {
			id: 'stepsister',
			label: 'stepsister'
		},
		stepbrother: {
			id: 'stepbrother',
			label: 'stepbrother'
		}
	},
	siblingsInLaw: {
		label: 'Siblings-in-Law',
		siblingInLaw: {
			id: 'siblingInLaw',
			label: 'sibling-in-law'
		},
		sisterInLaw: {
			id: 'sisterInLaw',
			label: 'sister-in-law'
		},
		brotherInLaw: {
			id: 'brotherInLaw',
			label: 'brother-in-law'
		}
	},
	spouses: {
		id: 'spouses',
		label: 'Spouse',
		partner: {
			id: 'partner',
			label: 'partner'
		},
		wife: {
			id: 'wife',
			label: 'wife'
		},
		husband: {
			id: 'husband',
			label: 'husband'
		}
	},
	exSpouses: {
		id: 'exSpouses',
		label: 'Ex-Spouses',
		exWife: {
			id: 'exWife',
			label: 'ex-wife'
		},
		exHusband: {
			id: 'exHusband',
			label: 'ex-husband'
		},
		exPartner: {
			id: 'exPartner',
			label: 'ex-partner'
		}
	},
	children: {
		id: 'children',
		label: 'Children',
		child: {
			id: 'child',
			label: 'child'
		},
		daughter: {
			id: 'daughter',
			label: 'daughter'
		},
		son: {
			id: 'son',
			label: 'son'
		}
	},
	stepchildren: {
		id: 'stepChildren',
		label: 'Step Children',
		stepchild: {
			id: 'stepchild',
			label: 'stepchild'
		},
		stepdaughter: {
			id: 'stepdaughter',
			label: 'stepdaughter'
		},
		stepson: {
			id: 'stepson',
			label: 'stepson'
		}
	},
	childrenInLaw: {
		id: 'childrenInLaw',
		label: 'Children in Law',
		childInLaw: {
			id: 'childInLaw',
			label: 'child-in-law'
		},
		daughterInLaw: {
			id: 'daughterInLaw',
			label: 'daughter-in-law'
		},
		sonInLaw: {
			id: 'sonInLaw',
			label: 'son-in-law'
		}
	},
	grandchildren: {
		id: 'grandchildren',
		label: 'Grandchildren',
		grandchild: {
			id: 'grandchild',
			label: 'grandchild'
		},
		granddaughter: {
			id: 'granddaughter',
			label: 'granddaughter'
		},
		grandson: {
			id: 'grandson',
			label: 'grandson'
		}
	}
};
export default relationshipMap;

export const defaultPerson = {
	version: sDataVersion,
	id: '0',
	name: 'Firstname Lastname',
	birthdate: 'unspecified',
	gender: 'undefined',
	relationshipToActivePerson: 'undefined',
	relationships: (() => {
		let relationships = {};
		Object.keys(relationshipMap).forEach((element) => {
			relationships[element] = [];
		});
		return relationships;
	})()
};

// specify compatible groups to show in the select element for each group
const { grandparentsMaternal, grandparentsPaternal } = relationshipMap;
export const grandparentsCompatibleGroups = {
	grandparentsMaternal,
	grandparentsPaternal
};

const { parents, stepparentsMaternal, stepparentsPaternal, parentsInLaw } = relationshipMap;
export const parentsCompatibleGroups = {
	parents,
	stepparentsMaternal,
	stepparentsPaternal,
	parentsInLaw
};

const { siblings, halfSiblingsMaternal, halfSiblingsPaternal, stepsiblings, siblingsInLaw } =
	relationshipMap;
export const siblingsCompatibleGroups = {
	siblings,
	halfSiblingsMaternal,
	halfSiblingsPaternal,
	stepsiblings,
	siblingsInLaw
};

const { spouses, exSpouses } = relationshipMap;
export const spouseCompatibleGroups = {
	spouses,
	exSpouses
};

const { children, stepchildren, childrenInLaw } = relationshipMap;
export const childrenCompatibleGroups = {
	children,
	stepchildren,
	childrenInLaw
};
