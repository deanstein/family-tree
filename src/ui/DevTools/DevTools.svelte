<script>
	import StoreView from './StoreView.svelte';
	import DevToolbar from './DevToolbar.svelte';

	import {
		getFamilyTreeDataFromRepo,
		writeCurrentFamilyTreeDataToRepo
	} from '../../logic/persistenceManagement';
	import uiState from '../../stores/uiState';
	import FamilyTreeDataSelector from '../FamilyTreeDataSelector.svelte';
	import DevToolsSubheader from './DevToolsSubheader.svelte';

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

<div id="dev-tools-outer-container" class="dev-tools-outer-container">
	<div id="dev-tools-title" class="dev-tools-title">DEV TOOLS</div>
	<DevToolsSubheader subheaderTitle="Interface Tools" />
	<DevToolbar>
		<button on:click={toggleChooseTreeModal}> Toggle Choose Tree Modal </button>
	</DevToolbar>
	<DevToolsSubheader subheaderTitle="Store Tools" />
	<DevToolbar>
		<FamilyTreeDataSelector />
		<button on:click={getDataButtonOnclickAction}> GET DATA </button>
		<button on:click={setDataButtonOnClickAction}> SEND DATA </button>
	</DevToolbar>
	<StoreView />
</div>

<style>
	.dev-tools-title {
		vertical-align: middle;
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		height: 4vh;
		margin-top: 10px;
		font-weight: bold;
		background-color: #cdbdba;
		color: #515151;
	}
</style>
