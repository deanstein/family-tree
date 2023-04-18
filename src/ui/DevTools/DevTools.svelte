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
	import {
		enableScrolling,
		disableScrolling,
		scrollToTopAndCenter
	} from '../../logic/uiManagement';
	import { repoSaveStateStrings } from '../strings';

	const getDataButtonOnclickAction = () => {
		getFamilyTreeDataFromRepo('0', '8890');
	};

	const setDataButtonOnClickAction = () => {
		writeCurrentFamilyTreeDataToRepo('8890');
	};

	const toggleStoreView = () => {
		uiState.update((currentValue) => {
			currentValue.showStoreView = !currentValue.showStoreView;
			return currentValue;
		});
	};

	const toggleChooseTreeModal = () => {
		uiState.update((currentValue) => {
			currentValue.showChooseTreeModal = !currentValue.showChooseTreeModal;
			if (currentValue.showChooseTreeModal) {
				scrollToTopAndCenter();
				if (!currentValue.showDevTools) {
					disableScrolling();
				}
			} else {
				enableScrolling();
			}
			return currentValue;
		});
	};

	const testSaveNotification = () => {
		uiState.update((currentValue) => {
			currentValue.saveToRepoStatus = repoSaveStateStrings.unsavedChanges;
			return currentValue;
		});
	};
</script>

<div id="dev-tools-outer-container" class="dev-tools-outer-container">
	<div id="dev-tools-title" class="dev-tools-title">DEV TOOLS</div>
	<DevToolsSubheader subheaderTitle="Interface Tools" />
	<DevToolbar>
		<button on:click={toggleChooseTreeModal}>
			{!$uiState.showChooseTreeModal ? 'Show' : 'Hide'} Choose Tree Modal
		</button>
		<button on:click={testSaveNotification}> Test Save Notification </button>
	</DevToolbar>
	<DevToolsSubheader subheaderTitle="Store Tools" />
	<DevToolbar>
		<FamilyTreeDataSelector />
		<button on:click={getDataButtonOnclickAction}> Get Data </button>
		<button on:click={setDataButtonOnClickAction}> Send Data </button>
		<button on:click={toggleStoreView}>
			{!$uiState.showStoreView ? 'Show' : 'Hide'} Store View
		</button>
	</DevToolbar>
	{#if $uiState.showStoreView}
		<StoreView />
	{/if}
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
