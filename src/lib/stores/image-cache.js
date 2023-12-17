import { writable } from 'svelte/store';

const imageCache = {};

export default writable(imageCache);
