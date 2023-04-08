import { writable } from 'svelte/store';

const familyTreeData = {
	lastKnownActivePersonId: undefined,
	allPeople: []
};

export default writable(familyTreeData);
