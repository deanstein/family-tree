import { writable } from 'svelte/store';

import { familyTree } from '../schemas/family-tree';

const familyTreeData = JSON.parse(JSON.stringify(familyTree)); // required to make a deep copy

export default writable(familyTreeData);
