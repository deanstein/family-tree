<script>
	import {
		getFamilyTreeDataFromRepo,
		writeCurrentFamilyTreeDataToRepo
	} from '../../logic/persistenceManagement';
	import uiState from '../../stores/uiState';
	import FamilyTreeDataSelector from '../FamilyTreeDataSelector.svelte';

	const getDataButtonOnclickAction = () => {
		getFamilyTreeDataFromRepo('0', '8890');
	};

	const setDataButtonOnClickAction = () => {
		writeCurrentFamilyTreeDataToRepo('8890');
	};

	const toggleChooseTreeModal = () => {
		uiState.update((currentValue) => {
			currentValue.showChooseTreeModal = !currentValue.showChooseTreeModal;
			return currentValue;
		});
	};
</script>

<div id="storeview-toolbar-outer-container" class="storeview-toolbar-outer-container">
	<FamilyTreeDataSelector />
	<button on:click={getDataButtonOnclickAction}> GET DATA </button>
	<button on:click={setDataButtonOnClickAction}> SEND DATA </button>
	<button on:click={toggleChooseTreeModal}> Toggle Choose Tree Modal </button>
</div>

<style>
	.storeview-toolbar-outer-container {
		display: flex;
		justify-content: center;
		gap: 1vh;
		padding-top: 1vh;
		padding-bottom: 1vh;
		background-color: lightgray;
	}
</style>
