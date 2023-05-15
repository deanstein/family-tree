import { v4 as uuidv4 } from 'uuid';

import { alternateName } from '../schemas/alternate-name';
import { person } from '../schemas/person';
import relationshipMap from '../schemas/relationship-map';

import uiState from '../stores/ui-state';
import familyTreeData from '../stores/family-tree-data';

import { getObjectByKeyValue, instantiateObject } from './utils';

import {
	addOrUpdatePersonInActivePersonGroup,
	initializeOffScreenPeopleIdsArray,
	updateOffScreenPeopleIdsArray,
	removePersonFromActivePersonGroup,
	setCachedActivePerson
} from './ui-management';
import { deepMatchObjects } from './utils';

export const createNewPerson = () => {
	const newPerson = JSON.parse(JSON.stringify(person)); // required to make a deep copy
	newPerson.id = uuidv4();
	return newPerson;
};

export const upgradePersonData = (personDataToMatch, personDataToModify) => {
	if (personDataToModify?.version == undefined) {
		personDataToModify['version'] = '0.0.0';
	}

	let upgraded = false;
	let originalVersion = personDataToModify?.version;

	if (personDataToModify?.version !== personDataToMatch?.version) {
		personDataToModify = deepMatchObjects(personDataToMatch, personDataToModify);
		upgraded = true;
	}

	if (upgraded) {
		personDataToModify['version'] = personDataToMatch.version;
		console.log(
			'Person upgraded: ' +
				personDataToModify.name +
				' (v' +
				originalVersion +
				') ' +
				'->' +
				' (v' +
				personDataToMatch.version +
				')'
		);
	}

	return personDataToModify;
};

export const getPersonById = (id) => {
	let person = undefined;

	familyTreeData.subscribe((currentValue) => {
		const { allPeople } = currentValue;
		person = allPeople.find((item) => item.id === id);
	});

	return person;
};

export const setActivePerson = (person) => {
	initializeOffScreenPeopleIdsArray();

	// instantiate the newest default person schema
	// to compare later for upgrade purposes or used as a new person
	const newPerson = createNewPerson();

	// if there's a person, upgrade it if necessary
	if (person) {
		const upgradedPersonData = upgradePersonData(newPerson, person);
		person = upgradedPersonData;
	} else {
		// if there's no person, make one
		person = newPerson;
		addPersonToPeopleArray(person);
	}

	uiState.update((currentValue) => {
		return {
			...currentValue,
			activePerson: person
		};
	});
	familyTreeData.update((currentValue) => {
		return {
			...currentValue,
			lastKnownActivePersonId: person.id
		};
	});
	setCachedActivePerson();
	updateOffScreenPeopleIdsArray();
};

export const setPersonName = (sPersonId, sName) => {
	familyTreeData.update((currentValue) => {
		let personIndex = getPersonIndexById(sPersonId);
		currentValue.allPeople[personIndex].name = sName;
		return currentValue;
	});
};

export const setPersonNameFromTemporaryState = (sPersonId) => {
	let temporaryName;
	uiState.subscribe((currentValue) => {
		temporaryName = currentValue.personNameTemporaryValue;
	});

	setPersonName(sPersonId, temporaryName);
};

export const setPersonRelationship = (sPersonId, sExistingRelationshipId, sNewRelationshipId) => {
	removePersonFromActivePersonGroup(sPersonId, sExistingRelationshipId);
	addOrUpdatePersonInActivePersonGroup(sPersonId, sNewRelationshipId);
};

export const setPersonRelationshipFromTemporaryState = (sPersonId, sExistingRelationshipId) => {
	let temporaryRelationship;
	uiState.subscribe((currentValue) => {
		temporaryRelationship = currentValue.relationshipIdTemporaryValue;
	});

	setPersonRelationship(sPersonId, sExistingRelationshipId, temporaryRelationship);
};

export const addAlternateName = (name) => {
	const newAlternateName = instantiateObject(alternateName);

	uiState.update((currentValue) => {
		currentValue.activePerson.alternateNames.push(newAlternateName);
		return currentValue;
	});
};

export const getPersonIndexById = (personId) => {
	let personIndex;

	familyTreeData.subscribe((currentValue) => {
		personIndex = currentValue.allPeople.findIndex((object) => object['id'] === personId);
	});

	return personIndex;
};

export const addPersonToPeopleArray = (person) => {
	familyTreeData.update((currentValue) => {
		currentValue.allPeople.push(person);
		return currentValue;
	});
};

export const removePersonFromPeopleArray = (person) => {
	familyTreeData.update((currentValue) => {
		const nSpliceIndex = currentValue.allPeople.indexOf(person);
		if (nSpliceIndex > -1) {
			currentValue.allPeople.splice(nSpliceIndex, 1);
		}
		return currentValue;
	});
};

