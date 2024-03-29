import { schemaVersion } from '$lib/versions';

const relationshipMap = {
	dataVersion: schemaVersion,
	grandparentsMaternal: {
		id: 'grandparentsMaternal',
		label: 'Grandparents (M)',
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
		label: 'Grandparents (P)',
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
	greatAunclesMaternal: {
		id: 'greatAunclesMaternal',
		label: 'Great Aunts/Uncles (M)',
		greatAuncleMaternal: {
			id: 'greatAuncleMaternal',
			label: 'maternal great aunt or uncle'
		},
		greatAuntMaternal: {
			id: 'greatAuntMaternal',
			label: 'maternal great aunt'
		},
		greatUncleMaternal: {
			id: 'greatUncleMaternal',
			label: 'maternal great uncle'
		}
	},
	greatAunclesPaternal: {
		id: 'greatAunclesPaternal',
		label: 'Great Aunts/Uncles (P)',
		greatAunclePaternal: {
			id: 'greatAunclePaternal',
			label: 'paternal great aunt or uncle'
		},
		greatAuntPaternal: {
			id: 'greatAuntPaternal',
			label: 'paternal great aunt'
		},
		greatUnclePaternal: {
			id: 'greatUnclePaternal',
			label: 'paternal great uncle'
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
		parentInLaw: {
			id: 'parentInLaw',
			label: 'parent in law'
		},
		motherInLaw: {
			id: 'motherInLaw',
			label: 'mother-in-law'
		},
		fatherInLaw: {
			id: 'fatherInLaw',
			label: 'father-in-law'
		}
	},
	stepparentsMaternal: {
		id: 'stepparentsMaternal',
		label: 'Step Parent (M)',
		stepparentMaternal: {
			id: 'stepparentMaternal',
			label: 'maternal step-parent'
		},
		stepmotherMaternal: {
			id: 'stepmotherMaternal',
			label: 'stepmother'
		},
		stepfatherMaternal: {
			id: 'stepfatherMaternal',
			label: 'stepfather'
		}
	},
	stepparentsPaternal: {
		id: 'stepparentsPaternal',
		label: 'Step Parent (P)',
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
	aunclesMaternal: {
		id: 'aunclesMaternal',
		label: 'Aunts/Uncles (M)',
		auntMaternal: {
			id: 'auntMaternal',
			label: 'maternal aunt'
		},
		uncleMaternal: {
			id: 'uncleMaternal',
			label: 'maternal uncle'
		}
	},
	aunclesPaternal: {
		id: 'aunclesPaternal',
		label: 'Aunts/Uncles (P)',
		auntPaternal: {
			id: 'auntPaternal',
			label: 'paternal aunt'
		},
		unclePaternal: {
			id: 'unclePaternal',
			label: 'paternal uncle'
		}
	},
	secondCousinsAbove: {
		id: 'secondCousinsAbove',
		label: 'Second Cousins',
		secondCousinAbove: {
			id: 'secondCousinAbove',
			label: 'second cousin'
		}
	},
	cousins: {
		id: 'cousins',
		label: 'Cousins',
		cousin: {
			id: 'cousin',
			label: 'cousin'
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
		label: 'Half Siblings (M)',
		halfSiblingMaternal: {
			id: 'halfSiblingMaternal',
			label: 'half sibling'
		},
		halfSisterMaternal: {
			id: 'halfSisterMaternal',
			label: 'half sister'
		},
		halfBrotherMaternal: {
			id: 'halfBrotherMaternal',
			label: 'half brother'
		}
	},
	halfSiblingsPaternal: {
		id: 'halfSiblingsPaternal',
		label: 'Half Siblings (P)',
		halfSiblingPaternal: {
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
		id: 'stepsiblings',
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
		id: 'siblingsInLaw',
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
	spouseSiblingsInLaw: {
		id: 'spouseSiblingsInLaw',
		label: 'Spouse Siblings-in-Law',
		spouseSiblingInLaw: {
			id: 'spouseSiblingInLaw',
			label: 'spouse sibling-in-law'
		},
		spouseSisterInLaw: {
			id: 'spouseSisterInLaw',
			label: 'spouse sister-in-law'
		},
		spouseBrotherInLaw: {
			id: 'spouseBrotherInLaw',
			label: 'spouse brother-in-law'
		}
	},
	exSpouses: {
		id: 'exSpouses',
		label: 'Ex-Spouses',
		exPartner: {
			id: 'exPartner',
			label: 'ex-partner'
		},
		exWife: {
			id: 'exWife',
			label: 'ex-wife'
		},
		exHusband: {
			id: 'exHusband',
			label: 'ex-husband'
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
		id: 'stepchildren',
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
	niblings: {
		id: 'niblings',
		label: 'Nieces or Nephews',
		nibling: {
			id: 'nibling',
			label: 'Niece or Nephew'
		},
		niece: {
			id: 'niece',
			label: 'Niece'
		},
		nephew: {
			id: 'nephew',
			label: 'Nephew'
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
	},
	grandniblings: {
		id: 'grandniblings',
		label: 'Grand Nieces/Nephews',
		grandnibling: {
			id: 'grandnibling',
			label: 'grand niece or nephew'
		},
		grandniece: {
			id: 'grandniece',
			label: 'grandniece'
		},
		grandnephew: {
			id: 'grandnephew',
			label: 'grandnephew'
		}
	},
	secondCousinsBelow: {
		id: 'secondCousinsBelow',
		label: 'Second Cousins',
		secondCousinBelow: {
			id: 'secondCousinBelow',
			label: 'second cousin'
		}
	}
};
export default relationshipMap;

// specify compatible groups to show in the select element for each group
const { grandparentsMaternal, grandparentsPaternal } = relationshipMap;
export const grandparentsCompatibleGroups = {
	grandparentsMaternal,
	grandparentsPaternal
};

const { greatAunclesMaternal, greatAunclesPaternal } = relationshipMap;
export const greatAunclesCompatibleGroups = {
	greatAunclesMaternal,
	greatAunclesPaternal
};

const { parents, stepparentsMaternal, stepparentsPaternal, parentsInLaw } = relationshipMap;
export const parentsCompatibleGroups = {
	parents,
	stepparentsMaternal,
	stepparentsPaternal,
	parentsInLaw
};

const { aunclesMaternal, aunclesPaternal } = relationshipMap;
export const aunclesCompatibleGroups = {
	aunclesMaternal,
	aunclesPaternal
};

const { cousins, secondCousinsAbove, secondCousinsBelow } = relationshipMap;
export const cousinsCompatibleGroups = {
	cousins,
	secondCousinsAbove,
	secondCousinsBelow
};

const {
	siblings,
	halfSiblingsMaternal,
	halfSiblingsPaternal,
	stepsiblings,
	spouseSiblingsInLaw,
	siblingsInLaw
} = relationshipMap;
export const siblingsCompatibleGroups = {
	siblings,
	halfSiblingsMaternal,
	halfSiblingsPaternal,
	stepsiblings,
	spouseSiblingsInLaw,
	siblingsInLaw
};

const { spouses, exSpouses } = relationshipMap;
export const spouseCompatibleGroups = {
	spouses,
	exSpouses
};

const { niblings } = relationshipMap;
export const niblingsCompatibleGroups = {
	niblings
};

const { children, stepchildren, childrenInLaw } = relationshipMap;
export const childrenCompatibleGroups = {
	children,
	stepchildren,
	childrenInLaw
};

const { grandchildren, grandniblings } = relationshipMap;
export const grandchildrenCompatibleGroups = {
	grandchildren,
	grandniblings
};
