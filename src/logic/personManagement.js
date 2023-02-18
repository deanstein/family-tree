import { v4 as uuidv4 } from 'uuid';

import familyTreeData from '../stores/familyTreeData';
import {
	relationshipMap,
	defaultPerson,
	getInverseRelationshipId
} from '../stores/relationshipMap';

export const createNewPerson = () => {
	let newPerson = { ...defaultPerson };
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

export const addPersonIdToActivePersonGroup = (personId, groupId, relationshipId) => {
	familyTreeData.update((currentValue) => {
		// add the person to the active person's proper relationship group
		console.log({ personId: personId, relationshipId: relationshipId });
		currentValue.activePerson.relationships[groupId].push(personId);

		// add the reverse - the active person to the new person's proper relationship group
		let inverseRelationshipId = getInverseRelationshipId(groupId);
		//let personIndex = getPersonIndexById(personId)
		console.log(inverseRelationshipId);
		//currentValue.people[personIndex]

		return currentValue;
	});
};

export const getGroupIdFromRelationshipId = (relationshipId) => {
	let groupId;

	for (let key in relationshipMap) {
		if (typeof relationshipMap[key] === 'object' && relationshipMap[key].id === relationshipId) {
			groupId = relationshipMap[key].id;
			break;
		}
	}

	return groupId;
};

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
