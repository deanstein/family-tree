import { activeFamilyTreeData, activePerson } from './states/family-tree-state';

import { createNewPerson, upgradePersonData } from './person-management';
import { get } from 'svelte/store';

export const getAllPeopleIds = () => {
	return get(activeFamilyTreeData)?.allPeople?.map((person) => person.id) || [];
};

export const filterPeopleIds = (peopleIds, idsToRemove) => {
	const idsArray = Array.isArray(idsToRemove) ? idsToRemove.map(String) : [String(idsToRemove)];
	return peopleIds.filter((id) => !idsArray.some((removeId) => removeId === id));
};

export const getPersonById = (personId) => {
	return get(activeFamilyTreeData)?.allPeople?.find((person) => person.id === personId) || null;
};

export const getPersonIndexById = (personId) => {
	return get(activeFamilyTreeData)?.allPeople?.findIndex((object) => object.id === personId) ?? -1;
};

export const getPersonIdByName = (personId) => {
	return get(activeFamilyTreeData)?.allPeople?.find((person) => person.name === personId) || null;
};

export const addOrUpdatePersonInPeopleArray = (person) => {
	activeFamilyTreeData.update((currentValue) => {
		const index = currentValue.allPeople.findIndex((p) => p.id === person.id);

		return {
			...currentValue,
			allPeople:
				index !== -1
					? [
							...currentValue.allPeople.slice(0, index),
							person,
							...currentValue.allPeople.slice(index + 1)
						]
					: [...currentValue.allPeople, person]
		};
	});
};

export const removePersonFromPeopleArray = (person) => {
	activeFamilyTreeData.update((currentValue) => {
		const nSpliceIndex = currentValue.allPeople.indexOf(person);
		if (nSpliceIndex > -1) {
			currentValue.allPeople.splice(nSpliceIndex, 1);
		}
		return currentValue;
	});
};

export const addActivePersonToPeopleArray = () => {
	activeFamilyTreeData.update((currentValue) => {
		const index = getPersonIndexById(currentValue.lastKnownActivePersonId);
		return {
			...currentValue,
			allPeople: [
				...currentValue.allPeople.slice(0, index),
				get(activePerson),
				// @ts-ignore
				...currentValue.allPeople.slice(index + 1)
			]
		};
	});
};

export const setActivePerson = (person) => {
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
		addOrUpdatePersonInPeopleArray(person);
	}

	activePerson.set(person);
	activeFamilyTreeData.update((currentValue) => {
		return {
			...currentValue,
			lastKnownActivePersonId: person.id
		};
	});
};
