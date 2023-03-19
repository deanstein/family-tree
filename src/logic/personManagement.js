import { v4 as uuidv4 } from 'uuid';

import familyTreeData from '../stores/familyTreeData';
import relationshipMap from '../stores/relationshipMap';
import { defaultPerson } from '../stores/relationshipMap';

export const createNewPerson = () => {
	const newPerson = JSON.parse(JSON.stringify(defaultPerson)); // required to make a deep copy
	newPerson.id = uuidv4();
	return newPerson;
};

export const setActivePerson = (person) => {
	familyTreeData.update((currentValue) => {
		return {
			...currentValue,
			activePerson: person
		};
	});
};

export const getPersonIndexById = (personId) => {
	let personIndex;

	familyTreeData.subscribe((currentValue) => {
		personIndex = currentValue.aAllPeople.findIndex((object) => object['id'] === personId);
	});

	return personIndex;
};

export const getPersonById = (id) => {
	let person = undefined;

	familyTreeData.subscribe((currentValue) => {
		const { aAllPeople } = currentValue;
		person = aAllPeople.find((item) => item.id === id);
	});

	return person;
};

export const addPersonToPeopleArray = (person) => {
	familyTreeData.update((currentValue) => {
		currentValue.aAllPeople.push(person);
		return currentValue;
	});
};

export const removePersonFromPeopleArray = (person) => {
	familyTreeData.update((currentValue) => {
		const nSpliceIndex = currentValue.aAllPeople.indexOf(person);
		if (nSpliceIndex > -1) {
			currentValue.aAllPeople.splice(nSpliceIndex, 1);
		}
		return currentValue;
	});
};

export const addActivePersonToPeopleArray = () => {
	familyTreeData.update((currentValue) => {
		const index = getPersonIndexById(currentValue.activePerson.id);
		return {
			...currentValue,
			aAllPeople: [
				...currentValue.aAllPeople.slice(0, index),
				currentValue.activePerson,
				...currentValue.aAllPeople.slice(index + 1)
			]
		};
	});
};

export const addPersonIdToActiveRelatedPeopleIdsArray = (sPersonId) => {
	familyTreeData.update((currentValue) => {
		const nActiveRelatedPersonIdSpliceIndex =
			currentValue.aActivePersonRelatedPeopleIds.indexOf(sPersonId);
		const nAvailableRelatedPersonIdSpliceIndex =
			currentValue.aAvailablePeopleIds.indexOf(sPersonId);

		if (nActiveRelatedPersonIdSpliceIndex === -1) {
			currentValue.aActivePersonRelatedPeopleIds.push(sPersonId);
		}

		if (nAvailableRelatedPersonIdSpliceIndex > -1) {
			currentValue.aAvailablePeopleIds.splice(nAvailableRelatedPersonIdSpliceIndex, 1);
		}

		return currentValue;
	});
};

export const removePersonIdFromActiveRelatedPeopleIdsArray = (sPersonId) => {
	familyTreeData.update((currentValue) => {
		const nActiveRelatedPersonIdSpliceIndex =
			currentValue.aActivePersonRelatedPeopleIds.indexOf(sPersonId);
		const nAvailableRelatedPersonIdSpliceIndex =
			currentValue.aAvailablePeopleIds.indexOf(sPersonId);

		if (nActiveRelatedPersonIdSpliceIndex > -1) {
			currentValue.aActivePersonRelatedPeopleIds.splice(nActiveRelatedPersonIdSpliceIndex, 1);
		}

		if (nAvailableRelatedPersonIdSpliceIndex === -1) {
			currentValue.aAvailablePeopleIds.push(sPersonId);
		}

		return currentValue;
	});
};

export const addOrUpdatePersonInActivePersonGroup = (sPersonId, sRelationshipId) => {
	familyTreeData.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = {
			id: sPersonId,
			relationshipId: sRelationshipId
		};

		const foundPersonReferenceObject = currentValue.activePerson.relationships[sGroupId].find(
			(personObject) => {
				if (personObject.id === sPersonId) return personReferenceObject;
			}
		);
		const nGroupIndex = currentValue.activePerson.relationships[sGroupId].indexOf(
			foundPersonReferenceObject
		);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			currentValue.activePerson.relationships[sGroupId].push(personReferenceObject);
			// but if it exists, update with the new relationship id
		} else {
			console.log('blocked from adding');
			currentValue.activePerson.relationships[sGroupId][nGroupIndex].relationshipId =
				sRelationshipId;
		}

		return currentValue;
	});
};

