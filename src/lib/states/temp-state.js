import { writable } from 'svelte/store';

// only one PersonNode edit instance can be active at a time
export let isPersonNodeEditActive = writable(false);
