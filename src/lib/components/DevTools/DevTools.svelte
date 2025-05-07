<script>
	import { writeCurrentFamilyTreeDataToRepo } from '$lib/persistence-management';
	import { checkPersonForUnsavedChanges } from '$lib/temp-management';

	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';

	import { enableScrolling, disableScrolling, scrollToTopAndCenter } from '$lib/ui-management';

	import { repoStateStrings } from '$lib/components/strings';

	import DevToolbar from '$lib/components/DevTools/DevToolbar.svelte';
	import DevToolsSubheader from '$lib/components/DevTools/DevToolsSubheader.svelte';
	import FamilyTreeDataSelector from '$lib/components/DevTools/FamilyTreeDataSelector.svelte';
	import StoreView from '$lib/components/DevTools/StoreView.svelte';
	import { bioEditId } from '$lib/states/temp-state';

	const setDataButtonOnClickAction = () => {
		writeCurrentFamilyTreeDataToRepo();
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
			currentValue.saveToRepoStatus = repoStateStrings.unsavedChanges;
			return currentValue;
		});
	};

	const setBioEditActive = () => {
		bioEditId.set($uiState.activePerson.id);
	}
</script>

<div class="dev-tools-outer-container">
	<div class="dev-tools-title">DEV TOOLS</div>
	<DevToolsSubheader subheaderTitle="Interface Tools" />
	<DevToolbar>
		<button on:click={toggleChooseTreeModal}>
			{!$uiState.showChooseTreeModal ? 'Show' : 'Hide'} Choose Tree Modal
		</button>
		<button
			on:click={() => {
				checkPersonForUnsavedChanges($uiState.activePerson.id);
			}}>Check For Unsaved Changes</button
		>
		<button on:click={testSaveNotification}> Test Save Notification </button>
		<button on:click={setBioEditActive}> Set Bio Edit Active </button>
	</DevToolbar>
	<DevToolsSubheader subheaderTitle="Store Tools" />
	<DevToolbar>
		<FamilyTreeDataSelector />
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
