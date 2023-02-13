import { v4 as uuidv4 } from 'uuid';

import familyTreeData from '../stores/familyTreeData';
import { defaultPerson } from '../stores/relationshipMap';

export const createNewPerson = () => {
	let newPerson = defaultPerson;
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
		const index = getPersonIndexByKeyValue(currentValue.people, 'id', currentValue.activePerson.id);
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

export const getPersonIndexByKeyValue = (array, key, value) => {
	return array.findIndex((object) => object[key] === value);
};

export const getPersonById = (id) => {
	let person = undefined;

	familyTreeData.subscribe((currentValue) => {
		const { people } = currentValue;
		person = people.find((item) => item.id === id);
	});

	return person;
};

export const addPersonToGroup = (groupId, personId) => {
	familyTreeData.update((currentValue) => {
		return {
			...currentValue,
			...currentValue.activePerson,
			...currentValue.activePerson.relationships[groupId].push(personId)
		};
	});
};

export const addPersonToKnownPeople = (person) => {
	familyTreeData.update((currentValue) => {
		return {
			...currentValue,
			...currentValue.people.push(person)
		};
	});
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