export const addActivePersonToPeopleArray = () => {
	familyTreeData.update((currentValue) => {
		const index = getPersonIndexById(currentValue.lastKnownActivePersonId);
		const activePerson = getPersonById(currentValue.lastKnownActivePersonId);
		return {
			...currentValue,
			allPeople: [
				...currentValue.allPeople.slice(0, index),
				activePerson,
				...currentValue.allPeople.slice(index + 1)
			]
		};
	});
};

export const addOrUpdateActivePersonInNewPersonGroup = (personId, groupId) => {
	familyTreeData.update((currentValue) => {
		const sInverseRelationshipId = getInverseRelationshipId(groupId);
		const sInverseGroupId = getInverseGroupId(groupId);
		const nPersonIndex = getPersonIndexById(personId);
		const person = currentValue.allPeople[nPersonIndex];
		const nActivePersonIndex = getPersonIndexById(currentValue.lastKnownActivePersonId);
		const activePerson = currentValue.allPeople[nActivePersonIndex];

		//console.log (sInverseRelationshipId, sInverseGroupId, nPersonIndex, person, nActivePersonIndex, activePerson);

		const personReferenceObject = {
			id: currentValue.lastKnownActivePersonId,
			relationshipId: sInverseRelationshipId
		};

		const foundPersonReferenceObject = person.relationships[groupId].find(() => {
			if (personReferenceObject.id === currentValue.lastKnownActivePersonId)
				return personReferenceObject;
		});
		const nGroupIndex = activePerson.relationships[sInverseGroupId].indexOf(
			foundPersonReferenceObject
		);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			person.relationships[sInverseGroupId].push(personReferenceObject);
			// but if it exists, update with the new relationship id
		} else {
			person.relationships[sInverseGroupId][nGroupIndex].relationshipId = sInverseRelationshipId;
		}

		return currentValue;
	});
};

export const getInverseGroupId = (groupId) => {
	let inverseGroupId;

	switch (groupId) {
		case relationshipMap.grandparentsMaternal.id:
		case relationshipMap.grandparentsPaternal.id:
			inverseGroupId = relationshipMap.grandchildren.id;
			break;
		case relationshipMap.greatAunclesMaternal.id:
		case relationshipMap.greatAunclesPaternal.id:
			inverseGroupId = relationshipMap.grandniblings.id;
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
		case relationshipMap.aunclesMaternal.id:
		case relationshipMap.aunclesPaternal.id:
			inverseGroupId = relationshipMap.niblings.id;
			break;
		case relationshipMap.secondCousinsAbove.id:
			inverseGroupId = relationshipMap.secondCousinsBelow.id;
			break;
		case relationshipMap.cousins.id:
			inverseGroupId = relationshipMap.cousin.id;
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
		case relationshipMap.spouseSiblingsInLaw.id:
			inverseGroupId = relationshipMap.siblingsInLaw.id;
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
		case relationshipMap.niblings.id:
			inverseGroupId = relationshipMap.aunclesMaternal.id;
			break;
		case relationshipMap.stepchildren.id:
			inverseGroupId = relationshipMap.stepparentsMaternal.id;
			break;
		case relationshipMap.grandchildren.id:
			inverseGroupId = relationshipMap.grandparentsMaternal.id;
			break;
		case relationshipMap.grandniblings.id:
			inverseGroupId = relationshipMap.greatAunclesMaternal.id;
			break;
		case relationshipMap.secondCousinsBelow.id:
			inverseGroupId = relationshipMap.secondCousinsAbove.id;
			break;
		default:
			return undefined;
	}

	if (!inverseGroupId) {
		console.warn('Failed to find an inverse group id for group: ' + groupId);
	}

	return inverseGroupId;
};

