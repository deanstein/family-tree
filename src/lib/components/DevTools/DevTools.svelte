<script>
	import { writeCurrentFamilyTreeDataToRepo } from '$lib/persistence-management';
	import { checkPersonForUnsavedChanges } from '$lib/temp-management';

	import { bioEditId } from '$lib/states/temp-state';
	import {
		activePerson,
		doShowChooseTreeModal,
		doShowDevTools,
		doShowStoreView,
		saveToRepoStatus
	} from '$lib/states/ui-state';

	import { enableScrolling, disableScrolling, scrollToTopAndCenter } from '$lib/ui-management';

	import { repoStateStrings } from '$lib/components/strings';

	import DevToolbar from '$lib/components/DevTools/DevToolbar.svelte';
	import DevToolsSubheader from '$lib/components/DevTools/DevToolsSubheader.svelte';
	import FamilyTreeDataSelector from '$lib/components/DevTools/FamilyTreeDataSelector.svelte';
	import StoreView from '$lib/components/DevTools/StoreView.svelte';
	import { get } from 'svelte/store';

	const setDataButtonOnClickAction = () => {
		writeCurrentFamilyTreeDataToRepo();
	};

	const toggleChooseTreeModal = () => {
		doShowChooseTreeModal.set(!get(doShowChooseTreeModal));
		if (get(doShowChooseTreeModal)) {
			scrollToTopAndCenter();
			if (!get(doShowDevTools)) {
				disableScrolling();
			}
		} else {
			enableScrolling();
		}
	};

	const testSaveNotification = () => {
		saveToRepoStatus.set(repoStateStrings.unsavedChanges);
	};

	const setBioEditActive = () => {
		bioEditId.set($activePerson.id);
	};
</script>

<div class="dev-tools-outer-container">
	<div class="dev-tools-title">DEV TOOLS</div>
	<DevToolsSubheader subheaderTitle="Interface Tools" />
	<DevToolbar>
		<button on:click={toggleChooseTreeModal}>
			{!$doShowChooseTreeModal ? 'Show' : 'Hide'} Choose Tree Modal
		</button>
		<button
			on:click={() => {
				checkPersonForUnsavedChanges($activePerson.id);
			}}>Check For Unsaved Changes</button
		>
		<button on:click={testSaveNotification}> Test Save Notification </button>
		<button on:click={setBioEditActive}> Set Bio Edit Active </button>
	</DevToolbar>
	<DevToolsSubheader subheaderTitle="Store Tools" />
	<DevToolbar>
		<button on:click={setDataButtonOnClickAction}> Send Data </button>
		<button
			on:click={() => {
				$doShowStoreView = !$doShowStoreView;
			}}
		>
			{!$doShowStoreView ? 'Show' : 'Hide'} Store View
		</button>
	</DevToolbar>
	{#if $doShowStoreView}
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
