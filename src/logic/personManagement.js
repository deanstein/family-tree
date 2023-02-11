import { each } from 'svelte/internal';

import familyTreeData from '../stores/familyTreeData';
import relationshipMap from '../stores/relationshipMap';

export const setActivePersonOld = (person) => {
	const { siblings } = person;
	const siblingsObjs = [];
	siblings.forEach((siblingId) => {
		const person = getPersonById(siblingId);
		if (person) {
			siblingsObjs.push(person);
		}
	});

	familyTreeData.update((currentValue) => {
		return {
			...currentValue,
			activePerson: { ...person, siblings: siblingsObjs }
		};
	});
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
			people: [...currentValue.people, currentValue.people[index]]
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

// export const getOrAddPerson = (personId) => {
// 	if (findPersonById(personId) === undefined) {
// 		familyTreeData.update((currentValue) => {
// 			return {
// 				...currentValue,
// 				people: [...currentValue.people, person]
// 			};
// 		});
// 	}
// 	return personId.id;
// }

export const addPersonToKnownPeople = (person) => {
	familyTreeData.update((currentValue) => {
		return {
			...currentValue,
			people: [...currentValue.people, person]
		};
	});
};

const tryAddSibling = (person, siblingToAdd) => {
	let bIsAlreadySibling = false;

	person.siblings.forEach((person) => {
		if (person.name == siblingToAdd.name) {
			bIsAlreadySibling = true;
		}
	});

	if (!bIsAlreadySibling) {
		familyTreeData.update((currentValue) => {
			return {
				...currentValue,
				people: [...currentValue.people, person]
			};
		});
	}
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
			}
		}
	}
	return dataToChange;
}

export function upgradePersonData(personDataToMatch, personDataToModify) {
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
}

export const buildDefaultRelationshipMap = () => {
	let newObject = {};
	relationshipMap.subscribe((currentValue) => {
		Object.keys(currentValue).forEach(element => {
			newObject[element] = []
		});
	});
	return newObject;
}
