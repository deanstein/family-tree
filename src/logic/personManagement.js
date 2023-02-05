import familyTreeData from '../stores/familyTreeData';

export const setActivePerson = (person) => {
	const { siblings } = person;
	const siblingsObjs = [];
	siblings.forEach((siblingId) => {
		const person = findPersonById(siblingId);
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

export const findPersonById = (id) => {
	let person = undefined;

	familyTreeData.subscribe((currentValue) => {
		const { people } = currentValue;
		person = people.find((item) => item.id === id);
	});

	return person;
};

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

export function upgradePersonData(dataToMatch, dataToChange) {
	let upgraded = false;
	if (dataToChange?.version == undefined) {
		dataToChange['version'] = '0.0.0';
	}
	if (dataToChange?.version !== dataToMatch?.version) {
		for (const key in dataToMatch) {
			if (!(key in dataToChange)) {
				dataToChange[key] = typeof dataToMatch[key] === 'object' ? {} : typeof dataToMatch[key];
				upgraded = true;
			}
		}
	}
	if (upgraded) {
		dataToChange['version'] = dataToMatch.version;
	}
	return dataToChange;
}
