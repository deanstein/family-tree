import familyTreeData from './familyTreeData';

export const sDataVersion = '0.6.1';

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

export const getInverseGroupId = (groupId) => {
	let inverseGroupId;

	switch (groupId) {
		case relationshipMap.grandparentsMaternal.id:
		case relationshipMap.grandparentsPaternal.id:
			inverseGroupId = relationshipMap.grandchildren.id;
			break;
		case relationshipMap.parents.id:
			inverseGroupId = relationshipMap.children.id;
			break;
		case relationshipMap.parentsInLaw.id:
			inverseGroupId = relationshipMap.childrenInLaw.id;
			break;
		case relationshipMap.stepparentsMaternal.id:
		case relationshipMap.stepparentsPaternal.id:
			inverseGroupId = relationshipMap.stepchildren.id;
			break;
		case relationshipMap.siblings.id:
			inverseGroupId = relationshipMap.siblings.id;
			break;
		case relationshipMap.halfSiblingsMaternal.id:
			inverseGroupId = relationshipMap.halfSiblingsMaternal.id;
			break;
		case relationshipMap.halfSiblingsPaternal.id:
			inverseGroupId = relationshipMap.halfSiblingsPaternal.id;
			break;
		case relationshipMap.stepsiblings.id:
			inverseGroupId = relationshipMap.stepsiblings.id;
			break;
		case relationshipMap.siblingsInLaw.id:
			inverseGroupId = relationshipMap.siblingsInLaw.id;
			break;
		case relationshipMap.spouses.id:
			inverseGroupId = relationshipMap.spouses.id;
			break;
		case relationshipMap.exSpouses.id:
			inverseGroupId = relationshipMap.exSpouses.id;
			break;
		case relationshipMap.children.id:
			inverseGroupId = relationshipMap.parents.id;
			break;
		case relationshipMap.childrenInLaw.id:
			inverseGroupId = relationshipMap.parentsInLaw.id;
			break;
		case relationshipMap.stepchildren.id:
			inverseGroupId = relationshipMap.stepparentsMaternal.id;
			break;
		case relationshipMap.grandchildren.id:
			inverseGroupId = relationshipMap.grandparentsMaternal.id;
			break;
		default:
			return undefined;
	}
	return inverseGroupId;
};

export const getInverseRelationshipId = (groupId) => {
	let inverseId = undefined;
	familyTreeData.subscribe((familyTreeData) => {
		let activePersonGender = familyTreeData.activePerson.gender;
		switch (groupId) {
			case relationshipMap.grandparentsMaternal.id:
			case relationshipMap.grandparentsPaternal.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.grandchildren.grandson.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.grandchildren.granddaughter.id;
				} else {
					inverseId = relationshipMap.grandchildren.grandchild.id;
				}
				break;
			case relationshipMap.parents.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.children.son.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.children.daughter.id;
				} else {
					inverseId = relationshipMap.children.child.id;
				}
				break;
			case relationshipMap.parentsInLaw.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.children.soninlaw.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.children.daughterinlaw.id;
				} else {
					inverseId = relationshipMap.children.childinlaw.id;
				}
				break;
			case relationshipMap.stepparentsMaternal.id:
			case relationshipMap.stepparentsPaternal.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.children.stepson.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.children.stepdaughter.id;
				} else {
					inverseId = relationshipMap.children.stepchild.id;
				}
				break;
			case relationshipMap.siblings.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.siblings.brother.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.siblings.sister.id;
				} else {
					inverseId = relationshipMap.siblings.sibling.id;
				}
				break;
			case relationshipMap.halfSiblingsMaternal.id:
			case relationshipMap.halfSiblingsPaternal.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.siblings.halfbrother.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.siblings.halfsister.id;
				} else {
					inverseId = relationshipMap.siblings.halfsibling.id;
				}
				break;
			case relationshipMap.stepsiblings.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.siblings.stepbrother.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.siblings.stepsister.id;
				} else {
					inverseId = relationshipMap.siblings.stepsibling.id;
				}
				break;
			case relationshipMap.siblingsInLaw.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.siblings.brotherinlaw.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.siblings.sisterinlaw.id;
				} else {
					inverseId = relationshipMap.siblings.siblinginlaw.id;
				}
				break;
			case relationshipMap.spouses.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.spouses.husband.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.spouses.wife.id;
				} else {
					inverseId = relationshipMap.spouses.partner.id;
				}
				break;
			case relationshipMap.exSpouses.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.spouses.exhusband.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.spouses.exwife.id;
				} else {
					inverseId = relationshipMap.spouses.expartner.id;
				}
				break;
			case relationshipMap.children.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.parents.father.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.parents.mother.id;
				} else {
					inverseId = relationshipMap.parents.parent.id;
				}
				break;
			case relationshipMap.childrenInLaw.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.parents.fatherinlaw.id;
				} else if (familyTreeData.defaultPersonactivePerson.gender === 'female') {
					inverseId = relationshipMap.parents.motherinlaw.id;
				} else {
					inverseId = relationshipMap.parents.parentinlaw.id;
				}
				break;
			case relationshipMap.stepchildren.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.parents.stepfather.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.parents.stepmother.id;
				} else {
					inverseId = relationshipMap.parents.stepparent.id;
				}
				break;
			case relationshipMap.grandchildren.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = undefined;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = undefined;
				} else {
					inverseId = undefined;
				}
			default:
				return undefined;
		}
	});
	return inverseId;
};