export const getInverseRelationshipId = (groupId) => {
	let inverseId = undefined;
	uiState.subscribe((currentValue) => {
		let activePersonGender = currentValue.activePerson.gender;
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
			case relationshipMap.greatAunclesMaternal.id:
			case relationshipMap.greatAunclesPaternal.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.grandNiblings.grandnephew.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.grandNiblings.grandniece.id;
				} else {
					inverseId = relationshipMap.grandniblings.grandnibling.id;
				}
				break;
			case relationshipMap.parents.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.children.son.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.children.daughter.id;
				} else {
					inverseId = relationshipMap.children.child.id;
				}
				break;
			case relationshipMap.parentsInLaw.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.childrenInLaw.sonInLaw.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.childrenInLaw.daughterInLaw.id;
				} else {
					inverseId = relationshipMap.childrenInLaw.childInLaw.id;
				}
				break;
			case relationshipMap.stepparentsMaternal.id:
			case relationshipMap.stepparentsPaternal.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.stepchildren.stepson.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.stepchildren.stepdaughter.id;
				} else {
					inverseId = relationshipMap.stepchildren.stepchild.id;
				}
				break;
			case relationshipMap.aunclesMaternal.id:
			case relationshipMap.aunclesPaternal.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.niblings.nephew.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.niblings.niece.id;
				} else {
					inverseId = relationshipMap.niblings.nibling.id;
				}
				break;
			case relationshipMap.secondCousinsAbove.id:
				inverseId = relationshipMap.secondCousinsBelow.secondCousinBelow.id;
				break;
			case relationshipMap.cousins.id:
				inverseId = relationshipMap.cousins.cousin.id;
				break;
			case relationshipMap.siblings.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.siblings.brother.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.siblings.sister.id;
				} else {
					inverseId = relationshipMap.siblings.sibling.id;
				}
				break;
			case relationshipMap.halfSiblingsMaternal.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.halfSiblingsMaternal.halfbrotherMaternal.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.halfSiblingsMaternal.halfsisterMaternal.id;
				} else {
					inverseId = relationshipMap.halfSiblingsMaternal.halfSiblingMaternal.id;
				}
				break;
			case relationshipMap.halfSiblingsPaternal.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.halfSiblingsPaternal.halfBrotherPaternal.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.halfSiblingsPaternal.halfSisterPaternal.id;
				} else {
					inverseId = relationshipMap.halfSiblingsPaternal.halfsiblingPaternal.id;
				}
				break;
			case relationshipMap.stepsiblings.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.stepsiblings.stepbrother.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.stepsiblings.stepsister.id;
				} else {
					inverseId = relationshipMap.stepsiblings.stepsibling.id;
				}
				break;
			case relationshipMap.siblingsInLaw.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.siblingsInLaw.brotherInLaw.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.siblingsInLaw.sisterInLaw.id;
				} else {
					inverseId = relationshipMap.siblingsInLaw.siblingInLaw.id;
				}
				break;
			case relationshipMap.spouses.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.spouses.husband.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.spouses.wife.id;
				} else {
					inverseId = relationshipMap.spouses.partner.id;
				}
				break;
			case relationshipMap.spouseSiblingsInLaw.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.spouseSiblingsInLaw.spouseBrotherInLaw.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.spouseSiblingsInLaw.spouseSisterInLaw.id;
				} else {
					inverseId = relationshipMap.spouseSiblingsInLaw.spouseSiblingInLaw.id;
				}
				break;
			case relationshipMap.exSpouses.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.exSpouses.exHusband.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.exSpouses.exWife.id;
				} else {
					inverseId = relationshipMap.exSpouses.exPartner.id;
				}
				break;
			case relationshipMap.children.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.parents.father.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.parents.mother.id;
				} else {
					inverseId = relationshipMap.parents.parent.id;
				}
				break;
			case relationshipMap.stepchildren.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.stepparentsPaternal.stepfatherPaternal.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.stepparentsPaternal.stepmotherPaternal.id;
				} else {
					inverseId = relationshipMap.stepparentsPaternal.stepparentPaternal.id;
				}
				break;
			case relationshipMap.childrenInLaw.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.parentsInLaw.fatherInLaw.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.parentsInLaw.motherInLaw.id;
				} else {
					inverseId = relationshipMap.parentsInLaw.parentInLaw.id;
				}
				break;
			case relationshipMap.niblings.id:
				if (activePersonGender === 'male') {
					inverseId = relationshipMap.aunclesMaternal.uncleMaternal.id;
				} else if (activePersonGender === 'female') {
					inverseId = relationshipMap.aunclesMaternal.auntMaternal.id;
				} else {
					inverseId = relationshipMap.aunclesMaternal.auntMaternal.id;
				}
				break;
			case relationshipMap.grandchildren.id:
				inverseId = relationshipMap.grandparentsMaternal.grandparentMaternal.id;
				break;
			case relationshipMap.grandniblings.id:
				inverseId = relationshipMap.greatAunclesMaternal.greatAuncleMaternal.id;
				break;
			case relationshipMap.secondCousinsBelow.id:
				inverseId = relationshipMap.secondCousinsBelow.secondCousinBelow;
				break;
			default:
				return undefined;
		}
	});

	if (!inverseId) {
		console.warn('Failed to find an inverse relationship id for group: ' + groupId);
	}

	return inverseId;
};

export const getGroupIdFromRelationshipId = (relationshipId) => {
	let groupId;

	for (let key in relationshipMap) {
		if (typeof relationshipMap[key] === 'object') {
			for (let nestedKey in relationshipMap[key]) {
				if (relationshipMap[key][nestedKey].id === relationshipId) {
					groupId = relationshipMap[key].id;
					break;
				}
			}
		}
	}

	return groupId;
};

export function getDefaultRelationshipType(relationshipGroup) {
	for (const key in relationshipGroup) {
		if (typeof relationshipGroup[key] === 'object') {
			return relationshipGroup[key];
		}
	}
	return null;
}
