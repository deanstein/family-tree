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

	console.log(siblingsObjs);

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
