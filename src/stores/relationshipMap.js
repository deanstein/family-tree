import { writable } from 'svelte/store';

import familyTreeData from './familyTreeData';

const relationshipMap = {
	grandparentsMaternal: {
		grandmotherMaternal: {
			id: `55c82287-e459-4edc-9572-6b378852ee62`,
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'maternal grandmother'
		},
		grandfatherMaternal: {
			id: 'e9d16b54-2fb5-44b6-851f-705a385a37a5',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'maternal grandfather'
		},
		grandparentMaternal: {
			id: 'e1da4faf-60a8-4448-a15a-7604336b8e5f',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: ''
		}
	},
	grandparentsPaternal: {
		grandmotherPaternal: {
			id: '0cc38bf2-aa7e-48d8-a2e3-a52de1a7fe8f',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'paternal grandmother'
		},
		grandfatherPaternal: {
			id: '2b277f1c-10ac-46b4-97d2-57faf8ccfe46',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: 'paternal grandfather'
		},
		grandparentPaternal: {
			id: 'f06ab000-bab7-45d1-8b81-97e6f20c5a94',
			get inverseId() {
				return getGrandparentInverseId();
			},
			label: ''
		}
	},
	parents: {
		mother: {
			id: '645f5a03-d493-4dd3-8b9e-e41ed4983a2f',
			get inverseId() {
				return getParentInverseId();
			},
			label: 'mother'
		},
		father: {
			id: 'e9dc43f3-620f-4441-a6cf-16441efe9333',
			get inverseId() {
				return getParentInverseId();
			},
			label: 'father'
		},
		parent: {
			id: 'd31fdbf8-2a46-41bd-b0b8-ed9c4dfd8cb9',
			get inverseId() {
				return getParentInverseId();
			},
			label: ''
		},
		motherinlaw: {
			id: '7042c0e5-1d70-4aa7-b59b-27299a9e54dd',
			get inverseId() {
				return getParentInLawInverseId();
			},
			label: 'mother-in-law'
		},
		fatherinlaw: {
			id: '411ee387-4754-4d21-804a-120f1d76cab6',
			get inverseId() {
				return getParentInLawInverseId();
			},
			label: 'father-in-law'
		},
		parentinlaw: {
			id: 'cdb2fc95-49f6-4086-9cb3-f0873d8beca4',
			get inverseId() {
				return getParentInLawInverseId();
			},
			label: ''
		}
	},
	stepparentsMaternal: {
		label: 'Maternal Step Parents',
		stepmotherMaternal: {
			id: '34233e41-3bed-461d-a363-65ee80eeb106',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepmother'
		},
		stepfatherMaternal: {
			id: '4b48a36a-1ed9-4240-bdb0-22fe7af6600b',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepfather'
		},
		stepparentMaternal: {
			id: '874aa17a-cd1f-462a-89cc-a35b491c0a93',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: ''
		}
	},
	stepparentsPaternal: {
		stepmotherPaternal: {
			id: 'bcb1fb0d-4f2b-476d-b51d-63a3fde942e8',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepmother'
		},
		stepfatherPaternal: {
			id: '55f95b08-acde-4cef-bdca-958187206720',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: 'stepfather'
		},
		stepparentPaternal: {
			id: '16071b46-f3f4-400d-8735-fe88fd33110a',
			get inverseId() {
				return getStepParentInverseId();
			},
			label: ''
		}
	},
	siblings: {
		sister: {
			id: '92441840-f709-449b-b5fa-432f167c005f',
			get inverseId() {
				return getSiblingInverseId();
			},
			label: 'sister'
		},
		brother: {
			id: '01d5fc91-21f8-4898-a1e7-27cec1849fcd',
			get inverseId() {
				return getSiblingInverseId();
			},
			label: 'brother'
		},
		sibling: {
			id: '07cce21c-2088-4d47-87ac-9f2433aafc2c',
			get inverseId() {
				return getSiblingInverseId();
			},
			label: ''
		},
		stepsister: {
			id: '18d69801-1996-4e1b-a3e2-007e39005191',
			get inverseId() {
				return getStepSiblingInverseId();
			},
			label: 'stepsister'
		},
		stepbrother: {
			id: '6a1ff6aa-baa2-48ae-8108-37b4ef0dcceb',
			get inverseId() {
				return getStepSiblingInverseId();
			},
			label: 'stepbrother'
		},
		stepsibling: {
			id: 'd77914b2-9ee4-434d-baf2-8d20015a18d4',
			get inverseId() {
				return getStepSiblingInverseId();
			},
			label: 'stepsibling'
		},
		sisterinlaw: {
			get inverseId() {
				return getSiblingInLawInverseId();
			},
			id: 'e2bc7a03-4ab9-4247-9644-cdd4b7022a3e',
			label: 'sister-in-law'
		},
		brotherinlaw: {
			id: '5ade9695-43b4-423c-8028-495a962c52a9',
			get inverseId() {
				return getSiblingInLawInverseId();
			},
			label: 'brother-in-law'
		},
		siblinginlaw: {
			id: 'fcdca2de-1ba2-42f0-b59e-ef7de17e9a8e',
			get inverseId() {
				return getSiblingInLawInverseId();
			},
			label: 'sibling-in-law'
		}
	},
	halfSiblingsMaternal: {
		halfsisterMaternal: {
			id: 'a69c6683-0fe9-48a9-a283-5d3401fb11ff',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sister'
		},
		halfbrotherMaternal: {
			id: '6c233615-1806-4d61-a6b8-39b572efdaf5',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half brother'
		},
		halfsiblingMaternal: {
			id: 'ac197548-64a7-4a48-bd1f-6b6f3788e4c8',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sibling'
		}
	},
	halfSiblingsPaternal: {
		halfsisterPaternal: {
			id: 'd2dfaa50-54da-4ab3-9266-3c0898cf9905',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sister'
		},
		halfbrotherPaternal: {
			id: '42612fc6-71a3-40da-9e81-6c66dca16aac',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half brother'
		},
		halfsiblingPaternal: {
			id: 'fd16d40d-709c-41ee-867a-a7b6781df492',
			get inverseId() {
				return getHalfSiblingInverseId();
			},
			label: 'half sibling'
		}
	},
	spouses: {
		wife: {
			id: '2a39b80f-d6b5-4628-8055-7e91fc305a84',
			get inverseId() {
				return getSpouseInverseId();
			},
			label: 'wife'
		},
		husband: {
			id: '151b05a1-c09b-436f-bf19-2792d99b1da3',
			get inverseId() {
				return getSpouseInverseId();
			},
			label: 'husband'
		},
		exwife: {
			id: 'a97b5aa1-f328-463c-aaf3-4fa06034f592',
			get inverseId() {
				return getExSpouseInverseId();
			},
			label: 'ex-wife'
		},
		exhusband: {
			id: '9ba9f9a2-fa93-4693-aeaa-23e46b946665',
			get inverseId() {
				return getExSpouseInverseId();
			},
			label: 'ex-husband'
		},
		partner: {
			id: '79cc9124-2785-48b5-a0fc-e7469f0a9554',
			inverseId: '79cc9124-2785-48b5-a0fc-e7469f0a9554',
			label: 'partner'
		},
		expartner: {
			id: '19a3e409-49e0-4b5e-af6b-31e6cd4104d6',
			inverseId: '19a3e409-49e0-4b5e-af6b-31e6cd4104d6',
			label: 'ex-partner'
		}
	},
	children: {
		daughter: {
			id: '6ad4a51b-e740-450a-ae7a-51991731802c',
			get inverseId() {
				return getChildrenInverseId();
			},
			label: 'daughter'
		},
		son: {
			id: '4c8ef3fc-18ac-4e28-940b-f8dfef366791',
			get inverseId() {
				return getChildrenInverseId();
			},
			label: 'son'
		},
		child: {
			id: '8987c1bd-991a-4e74-bd7a-ed5a742a68e3',
			get inverseId() {
				return getChildrenInverseId();
			},
			label: ''
		}
	},
	stepchildren: {
		stepdaughter: {
			id: 'ad7010d1-55fb-4796-bd14-cab9882c7c00',
			get inverse() {
				return getStepChildrenInverseId();
			},
			label: 'stepdaughter'
		},
		stepson: {
			id: 'c79fbfb4-0c10-4709-9dd8-92158710422f',
			get inverseId() {
				return getStepChildrenInverseId();
			},
			label: 'stepson'
		},
		stepchild: {
			id: '5719d093-5a47-4307-8f7d-f61503535ffa',
			get inverseId() {
				return getStepChildrenInverseId();
			},
			label: 'stepchild'
		}
	},
	childrenInLaw: {
		label: 'Children in Law',
		daughterinlaw: {
			id: 'bf8b0de7-1811-4324-ba2f-c09470ba5397',
			get inverseId() {
				return getChildInLawInverseId();
			},
			label: 'daughter-in-law'
		},
		soninlaw: {
			id: '22fe3f43-105d-41e8-b512-a7edbca21f87',
			label: 'son-in-law',
			get inverseId() {
				return getChildInLawInverseId();
			}
		},
		childinlaw: {
			id: '102206cb-3472-4fec-b1b6-008bd4cda474',
			get inverseId() {
				return getChildInLawInverseId();
			},
			label: ''
		}
	},
	grandchildren: {
		granddaughter: {
			id: 'aa57ffd9-7e18-4ca5-800f-002756d1a73c',
			get inverseId() {
				return getGrandchildrenInverseId();
			},
			label: 'granddaughter'
		},
		grandson: {
			id: '9e3e7d23-d9e5-478c-9b7e-e4d521a851f2',
			get inverseId() {
				return getGrandchildrenInverseId();
			},
			label: 'grandson'
		},
		grandchild: {
			id: '45cc5f95-54cc-4ef3-a9d7-9a9946f30ade',
			get inverseId() {
				return getGrandchildrenInverseId();
			},
			label: 'grandchild'
		}
	}
};

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

export default writable(relationshipMap);
