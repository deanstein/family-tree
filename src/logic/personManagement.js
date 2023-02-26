import { v4 as uuidv4 } from 'uuid';

import familyTreeData from '../stores/familyTreeData';
import relationshipMap from '../stores/relationshipMap';
import {
	defaultPerson,
	getInverseGroupId,
	getInverseRelationshipId
} from '../stores/relationshipMap';

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

export const syncActivePersonToTree = () => {
	familyTreeData.update((currentValue) => {
		const index = getPersonIndexById(currentValue.activePerson.id);
		return {
			...currentValue,
			people: [
				...currentValue.people.slice(0, index),
				currentValue.activePerson,
				...currentValue.people.slice(index + 1)
			]
		};
	});
};

export const getPersonIndexById = (personId) => {
	let personIndex;

	familyTreeData.subscribe((currentValue) => {
		personIndex = currentValue.people.findIndex((object) => object['id'] === personId);
	});

	return personIndex;
};

export const getPersonById = (id) => {
	let person = undefined;

	familyTreeData.subscribe((currentValue) => {
		const { people } = currentValue;
		person = people.find((item) => item.id === id);
	});

	return person;
};

export const addPersonToKnownPeople = (person) => {
	familyTreeData.update((currentValue) => {
		currentValue.people.push(person);
		return currentValue;
	});
};

export const addOrUpdatePersonReferenceObjectInActivePersonGroup = (sPersonId, sRelationshipId) => {
	familyTreeData.update((currentValue) => {
		console.log(sPersonId, sRelationshipId)
		const sGroupId = getGroupIdFromRelationshipId(sRelationshipId);

		const personReferenceObject = {
			id: sPersonId,
			relationshipId: sRelationshipId
		};

		const foundPersonReferenceObject = currentValue.activePerson.relationships[sGroupId].find((personObject) => {
			if (personObject.id === sPersonId)
			return personReferenceObject;
		});
		const nGroupIndex = currentValue.activePerson.relationships[sGroupId].indexOf(foundPersonReferenceObject);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			currentValue.activePerson.relationships[sGroupId].push(personReferenceObject);
		// but if it exists, update with the new relationship id
		} else {
			console.log('blocked from adding')
			currentValue.activePerson.relationships[sGroupId][nGroupIndex].relationshipId = sRelationshipId;
		}

		return currentValue;
	});
};

export const addOrUpdateActivePersonReferenceObjectInNewPersonGroup = (personId, groupId) => {
	familyTreeData.update((currentValue) => {

		const inverseRelationshipId = getInverseRelationshipId(groupId);
		const inverseGroupId = getInverseGroupId(groupId);
		const personIndex = getPersonIndexById(personId);

		const personReferenceObject = {
			id: currentValue.activePerson.id,
			relationshipId: inverseRelationshipId
		};

		const foundPersonReferenceObject = currentValue.people[personIndex].relationships[groupId].find(() => {
			if (personReferenceObject.id === currentValue.activePerson.id)
			return personReferenceObject;
		});
		const nGroupIndex = currentValue.activePerson.relationships[inverseGroupId].indexOf(foundPersonReferenceObject);

		// only add if it doesn't exist yet
		if (!foundPersonReferenceObject) {
			currentValue.people[personIndex].relationships[inverseGroupId].push(personReferenceObject);
		// but if it exists, update with the new relationship id
		} else {
			currentValue.people[personIndex].relationships[inverseGroupId][nGroupIndex].relationshipId = inverseRelationshipId;
		}

		return currentValue;
	});
};

export const getGroupIdFromRelationshipId = (relationshipId) => {
	let groupId;

	for (let key in relationshipMap) {
		if (typeof relationshipMap[key] === 'object')
		{
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

function modifyObject(obj, key, value) {
	for (var prop in obj) {
		if (prop == key) {
			obj[prop] = value;
		} else if (typeof obj[prop] == 'object') {
			modifyObject(obj[prop], key, value);
		}
	}
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
	let upgraded = false;
	if (personDataToModify?.version == undefined) {
		personDataToModify['version'] = '0.0.0';
	}
	if (personDataToModify?.version !== personDataToMatch?.version) {
		personDataToModify = deepMatchObjects(personDataToMatch, personDataToModify);
		upgraded = true;
	}
	if (upgraded) {
		personDataToModify['version'] = personDataToMatch.version;
		console.log('Person upgraded: ' + personDataToModify.name);
	}
	return personDataToModify;
};

function findParentKey(id, obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			const child = obj[key];
			if (child.id === id) {
				return obj.id;
			}
			if (typeof child === 'object') {
				const result = findParentKey(id, child);
				if (result) {
					return result;
				}
			}
		}
	}
	return null;
}

function findKeyInObject(obj, key, value) {
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			if (k === key && obj[k] === value) {
				return obj;
			} else if (typeof obj[k] === 'object') {
				var result = findKeyInObject(obj[k], key, value);
				if (result) {
					return result;
				}
			}
		}
	}
	return null;
}
