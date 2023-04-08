import { writable } from 'svelte/store';

const familyTreeData = {
	sLastKnownActivePersonId: undefined,
	aAllPeople: []
};

export default writable(familyTreeData);