export const removePersonFromActivePersonGroup = (sPersonId, sRelationshipId) => {
	familyTreeData.update((currentValue) => {
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = {
			id: sPersonId,
			relationshipId: sRelationshipId
		};

		const foundPersonReferenceObject = currentValue.activePerson.relationships[sGroupId].find(
			(personObject) => {
				if (personObject.id === sPersonId) return personReferenceObject;
			}
		);

		const nSpliceIndex = currentValue.activePerson.relationships[sGroupId].indexOf(
			foundPersonReferenceObject
		);

		if (nSpliceIndex > -1) {
			currentValue.activePerson.relationships[sGroupId].splice(nSpliceIndex, 1);
		}

		return currentValue;
	});
};

export const addOrUpdateActivePersonInNewPersonGroup = (personId, groupId) => {
	familyTreeData.update((currentValue) => {
		const inverseRelationshipId = getInverseRelationshipId(groupId);
		const inverseGroupId = getInverseGroupId(groupId);
		const personIndex = getPersonIndexById(personId);

		const personReferenceObject = {
			id: currentValue.activePerson.id,
			relationshipId: inverseRelationshipId
		};

		const foundPersonReferenceObject = currentValue.aAllPeople[personIndex].relationships[
			groupId
		].find(() => {
			if (personReferenceObject.id === currentValue.activePerson.id) return personReferenceObject;
		});
		const nGroupIndex = currentValue.activePerson.relationships[inverseGroupId].indexOf(
			foundPersonReferenceObject
		);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			currentValue.aAllPeople[personIndex].relationships[inverseGroupId].push(
				personReferenceObject
			);
			// but if it exists, update with the new relationship id
		} else {
			currentValue.aAllPeople[personIndex].relationships[inverseGroupId][
				nGroupIndex
			].relationshipId = inverseRelationshipId;
		}

		return currentValue;
	});
};

export const updateAvailablePeopleIdsFilteredArray = (sFilter) => {
	const sFilterUppercase = sFilter.toUpperCase();

	familyTreeData.update((currentValue) => {
		currentValue.aAvailablePeopleIdsFiltered = [];

		// for each id, get name and see if the filter is contained in the name
		currentValue.aAvailablePeopleIds.forEach((sPersonId) => {
			const sPersonName = getPersonById(sPersonId).name.toUpperCase();
			if (sPersonName.indexOf(sFilterUppercase) > -1) {
				currentValue.aAvailablePeopleIdsFiltered.push(sPersonId);
			} else {
				const nPersonIdIndex = currentValue.aAvailablePeopleIdsFiltered.indexOf(sPersonId);
				if (nPersonIdIndex != -1) {
					currentValue.aAvailablePeopleIdsFiltered.splice(nPersonIdIndex, 1);
				}
			}
		});

		// if nothing in the text box, show all available people
		if (sFilterUppercase === '') {
			currentValue.aAvailablePeopleIdsFiltered = currentValue.aAvailablePeopleIds;
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
					inverseId = relationshipMap.childrenInLaw.sonInLaw.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.childrenInLaw.daughterInLaw.id;
				} else {
					inverseId = relationshipMap.childrenInLaw.childInLaw.id;
				}
				break;
			case relationshipMap.stepparentsMaternal.id:
			case relationshipMap.stepparentsPaternal.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.stepchildren.stepson.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.stepchildren.stepdaughter.id;
				} else {
					inverseId = relationshipMap.stepchildren.stepchild.id;
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
					inverseId = relationshipMap.halfSiblingsMaternal.halfbrother.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.siblings.halfsister.id;
				} else {
					inverseId = relationshipMap.siblings.halfsibling.id;
				}
				break;
			case relationshipMap.stepsiblings.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.stepsiblings.stepbrother.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.stepsiblings.stepsister.id;
				} else {
					inverseId = relationshipMap.stepsiblings.stepsibling.id;
				}
				break;
			case relationshipMap.siblingsInLaw.id:
				if (familyTreeData.activePerson.gender === 'male') {
					inverseId = relationshipMap.siblingsInLaw.brotherInLaw.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.siblingsInLaw.sisterInLaw.id;
				} else {
					inverseId = relationshipMap.siblingsInLaw.siblingInLaw.id;
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
					inverseId = relationshipMap.exSpouses.exHusband.id;
				} else if (familyTreeData.activePerson.gender === 'female') {
					inverseId = relationshipMap.exSpouses.exWife.id;
				} else {
					inverseId = relationshipMap.exSpouses.exPartner.id;
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

function deepMatchObjects(dataToMatch, dataToChange) {
	for (var key in dataToMatch) {
		if (!dataToChange.hasOwnProperty(key)) {
			if (Array.isArray(dataToMatch[key])) {
				dataToChange[key] = [];
			} else if (typeof dataToMatch[key] === 'string') {
				dataToChange[key] = '';
			} else {
				dataToChange[key] = {};
				deepMatchObjects(dataToMatch[key], dataToChange[key]);
			}
		}
	}
	return dataToChange;
}

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
