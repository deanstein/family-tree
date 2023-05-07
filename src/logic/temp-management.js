import tempState from '../stores/temp-state';

// bio editing mode
export const setBioEditId = (personId) => {
	tempState.update((currentValue) => {
		currentValue.bioEditPersonId = personId;
		return currentValue;
	});
};

export const unsetBioEditId = () => {
	tempState.update((currentValue) => {
		currentValue.bioEditPersonId = undefined;
		return currentValue;
	});
};
