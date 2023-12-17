import { writable } from 'svelte/store';

import { instantiateObject } from '../utils';
import { familyTree } from '../schemas/family-tree';

const familyTreeData = instantiateObject(familyTree);

export default writable(familyTreeData);
