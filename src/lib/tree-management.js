import { activeFamilyTreeData, activePerson } from './states/family-tree-state';

import { createNewPerson, upgradePersonData } from './person-management';
import { get } from 'svelte/store';

export const getAllPeopleIds = (familyTreeData) => {
	return familyTreeData?.allPeople?.map((person) => person.id) || [];
};

export const filterPeopleIds = (peopleIds, idsToRemove) => {
	const idsArray = Array.isArray(idsToRemove) ? idsToRemove.map(String) : [String(idsToRemove)];
	return peopleIds.filter((id) => !idsArray.some((removeId) => removeId === id));
};

export const getPersonById = (familyTreeData, personId) => {
	return familyTreeData?.allPeople?.find((person) => person.id === personId) || null;
};

export const getPersonIndexById = (familyTreeData, personId) => {
	return familyTreeData?.allPeople?.findIndex((object) => object.id === personId) ?? -1;
};

export const getPersonIdByName = (familyTreeData, personId) => {
	return familyTreeData?.allPeople?.find((person) => person.name === personId) || null;
};

export const addPersonToPeopleArray = (person) => {
	activeFamilyTreeData.update((currentValue) => {
		currentValue.allPeople.push(person);
		return currentValue;
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
		addPersonToPeopleArray(person);
	}

	activePerson.set(person);
	activeFamilyTreeData.update((currentValue) => {
		return {
			...currentValue,
			lastKnownActivePersonId: person.id
		};
	});
};
